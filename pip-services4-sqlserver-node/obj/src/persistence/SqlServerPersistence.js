"use strict";
/** @module persistence */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlServerPersistence = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const SqlServerConnection_1 = require("../connect/SqlServerConnection");
/**
 * Abstract persistence component that stores data in SQLServer using plain driver.
 *
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._db</code> or <code>this._collection</code> properties.
 *
 * ### Configuration parameters ###
 *
 * - table:                       (optional) SQLServer table name
 * - schema:                       (optional) SQLServer table name
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
 *   - connect_timeout:      (optional) number of milliseconds to wait before timing out when connecting a new client (default: 0)
 *   - idle_timeout:         (optional) number of milliseconds a client must sit idle in the pool and not be checked out (default: 10000)
 *   - max_pool_size:        (optional) maximum number of clients the pool should contain (default: 10)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 * ### Example ###
 *
 *     class MySqlServerPersistence extends SqlServerPersistence<MyData> {
 *
 *       public constructor() {
 *           base("mydata");
 *       }
 *
 *       public getByName(context: IContext, name: string, callback: (err, item) => void): void {
 *         let criteria = { name: name };
 *         this._model.findOne(criteria, callback);
 *       });
 *
 *       public set(correlatonId: string, item: MyData, callback: (err) => void): void {
 *         let criteria = { name: item.name };
 *         let options = { upsert: true, new: true };
 *         this._model.findOneAndUpdate(criteria, item, options, callback);
 *       }
 *
 *     }
 *
 *     let persistence = new MySqlServerPersistence();
 *     persistence.configure(ConfigParams.fromTuples(
 *         "host", "localhost",
 *         "port", 27017
 *     ));
 *
 *     persitence.open("123", (err) => {
 *          ...
 *     });
 *
 *     persistence.set("123", { name: "ABC" }, (err) => {
 *         persistence.getByName("123", "ABC", (err, item) => {
 *             console.log(item);                   // Result: { name: "ABC" }
 *         });
 *     });
 */
class SqlServerPersistence {
    /**
     * Creates a new instance of the persistence component.
     *
     * @param tableName    (optional) a table name.
     * @param schemaName    (optional) a schema name.
     */
    constructor(tableName, schemaName) {
        this._schemaStatements = [];
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services4_components_node_1.DependencyResolver(SqlServerPersistence._defaultConfig);
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The maximum number of objects in data pages
         */
        this._maxPageSize = 100;
        this._tableName = tableName;
        this._schemaName = schemaName;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(SqlServerPersistence._defaultConfig);
        this._config = config;
        this._dependencyResolver.configure(config);
        this._tableName = config.getAsStringWithDefault("collection", this._tableName);
        this._tableName = config.getAsStringWithDefault("table", this._tableName);
        this._schemaName = config.getAsStringWithDefault("schema", this._schemaName);
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
        this._logger.setReferences(references);
        // Get connection
        this._dependencyResolver.setReferences(references);
        this._connection = this._dependencyResolver.getOneOptional('connection');
        // Or create a local one
        if (this._connection == null) {
            this._connection = this.createConnection();
            this._localConnection = true;
        }
        else {
            this._localConnection = false;
        }
    }
    /**
     * Unsets (clears) previously set references to dependent components.
     */
    unsetReferences() {
        this._connection = null;
    }
    createConnection() {
        const connection = new SqlServerConnection_1.SqlServerConnection();
        if (this._config) {
            connection.configure(this._config);
        }
        if (this._references) {
            connection.setReferences(this._references);
        }
        return connection;
    }
    /**
     * Adds index definition to create it on opening
     * @param keys index keys (fields)
     * @param options index options
     */
    ensureIndex(name, keys, options) {
        let builder = "CREATE";
        options = options || {};
        if (options.unique) {
            builder += " UNIQUE";
        }
        let indexName = this.quoteIdentifier(name);
        if (this._schemaName != null) {
            indexName = this.quoteIdentifier(this._schemaName) + "." + indexName;
        }
        builder += " INDEX " + indexName + " ON " + this.quotedTableName();
        if (options.type) {
            builder += " " + options.type;
        }
        let fields = "";
        for (const key in keys) {
            if (fields != "")
                fields += ", ";
            fields += this.quoteIdentifier(key);
            const asc = keys[key];
            if (!asc)
                fields += " DESC";
        }
        builder += "(" + fields + ")";
        this.ensureSchema(builder);
    }
    /**
     * Adds a statement to schema definition
     * @param schemaStatement a statement to be added to the schema
     */
    ensureSchema(schemaStatement) {
        this._schemaStatements.push(schemaStatement);
    }
    /**
     * Clears all auto-created objects
     */
    clearSchema() {
        this._schemaStatements = [];
    }
    /**
     * Defines database schema via auto create objects or convenience methods.
     */
    defineSchema() {
        // Todo: override in chile classes
        this.clearSchema();
    }
    /**
     * Converts object value from internal to public format.
     *
     * @param value     an object in internal format to convert.
     * @returns converted object in public format.
     */
    convertToPublic(value) {
        return value;
    }
    /**
     * Convert object value from public to internal format.
     *
     * @param value     an object in public format to convert.
     * @returns converted object in internal format.
     */
    convertFromPublic(value) {
        return value;
    }
    quoteIdentifier(value) {
        if (value == null || value == "")
            return value;
        if (value[0] == '[')
            return value;
        return '[' + value.replace(".", "].[") + ']';
    }
    quotedTableName() {
        if (this._tableName == null) {
            return null;
        }
        let builder = this.quoteIdentifier(this._tableName);
        if (this._schemaName != null) {
            builder = this.quoteIdentifier(this._schemaName) + "." + builder;
        }
        return builder;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            if (this._connection == null) {
                this._connection = this.createConnection();
                this._localConnection = true;
            }
            if (this._localConnection) {
                yield this._connection.open(context);
            }
            if (!this._connection.isOpen()) {
                throw new pip_services4_commons_node_1.ConnectionException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "CONNECT_FAILED", "SQLServer connection is not opened");
            }
            this._client = this._connection.getConnection();
            this._databaseName = this._connection.getDatabaseName();
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this._requestFactory = require('mssql').Request;
            // Define database schema
            this.defineSchema();
            // Recreate objects
            yield this.createSchema(context);
            this._opened = true;
            this._logger.debug(context, "Connected to SQLServer database %s", this._databaseName);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                return;
            }
            if (this._connection == null) {
                throw new pip_services4_commons_node_1.InvalidStateException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, 'NO_CONNECTION', 'SQLServer connection is missing');
            }
            if (this._localConnection) {
                yield this._connection.close(context);
            }
            this._opened = false;
            this._client = null;
            this._requestFactory = null;
        });
    }
    /**
     * Clears component state.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clear(context) {
        // Return error if collection is not set
        if (this._tableName == null) {
            throw new Error('Table name is not defined');
        }
        const query = "DELETE FROM " + this.quotedTableName();
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this._client.query(query, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    createSchema(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._schemaStatements == null || this._schemaStatements.length == 0) {
                return;
            }
            // Check if table exist to determine weither to auto create objects
            // Todo: Adde support for schema
            const query = "SELECT OBJECT_ID('" + this._tableName + "', 'U') as oid";
            const exists = yield new Promise((resolve, reject) => {
                this._client.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const exists = result.recordset && result.recordset.length > 0 && result.recordset[0].oid != null;
                    resolve(exists);
                });
            });
            // If table already exists then exit
            if (exists) {
                return;
            }
            this._logger.debug(context, 'Table ' + this._tableName + ' does not exist. Creating database objects...');
            // Run all DML commands
            for (const dml of this._schemaStatements) {
                yield new Promise((resolve, reject) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    this._client.query(dml, (err, result) => {
                        if (err != null) {
                            this._logger.error(context, err, 'Failed to autocreate database object');
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            }
        });
    }
    /**
     * Generates a list of column names to use in SQL statements like: "column1,column2,column3"
     * @param values an array with column values or a key-value map
     * @returns a generated list of column names
     */
    generateColumns(values) {
        values = !Array.isArray(values) ? Object.keys(values) : values;
        let result = "";
        for (const value of values) {
            if (result != "")
                result += ",";
            result += this.quoteIdentifier(value);
        }
        return result;
    }
    /**
     * Generates a list of value parameters to use in SQL statements like: "@1,@2,@3"
     * @param values an array with values or a key-value map
     * @returns a generated list of value parameters
     */
    generateParameters(values) {
        values = !Array.isArray(values) ? Object.keys(values) : values;
        let index = 1;
        let result = "";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const value of values) {
            if (result != "")
                result += ",";
            result += "@" + index;
            index++;
        }
        return result;
    }
    /**
     * Generates a list of column sets to use in UPDATE statements like: column1=@1,column2=@2
     * @param values a key-value map with columns and values
     * @returns a generated list of column sets
     */
    generateSetParameters(values) {
        let result = "";
        let index = 1;
        for (const column in values) {
            if (result != "")
                result += ",";
            result += this.quoteIdentifier(column) + "=@" + index;
            index++;
        }
        return result;
    }
    /**
     * Generates a list of column parameters
     * @param values a key-value map with columns and values
     * @returns a generated list of column values
     */
    generateValues(values) {
        return Object.values(values);
    }
    /**
     * Creates request to the database.
     * @param values optional list of query parameters
     * @returns a created request
     */
    createRequest(values = null) {
        const request = new this._requestFactory(this._client);
        values = values || [];
        for (let index = 1; index <= values.length; index++) {
            const value = values[index - 1];
            request.input("" + index, value);
        }
        return request;
    }
    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter JSON object
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting JSON object
     * @param select            (optional) projection JSON object
     * @returns a requested data page.
     */
    getPageByFilter(context, filter, paging, sort, select) {
        return __awaiter(this, void 0, void 0, function* () {
            select = select != null ? select : "*";
            let query = "SELECT " + select + " FROM " + this.quotedTableName();
            // Adjust max item count based on configuration
            paging = paging || new pip_services4_data_node_1.PagingParams();
            let skip = paging.getSkip(-1);
            const take = paging.getTake(this._maxPageSize);
            const pagingEnabled = paging.total;
            if (filter != null) {
                query += " WHERE " + filter;
            }
            if (sort != null) {
                query += " ORDER BY " + sort;
            }
            else {
                query += " ORDER BY 1";
            }
            if (skip < 0)
                skip = 0;
            query += " OFFSET " + skip + " ROWS FETCH NEXT " + take + " ROWS ONLY";
            const request = this.createRequest();
            let items = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const items = result.recordset;
                    resolve(items);
                });
            });
            if (items != null) {
                this._logger.trace(context, "Retrieved %d from %s", items.length, this._tableName);
            }
            items = items.map(this.convertToPublic);
            if (pagingEnabled) {
                let query = 'SELECT COUNT(*) AS count FROM ' + this.quotedTableName();
                if (filter != null) {
                    query += " WHERE " + filter;
                }
                const count = yield new Promise((resolve, reject) => {
                    this._client.query(query, (err, result) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        const count = result.recordset && result.recordset.length == 1
                            ? pip_services4_commons_node_1.LongConverter.toLong(result.recordset[0].count) : 0;
                        resolve(count);
                    });
                });
                const page = new pip_services4_data_node_1.DataPage(items, count);
                return page;
            }
            else {
                const page = new pip_services4_data_node_1.DataPage(items);
                return page;
            }
        });
    }
    /**
     * Gets a number of data items retrieved by a given filter.
     *
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter JSON object
     * @returns a number of items that satisfy the filter.
     */
    getCountByFilter(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT COUNT(*) AS count FROM ' + this.quotedTableName();
            if (filter != null) {
                query += " WHERE " + filter;
            }
            const request = this.createRequest();
            const count = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const count = result.recordset && result.recordset.length == 1
                        ? pip_services4_commons_node_1.LongConverter.toLong(result.recordset[0].count) : 0;
                    resolve(count);
                });
            });
            if (count != null) {
                this._logger.trace(context, "Counted %d items in %s", count, this._tableName);
            }
            return count;
        });
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
     * @returns a list with requested data items.
     */
    getListByFilter(context, filter, sort, select) {
        return __awaiter(this, void 0, void 0, function* () {
            select = select != null ? select : "*";
            let query = "SELECT " + select + " FROM " + this.quotedTableName();
            if (filter != null) {
                query += " WHERE " + filter;
            }
            if (sort != null) {
                query += " ORDER BY " + sort;
            }
            const request = this.createRequest();
            let items = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const items = result.recordset;
                    resolve(items);
                });
            });
            if (items != null) {
                this._logger.trace(context, "Retrieved %d from %s", items.length, this._tableName);
            }
            items = items.map(this.convertToPublic);
            return items;
        });
    }
    /**
     * Gets a random item from items that match to a given filter.
     *
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param filter            (optional) a filter JSON object
     * @returns a random item that satisfies the filter.
     */
    getOneRandom(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = 'SELECT COUNT(*) AS count FROM ' + this.quotedTableName();
            if (filter != null) {
                query += " WHERE " + filter;
            }
            const request = this.createRequest();
            const count = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const count = result.recordset && result.recordset.length == 1 ? result.recordset[0].count : 0;
                    resolve(count);
                });
            });
            if (count == 0) {
                return null;
            }
            query = "SELECT * FROM " + this.quotedTableName();
            if (filter != null) {
                query += " WHERE " + filter;
            }
            const pos = Math.trunc(Math.random() * count);
            query += " ORDER BY (SELECT NULL) OFFSET " + pos + " ROWS FETCH NEXT 1 ROWS ONLY";
            let item = yield new Promise((resolve, reject) => {
                this._client.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const items = result.recordset;
                    const item = (items != null && items.length > 0) ? items[0] : null;
                    resolve(item);
                });
            });
            if (item == null) {
                this._logger.trace(context, "Random item wasn't found from %s", this._tableName);
            }
            else {
                this._logger.trace(context, "Retrieved random item from %s", this._tableName);
            }
            item = this.convertToPublic(item);
            return item;
        });
    }
    /**
     * Creates a data item.
     *
     * @param trace_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @returns a created item.
     */
    create(context, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item == null) {
                return;
            }
            const row = this.convertFromPublic(item);
            const columns = this.generateColumns(row);
            const params = this.generateParameters(row);
            const values = this.generateValues(row);
            const query = "INSERT INTO " + this.quotedTableName() + " (" + columns + ") OUTPUT INSERTED.* VALUES (" + params + ")";
            const request = this.createRequest(values);
            let newItem = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const item = result && result.recordset && result.recordset.length == 1
                        ? result.recordset[0] : null;
                    resolve(item);
                });
            });
            this._logger.trace(context, "Created in %s with id = %s", this._tableName, row.id);
            newItem = this.convertToPublic(newItem);
            return newItem;
        });
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
    deleteByFilter(context, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "DELETE FROM " + this.quotedTableName();
            if (filter != null) {
                query += " WHERE " + filter;
            }
            const request = this.createRequest();
            const count = yield new Promise((resolve, reject) => {
                request.query(query, (err, result) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    const count = result && result.rowsAffected ? result.rowsAffected[0] : 0;
                    resolve(count);
                });
            });
            this._logger.trace(context, "Deleted %d items from %s", count, this._tableName);
        });
    }
}
exports.SqlServerPersistence = SqlServerPersistence;
SqlServerPersistence._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples("table", null, "schema", null, "dependencies.connection", "*:connection:sqlserver:*:1.0", 
// connections.*
// credential.*
"options.max_pool_size", 2, "options.keep_alive", 1, "options.connect_timeout", 5000, "options.auto_reconnect", true, "options.max_page_size", 100, "options.debug", true);
//# sourceMappingURL=SqlServerPersistence.js.map