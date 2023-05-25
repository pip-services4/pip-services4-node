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
exports.Opener = void 0;
/**
 * Helper class that opens components.
 *
 * [[IOpenable]]
 */
class Opener {
    /**
     * Checks if specified component is opened.
     *
     * To be checked components must implement [[IOpenable]] interface.
     * If they don't the call to this method returns true.
     *
     * @param component 	the component that is to be checked.
     * @returns true if component is opened and false otherwise.
     *
     * @see [[IOpenable]]
     */
    static isOpenOne(component) {
        if (typeof component.isOpen === "function") {
            return component.isOpen();
        }
        return true;
    }
    /**
     * Checks if all components are opened.
     *
     * To be checked components must implement [[IOpenable]] interface.
     * If they don't the call to this method returns true.
     *
     * @param components 	a list of components that are to be checked.
     * @returns true if all components are opened and false if at least one component is closed.
     *
     * @see [[isOpenOne]]
     * @see [[IOpenable]]
     */
    static isOpen(components) {
        if (components == null)
            return true;
        let result = true;
        for (let component of components) {
            result = result && Opener.isOpenOne(component);
        }
        return result;
    }
    /**
     * Opens specific component.
     *
     * To be opened components must implement [[IOpenable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param component 		the component that is to be opened.
     *
     * @see [[IOpenable]]
     */
    static openOne(context, component) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof component.open === "function") {
                yield component.open(context);
            }
        });
    }
    /**
     * Opens multiple components.
     *
     * To be opened components must implement [[IOpenable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     * @param components 		the list of components that are to be closed.
     *
     * @see [[openOne]]
     * @see [[IOpenable]]
     */
    static open(context, components) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let component of components) {
                yield Opener.openOne(context, component);
            }
        });
    }
}
exports.Opener = Opener;
//# sourceMappingURL=Opener.js.map