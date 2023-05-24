"use strict";
/** @module run */
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
exports.Cleaner = void 0;
/**
 * Helper class that cleans stored object state.
 *
 * @see [[ICleanable]]
 */
class Cleaner {
    /**
     * Clears state of specific component.
     *
     * To be cleaned state components must implement [[ICleanable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param component 		the component that is to be cleaned.
     *
     * @see [[ICleanable]]
     */
    static clearOne(correlationId, component) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof component.clear === "function") {
                yield component.clear(correlationId);
            }
        });
    }
    /**
     * Clears state of multiple components.
     *
     * To be cleaned state components must implement [[ICleanable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param components 		the list of components that are to be cleaned.
     *
     * @see [[clearOne]]
     * @see [[ICleanable]]
     */
    static clear(correlationId, components) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let component of components) {
                yield Cleaner.clearOne(correlationId, component);
            }
        });
    }
}
exports.Cleaner = Cleaner;
//# sourceMappingURL=Cleaner.js.map