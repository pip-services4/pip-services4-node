"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/** @module state */
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
exports.NullStateStore = void 0;
/**
 * Dummy state store implementation that doesn't do anything.
 *
 * It can be used in testing or in situations when state management is not required
 * but shall be disabled.
 *
 * @see [[ICache]]
 */
class NullStateStore {
    /**
     * Loads state from the store using its key.
     * If value is missing in the stored it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @returns                 the state value or <code>null</code> if value wasn't found.
     */
    load(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    /**
     * Loads an array of states from the store using their keys.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param keys              unique state keys.
     * @returns                 an array with state values and their corresponding keys.
     */
    loadBulk(context, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    /**
     * Saves state into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique state key.
     * @param value             a state value.
     * @returns                 The state that was stored in the store.
     */
    save(context, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return value;
        });
    }
    /**
     * Deletes a state from the store by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a unique value key.
     */
    delete(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
exports.NullStateStore = NullStateStore;
//# sourceMappingURL=NullStateStore.js.map