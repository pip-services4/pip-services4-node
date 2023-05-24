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
exports.NullLock = void 0;
/**
 * Dummy lock implementation that doesn't do anything.
 *
 * It can be used in testing or in situations when lock is required
 * but shall be disabled.
 *
 * @see [[ILock]]
 */
class NullLock {
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
            return true;
        });
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
            // Do nothing...
        });
    }
    /**
     * Releases prevously acquired lock by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a unique lock key to release.
     */
    releaseLock(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing...
        });
    }
}
exports.NullLock = NullLock;
//# sourceMappingURL=NullLock.js.map