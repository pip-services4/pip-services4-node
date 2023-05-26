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
exports.Closer = void 0;
/**
 * Helper class that closes previously opened components.
 *
 * [[IClosable]]
 */
class Closer {
    /**
     * Closes specific component.
     *
     * To be closed components must implement [[ICloseable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     * @param component         the component that is to be closed.
     *
     * @see [[IClosable]]
     */
    static closeOne(context, component) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof component.close === "function") {
                yield component.close(context);
            }
        });
    }
    /**
     * Closes multiple components.
     *
     * To be closed components must implement [[ICloseable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     * @param components         the list of components that are to be closed.
     *
     * @see [[closeOne]]
     * @see [[IClosable]]
     */
    static close(context, components) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const component of components) {
                yield Closer.closeOne(context, component);
            }
        });
    }
}
exports.Closer = Closer;
//# sourceMappingURL=Closer.js.map