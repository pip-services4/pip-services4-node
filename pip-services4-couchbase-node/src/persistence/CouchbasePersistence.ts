/** @module persistence */
import { IReferenceable, IdGenerator } from 'pip-services4-commons-node';
import { IUnreferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ICleanable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { InvalidStateException } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { CouchbaseConnection } from '../connect/CouchbaseConnection';

/**
 * Abstract persistence component that stores data in Couchbase
 * and is based using Couchbaseose object relational mapping.
 * 
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._collection</code> or <code>this._model</code> properties.
 * 
 * ### Configuration parameters ###
 * 
 * - bucket:                      (optional) Couchbase bucket name
 * - connection(s):    
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):    
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  (optional) user name
 *   - password:                  (optional) user password
 * - options:
 *   - auto_create:               (optional) automatically create missing bucket (default: false)
 *   - auto_index:                (optional) automatically create primary index (default: false)
 *   - flush_enabled:             (optional) bucket flush enabled (default: false)
 *   - bucket_type:               (optional) bucket type (default: couchbase)
 *   - ram_quota:                 (optional) RAM quota in MB (default: 100)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 * 
 * ### Example ###
 * 
 *     class MyCouchbasePersistence extends CouchbasePersistence<MyData> {
 *    
 *       public constructor() {
 *           base("mydata", "mycollection", new MyDataCouchbaseSchema());
 *     }
 * 
 *     public getByName(context: IContext, name: string): Promise<MyData> {
 *         let criteria = { name: name };
 *         return new Promise((resolve, reject) => {
 *            this._model.findOne(criteria, (err, value) => {
 *                if (err == null) resolve(value);
 *                else reject(err);
 *            });
 *         });
 *     }
 * 
 *     public set(correlatonId: string, item: MyData, callback: (err) => void): void {
 *         let criteria = { name: item.name };
 *         let options = { upsert: true, new: true };
 *         return new Promise((resolve, reject) => {
 *            this._model.findOneAndUpdate(criteria, item, options, (err, value) => {
 *                if (err == null) resolve(value);
 *                else reject(err);
 *            });
 *         });
 *     }
 * 
 *     }
 * 
 *     let persistence = new MyCouchbasePersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "host", "localhost",
 *         "port", 27017
 *     ));
 * 
 *     await persitence.open("123");
 * 
 *     let item = await persistence.set("123", { name: "ABC" });
 *     item = await persistence.getByName("123", "ABC");
 *     console.log(item);                   // Result: { name: "ABC" }
 */
export class CouchbasePersistence<T> implements IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable {
    protected _maxPageSize: number = 100;
    protected _collectionName: string;

    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "bucket", null,
        "dependencies.connection", "*:connection:couchbase:*:1.0",

        // connections.*
        // credential.*

        "options.auto_create", false,
        "options.auto_index", true,
        "options.flush_enabled", true,
        "options.bucket_type", "couchbase",
        "options.ram_quota", 100,
    );

    private _config: ConfigParams;
    private _references: IReferences;
    private _opened: boolean;
    private _localConnection: boolean;

    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver = new DependencyResolver(CouchbasePersistence._defaultConfig);
    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /**
     * The Couchbase connection component.
     */
    protected _connection: CouchbaseConnection;
    /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();

    /**
     * The Couchbase cluster object.
     */
    protected _cluster: any;
    /**
     * The Couchbase bucket name.
     */
    protected _bucketName: string;
    /**
     * The Couchbase bucket object.
     */
    protected _bucket: any;
    /**
     * The Couchbase N1qlQuery object.
     */
    protected _query: any;

    /**
     * Creates a new instance of the persistence component.
     * 
     * @param bucket    (optional) a bucket name.
     * @param collection    (optional) a collection name.
     */
    public constructor(bucket?: string, collection?:string) {
        this._bucketName = bucket;
        this._collectionName = collection;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        config = config.setDefaults(CouchbasePersistence._defaultConfig);
        this._config = config;

        this._dependencyResolver.configure(config);

        this._bucketName = config.getAsStringWithDefault('bucket', this._bucketName);
        this._options = this._options.override(config.getSection("options"));
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._references = references;
        this._logger.setReferences(references);

        // Get connection
        this._dependencyResolver.setReferences(references);
        this._connection = this._dependencyResolver.getOneOptional('connection');
        // Or create a local one
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        } else {
            this._localConnection = false;
        }
    }

    /**
	 * Unsets (clears) previously set references to dependent components. 
     */
    public unsetReferences(): void {
        this._connection = null;
    }

    private createConnection(): CouchbaseConnection {
        let connection = new CouchbaseConnection(this._bucketName);
        
        if (this._config) {
            connection.configure(this._config);
        }
        
        if (this._references) {
            connection.setReferences(this._references);
        }
            
        return connection;
    }

    /** 
     * Converts object value from internal to public format.
     * 
     * @param value     an object in internal format to convert.
     * @returns converted object in public format.
     */
     protected convertToPublic(value: any): any {
        if (value && value.toJSON) {
            value = value.toJSON();
        }

        if (value) {
            delete value._c
        }

        return value;
    }    

    /** 
     * Convert object value from public to internal format.
     * 
     * @param value     an object in public format to convert.
     * @returns converted object in internal format.
     */
    protected convertFromPublic(value: any): any {
        if (value) {
            value = Object.assign({}, value);
            value._c = this._collectionName;
        }
        return value;
    }    

    /** 
     * Converts the given object from the public partial format.
     * 
     * @param value     the object to convert from the public partial format.
     * @returns the initial object.
     */
    protected convertFromPublicPartial(value: any): any {
        return this.convertFromPublic(value);
    }        

    protected quoteIdentifier(value: string): string {
        if (value == null || value == "") return value;

        if (value[0] == '`') return value;

        return '`' + value + '`';
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async open(context: IContext): Promise<void> {
    	if (this._opened) {
            return;
        }
        
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        }

        if (this._localConnection) {
            await this._connection.open(context);
        }

        if (this._connection == null) {
            throw new InvalidStateException(
                context,
                'NO_CONNECTION',
                'Couchbase connection is missing'
            );
        }

        if (!this._connection.isOpen()) {
            throw new ConnectionException(
                context,
                "CONNECT_FAILED",
                "Couchbase connection is not opened"
            );
        }

        this._cluster = this._connection.getConnection();
        this._bucket = this._connection.getBucket();
        this._bucketName = this._connection.getBucketName();
        
        let couchbase = require('couchbase');
        this._query = couchbase.N1qlQuery;

        this._opened = true;
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
    	if (!this._opened) {
            return;
        }

        if (this._connection == null) {
            throw new InvalidStateException(
                context,
                'NO_CONNECTION',
                'Couchbase connection is missing'
            );
        }

        if (this._localConnection) {
            await this._connection.close(context);
        }
        
        this._opened = false;
        this._cluster = null;
        this._bucket = null;
        this._query = null;
    }

    /**
	 * Clears component state.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async clear(context: IContext): Promise<void> {
        // Return error if collection is not set
        if (this._bucketName == null) {
            throw new Error('Bucket name is not defined');
        }

        await new Promise<void>((resolve, reject) => {
            this._bucket.manager().flush((err) => {
                if (err != null) {
                    err = new ConnectionException(
                        context,
                        "FLUSH_FAILED",
                        "Couchbase bucket flush failed"
                    ).withCause(err);
                    reject(err);
                    return;
                }
                
                resolve();
            });
        });
    }

    /**
     * Creates a filters that includes a collection name in it.
     * @param filter a user-defined filter
     * @returns a filter that includes a collection name.
     */
    protected createBucketFilter(filter: string): string {
        let collectionFilter = "_c='" + this._collectionName + "'"
        if (filter != null) {
            return collectionFilter + " AND " + filter;
        }        
        return collectionFilter;
    }

    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     * 
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter query string after WHERE clause
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting string after ORDER BY clause
     * @param select            (optional) projection string after SELECT clause
     * @returns                 the requested data page.
     */
    protected async getPageByFilter(context: IContext, filter: any, paging: PagingParams, 
        sort: any, select: any): Promise<DataPage<T>> {

        select = select != null ? select : "*"
        let statement = "SELECT " + select + " FROM " + this.quoteIdentifier(this._bucketName);

        // Adjust max item count based on configuration
        paging = paging || new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let pagingEnabled = paging.total;

        filter = this.createBucketFilter(filter);
        statement += " WHERE " + filter;

        if (sort != null) {
            statement += " ORDER BY " + sort;
        }

        if (skip >= 0) {
            statement += " OFFSET " + skip;
        }
        statement += " LIMIT " + take;

        let query = this._query.fromString(statement);
        // Todo: Make it configurable?
        query.consistency(this._query.Consistency.STATEMENT_PLUS);
        let items = await new Promise<any[]>((resolve, reject) => { 
            this._bucket.query(query, [], (err, items) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(items);
            });
        });

        this._logger.trace(context, "Retrieved %d from %s", items.length, this._bucketName);

        items = items.map(item => select == "*" ? item[this._bucketName] : item);
        items = items.map(this.convertToPublic);
        items = items.filter(item => item != null);

        if (pagingEnabled) {
            statement = "SELECT COUNT(*) FROM " + this.quoteIdentifier(this._bucketName)
                + " WHERE " + filter;

            query = this._query.fromString(statement);
            let count = await new Promise<number>((resolve, reject) => {
                this._bucket.query(query, [], (err, counts) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                        
                    let count = counts ? counts[0]['$1'] : 0;
                    resolve(count);
                });
            });
            return new DataPage<T>(items, count);
        } else {
            return new DataPage<T>(items);
        }
    }

    /**
     * Gets a number of data items retrieved by a given filter.
     * 
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter query string after WHERE clause
     * @returns                  a number of data items that satisfy the filter.
     */
    protected async getCountByFilter(context: IContext, filter: any): Promise<number> {
        filter = this.createBucketFilter(filter);
        let statement = "SELECT COUNT(*) FROM " + this.quoteIdentifier(this._bucketName)
            + " WHERE " + filter;

        let query = this._query.fromString(statement);
        let count = await new Promise<number>((resolve, reject) => {
            this._bucket.query(query, [], (err, counts) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                    
                let count = counts ? counts[0]['$1'] : 0;
                resolve(count);
            });
        });

        this._logger.trace(context, "Counted %d items in %s", count, this._bucketName);

        return count;
    }

    /**
     * Gets a list of data items retrieved by a given filter and sorted according to sort parameters.
     * 
     * This method shall be called by a public getListByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param filter           (optional) a filter JSON object
     * @param paging           (optional) paging parameters
     * @param sort             (optional) sorting JSON object
     * @param select           (optional) projection JSON object
     * @param callback         callback function that receives a data list or error.
     */
    protected async getListByFilter(context: IContext, filter: any, sort: any, select: any): Promise<T[]> {
        select = select != null ? select : "*"
        let statement = "SELECT " + select + " FROM " + this.quoteIdentifier(this._bucketName);

        // Adjust max item count based on configuration
        filter = this.createBucketFilter(filter);
        statement += " WHERE " + filter;
        
        if (sort != null) {
            statement += " ORDER BY " + sort;
        }

        let query = this._query.fromString(statement);
        // Todo: Make it configurable?
        query.consistency(this._query.Consistency.REQUEST_PLUS);

        let items = await new Promise<any[]>((resolve, reject) => {
            this._bucket.query(query, [], (err, items) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(items);
            });
        });

        this._logger.trace(context, "Retrieved %d from %s", items.length, this._bucketName);

        items = items.map(item => select == "*" ? item[this._bucketName] : item);
        items = items.map(this.convertToPublic);
        items = items.filter(item => item != null);
    
        return items;
    }

     /**
     * Gets a random item from items that match to a given filter.
     * 
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter JSON object
     * @returns                 a random item that satisfies the filter.
     */
    protected async getOneRandom(context: IContext, filter: any): Promise<T> {
        let statement = "SELECT COUNT(*) FROM " + this.quoteIdentifier(this._bucketName);

        // Adjust max item count based on configuration
        filter = this.createBucketFilter(filter);
        statement += " WHERE " + filter;

        let query = this._query.fromString(statement);
        // Todo: Make it configurable?
        query.consistency(this._query.Consistency.REQUEST_PLUS);
        let count = await new Promise<number>((resolve, reject) => {
            this._bucket.query(query, [], (err, counts) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                let count = counts != null ? counts[0] : 0;
                resolve(count);
            });
        });

        statement = "SELECT * FROM " + this.quoteIdentifier(this._bucketName)
            + " WHERE " + filter;

        let skip = Math.trunc(Math.random() * count);
        statement += " OFFSET " + skip + " LIMIT 1";            

        query = this._query.fromString(statement);
        let items = await new Promise<any[]>((resolve, reject) => {
            this._bucket.query(query, [], (err, items) => {    
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(items);
            });
        });

        if (items != null && items.length > 0)
            this._logger.trace(context, "Retrieved random item from %s", this._bucketName);

        items = items.map(this.convertToPublic);
        return items[0];
    }

     /**
     * Generates unique id for specific collection in the bucket
     * @param value a public unique id.
     * @returns a unique bucket id.
     */
    protected generateBucketId(value: any): string {
        if (value == null) return null;
        return this._collectionName + value.toString();
    }

    /**
     * Creates a data item.
     * 
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 the created item.
     */
    public async create(context: IContext, item: T): Promise<T> {
        if (item == null) {
            return null;
        }

        // Assign unique id
        let newItem: any = Object.assign({}, item);
        let id = newItem.id || IdGenerator.nextLong();
        let objectId = this.generateBucketId(id);
        newItem = this.convertFromPublic(newItem);

        await new Promise<any>((resolve, reject) => {
            this._bucket.insert(objectId, newItem, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        this._logger.trace(context, "Created in %s with id = %s", this._bucketName, id);
        
        newItem = this.convertToPublic(newItem);
        return newItem;
    }

     /**
     * Deletes data items that match to a given filter.
     * 
     * This method shall be called by a public deleteByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter JSON object.
     */
    public async deleteByFilter(context: IContext, filter: any): Promise<void> {
        let statement = "DELETE FROM " + this.quoteIdentifier(this._bucketName);

        // Adjust max item count based on configuration
        filter = this.createBucketFilter(filter);
        statement += " WHERE " + filter;

        let query = this._query.fromString(statement);
        let count = await new Promise<number>((resolve, reject) => {
            this._bucket.query(query, [], (err, counts) => {
                if (err != null) {
                    reject(err);
                }

                let count = counts != null ? counts[0] : 0;
                resolve(count);
            });    
        });

        this._logger.trace(context, "Deleted %d items from %s", count, this._bucketName);
    }
}
