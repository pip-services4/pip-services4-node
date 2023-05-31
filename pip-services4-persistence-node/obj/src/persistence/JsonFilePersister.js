"use strict";
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
exports.JsonFilePersister = void 0;
/** @module persistence */
/** @hidden */
const fs = require("fs");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const pip_services4_commons_node_4 = require("pip-services4-commons-node");
/**
 * Persistence component that loads and saves data from/to flat file.
 *
 * It is used by [[FilePersistence]], but can be useful on its own.
 *
 * ### Configuration parameters ###
 *
 * - path:          path to the file where data is stored
 *
 * ### Example ###
 *
 *     let persister = new JsonFilePersister("./data/data.json");
 *
 *     await persister.save("123", ["A", "B", "C"]);
 *     ...
 *     let items = await persister.load("123");
 *     console.log(items);                      // Result: ["A", "B", "C"]
 */
class JsonFilePersister {
    /**
     * Creates a new instance of the persistence.
     *
     * @param path  (optional) a path to the file where data is stored.
     */
    constructor(path) {
        this._path = path;
    }
    /**
     * Gets the file path where data is stored.
     *
     * @returns the file path where data is stored.
     */
    get path() {
        return this._path;
    }
    /**
     * Sets the file path where data is stored.
     *
     * @param value     the file path where data is stored.
     */
    set path(value) {
        this._path = value;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._path = config.getAsStringWithDefault("path", this._path);
    }
    /**
     * Loads data items from external JSON file.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @returns                a list with loaded data items.
     */
    load(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._path == null) {
                throw new pip_services4_commons_node_1.ConfigException(context != null ? context.getTraceId() : null, "NO_PATH", "Data file path is not set");
            }
            if (!fs.existsSync(this._path)) {
                return [];
            }
            try {
                const json = fs.readFileSync(this._path, "utf8");
                const list = pip_services4_commons_node_3.JsonConverter.toNullableMap(json);
                const arr = pip_services4_commons_node_4.ArrayConverter.listToArray(list);
                return arr;
            }
            catch (ex) {
                throw new pip_services4_commons_node_2.FileException(context != null ? context.getTraceId() : null, "READ_FAILED", "Failed to read data file: " + this._path).withCause(ex);
            }
        });
    }
    /**
     * Saves given data items to external JSON file.
     *
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param items             list if data items to save
     */
    save(context, items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = pip_services4_commons_node_3.JsonConverter.toJson(items);
                fs.writeFileSync(this._path, json);
            }
            catch (ex) {
                throw new pip_services4_commons_node_2.FileException(context != null ? context.getTraceId() : null, "WRITE_FAILED", "Failed to write data file: " + this._path).withCause(ex);
            }
        });
    }
}
exports.JsonFilePersister = JsonFilePersister;
//# sourceMappingURL=JsonFilePersister.js.map