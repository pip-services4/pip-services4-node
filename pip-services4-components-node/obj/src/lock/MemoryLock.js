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
exports.MemoryLock = void 0;
/** @module lock */
const Lock_1 = require("./Lock");
/**
 * Lock that is used to synchronize execution within one process using shared memory.
 *
 * Remember: This implementation is not suitable for synchronization of distributed processes.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - retry_timeout:   timeout in milliseconds to retry lock acquisition. (Default: 100)
 *
 * @see [[ILock]]
 * @see [[Lock]]
 *
 * ### Example ###
 *
 *     let lock = new MemoryLock();
 *
 *     await lock.acquire("123", "key1");
 *     try {
 *        // Processing...
 *     } finally {
 *        await lock.releaseLock("123", "key1");
 *     }
 *
 *     // Continue...
 *
 */
class MemoryLock extends Lock_1.Lock {
    constructor() {
        super(...arguments);
        this._locks = {};
    }
    /**
     * Makes a single attempt to acquire a lock by its key.
     * It returns immediately a positive or negative result.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to acquire.
     * @param ttl               a lock timeout (time to live) in milliseconds.
     * @returns                 <code>true</code> if the lock was acquired and <code>false</code> otherwise.
     */
    tryAcquireLock(correlationId, key, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            let expireTime = this._locks[key];
            let now = new Date().getTime();
            if (expireTime == null || expireTime < now) {
                this._locks[key] = now + ttl;
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
     * Releases the lock with the given key.
     *
     * @param correlationId     not used.
     * @param key               the key of the lock that is to be released.
     */
    releaseLock(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this._locks[key];
        });
    }
}
exports.MemoryLock = MemoryLock;
//# sourceMappingURL=MemoryLock.js.map