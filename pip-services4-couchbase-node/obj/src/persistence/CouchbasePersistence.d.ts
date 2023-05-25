/** @module persistence */
import { IReferenceable } from 'pip-services4-commons-node';
import { IUnreferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IOpenable } from 'pip-services4-commons-node';
import { ICleanable } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
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
export declare class CouchbasePersistence<T> implements IReferenceable, IUnreferenceable, IConfigurable, IOpenable, ICleanable {
    protected _maxPageSize: number;
    protected _collectionName: string;
    private static _defaultConfig;
    private _config;
    private _references;
    private _opened;
    private _localConnection;
    /**
     * The dependency resolver.
     */
    protected _dependencyResolver: DependencyResolver;
    /**
     * The logger.
     */
    protected _logger: CompositeLogger;
    /**
     * The Couchbase connection component.
     */
    protected _connection: CouchbaseConnection;
    /**
     * The configuration options.
     */
    protected _options: ConfigParams;
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
    constructor(bucket?: string, collection?: string);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences(): void;
    private createConnection;
    /**
     * Converts object value from internal to public format.
     *
     * @param value     an object in internal format to convert.
     * @returns converted object in public format.
     */
    protected convertToPublic(value: any): any;
    /**
     * Convert object value from public to internal format.
     *
     * @param value     an object in public format to convert.
     * @returns converted object in internal format.
     */
    protected convertFromPublic(value: any): any;
    /**
     * Converts the given object from the public partial format.
     *
     * @param value     the object to convert from the public partial format.
     * @returns the initial object.
     */
    protected convertFromPublicPartial(value: any): any;
    protected quoteIdentifier(value: string): string;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    clear(context: IContext): Promise<void>;
    /**
     * Creates a filters that includes a collection name in it.
     * @param filter a user-defined filter
     * @returns a filter that includes a collection name.
     */
    protected createBucketFilter(filter: string): string;
    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter query string after WHERE clause
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting string after ORDER BY clause
     * @param select            (optional) projection string after SELECT clause
     * @returns                 the requested data page.
     */
    protected getPageByFilter(context: IContext, filter: any, paging: PagingParams, sort: any, select: any): Promise<DataPage<T>>;
    /**
     * Gets a number of data items retrieved by a given filter.
     *
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter query string after WHERE clause
     * @returns                  a number of data items that satisfy the filter.
     */
    protected getCountByFilter(context: IContext, filter: any): Promise<number>;
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
    protected getListByFilter(context: IContext, filter: any, sort: any, select: any): Promise<T[]>;
    /**
    * Gets a random item from items that match to a given filter.
    *
    * This method shall be called by a public getOneRandom method from child class that
    * receives FilterParams and converts them into a filter function.
    *
    * @param context     (optional) transaction id to trace execution through call chain.
    * @param filter            (optional) a filter JSON object
    * @returns                 a random item that satisfies the filter.
    */
    protected getOneRandom(context: IContext, filter: any): Promise<T>;
    /**
    * Generates unique id for specific collection in the bucket
    * @param value a public unique id.
    * @returns a unique bucket id.
    */
    protected generateBucketId(value: any): string;
    /**
     * Creates a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns                 the created item.
     */
    create(context: IContext, item: T): Promise<T>;
    /**
    * Deletes data items that match to a given filter.
    *
    * This method shall be called by a public deleteByFilter method from child class that
    * receives FilterParams and converts them into a filter function.
    *
    * @param context     (optional) transaction id to trace execution through call chain.
    * @param filter            (optional) a filter JSON object.
    */
    deleteByFilter(context: IContext, filter: any): Promise<void>;
}
