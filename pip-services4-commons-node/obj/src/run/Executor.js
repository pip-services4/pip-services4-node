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
exports.Executor = void 0;
/**
 * Helper class that executes components.
 *
 * [[IExecutable]]
 */
class Executor {
    /**
     * Executes specific component.
     *
     * To be executed components must implement [[IExecutable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param component 		the component that is to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
     *
     * @see [[IExecutable]]
     * @see [[Parameters]]
     */
    static executeOne(correlationId, component, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof component.execute === "function") {
                return yield component.execute(correlationId, args);
            }
        });
    }
    /**
     * Executes multiple components.
     *
     * To be executed components must implement [[IExecutable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param components 		a list of components that are to be executed.
     * @param args              execution arguments.
     * @returns                 an execution result
     *
     * @see [[executeOne]]
     * @see [[IExecutable]]
     * @see [[Parameters]]
     */
    static execute(correlationId, components, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            for (let component of components) {
                let result = yield Executor.executeOne(correlationId, component, args);
                results.push(result);
            }
            return results;
        });
    }
}
exports.Executor = Executor;
//# sourceMappingURL=Executor.js.map