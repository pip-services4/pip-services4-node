"use strict";
/** @module connect */
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
exports.MemoryDiscovery = void 0;
const ConnectionParams_1 = require("./ConnectionParams");
/**
 * Used to store key-identifiable information about connections.
 */
class DiscoveryItem {
}
/**
 * Discovery service that keeps connections in memory.
 *
 * ### Configuration parameters ###
 *
 * - [connection key 1]:
 *     - ...                          connection parameters for key 1
 * - [connection key 2]:
 *     - ...                          connection parameters for key N
 *
 * @see [[IDiscovery]]
 * @see [[ConnectionParams]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "key1.host", "10.1.1.100",
 *         "key1.port", "8080",
 *         "key2.host", "10.1.1.100",
 *         "key2.port", "8082"
 *     );
 *
 *     let discovery = new MemoryDiscovery();
 *     discovery.configure(config);
 *
 *     let connection = await discovery.resolveOne("123", "key1");
 *     // Result: host=10.1.1.100;port=8080
 *
 */
class MemoryDiscovery {
    /**
     * Creates a new instance of discovery service.
     *
     * @param config    (optional) configuration with connection parameters.
     */
    constructor(config = null) {
        this._items = new Map();
        if (config != null) {
            this.readConnections(config);
        }
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
    }
    /**
     * Reads connections from configuration parameters.
     * Each section represents an individual Connectionparams
     *
     * @param config   configuration parameters to be read
     */
    readConnections(config) {
        var _a;
        this._items.clear();
        if (config.length() > 0) {
            let connectionSections = config.getSectionNames();
            for (let index = 0; index < connectionSections.length; index++) {
                let key = connectionSections[index];
                let value = config.getSection(key);
                let connectionsList = (_a = this._items.get(key)) !== null && _a !== void 0 ? _a : [];
                connectionsList.push(new ConnectionParams_1.ConnectionParams(value));
                this._items.set(key, connectionsList);
            }
        }
    }
    /**
     * Registers connection parameters into the discovery service.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection parameters.
     * @param credential        a connection to be registered.
     * @returns 			    the registered connection parameters.
     */
    register(context, key, connection) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let connectionsList = (_a = this._items.get(key)) !== null && _a !== void 0 ? _a : [];
            connectionsList.push(new ConnectionParams_1.ConnectionParams(connection));
            this._items.set(key, connectionsList);
            return connection;
        });
    }
    /**
     * Resolves a single connection parameters by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    resolveOne(context, key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let connection = null;
            let connections = (_a = this._items.get(key)) !== null && _a !== void 0 ? _a : [];
            if (connections.length > 0)
                connection = connections[0];
            return connection;
        });
    }
    /**
     * Resolves all connection parameters by their key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    resolveAll(context, key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let connections = (_a = this._items.get(key)) !== null && _a !== void 0 ? _a : [];
            return connections.filter(c => c != null);
        });
    }
}
exports.MemoryDiscovery = MemoryDiscovery;
//# sourceMappingURL=MemoryDiscovery.js.map