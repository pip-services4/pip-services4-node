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
exports.Lock = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
/**
 * Abstract lock that implements default lock acquisition routine.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - retry_timeout:   timeout in milliseconds to retry lock acquisition. (Default: 100)
 *
 * @see [[ILock]]
 */
class Lock {
    constructor() {
        this._retryTimeout = 100;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._retryTimeout = config.getAsIntegerWithDefault("options.retry_timeout", this._retryTimeout);
    }
    /**
     * Makes multiple attempts to acquire a lock by its key within give time interval.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @param timeout           a lock acquisition timeout.
     */
    acquireLock(correlationId, key, ttl, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let retryTime = new Date().getTime() + timeout;
            // Try to get lock first
            let ok = yield this.tryAcquireLock(correlationId, key, ttl);
            if (ok) {
                return;
            }
            // Start retrying
            while (!ok) {
                // Sleep for a while...
                yield new Promise(request => setTimeout(request, this._retryTimeout));
                // When timeout expires return false
                let now = new Date().getTime();
                if (now > retryTime) {
                    throw new pip_services3_commons_node_1.ConflictException(correlationId, "LOCK_TIMEOUT", "Acquiring lock " + key + " failed on timeout").withDetails("key", key);
                }
                ok = yield this.tryAcquireLock(correlationId, key, ttl);
            }
        });
    }
}
exports.Lock = Lock;
//# sourceMappingURL=Lock.js.map