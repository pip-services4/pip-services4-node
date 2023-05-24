"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
/** @module calculator */
const Variant_1 = require("../../variants/Variant");
/**
 * Implements a variable holder object.
 */
class Variable {
    /**
     * Constructs this variable with name and value.
     * @param name The name of this variable.
     * @param value The variable value.
     */
    constructor(name, value) {
        if (name == null) {
            throw new Error("Name parameter cannot be null.");
        }
        this._name = name;
        this._value = value || new Variant_1.Variant();
    }
    /**
     * The variable name.
     */
    get name() {
        return this._name;
    }
    /**
     * The variable value.
     */
    get value() {
        return this._value;
    }
    /**
     * The variable value.
     */
    set value(value) {
        this._value = value;
    }
}
exports.Variable = Variable;
//# sourceMappingURL=Variable.js.map