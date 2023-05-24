"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableCollection = void 0;
const Variable_1 = require("./Variable");
const Variant_1 = require("../../variants/Variant");
/**
 * Implements a variables list.
 */
class VariableCollection {
    constructor() {
        this._variables = [];
    }
    /**
     * Adds a new variable to the collection.
     * @param variable a variable to be added.
     */
    add(variable) {
        if (variable == null) {
            throw new Error("Variable cannot be null");
        }
        this._variables.push(variable);
    }
    /**
     * Gets a number of variables stored in the collection.
     * @returns a number of stored variables.
     */
    get length() {
        return this._variables.length;
    }
    /**
     * Get a variable by its index.
     * @param index a variable index.
     * @returns a retrieved variable.
     */
    get(index) {
        return this._variables[index];
    }
    /**
     * Get all variables stores in the collection
     * @returns a list with variables.
     */
    getAll() {
        let result = [];
        result.push(...this._variables);
        return result;
    }
    /**
     * Finds variable index in the list by it's name.
     * @param name The variable name to be found.
     * @returns Variable index in the list or <code>-1</code> if variable was not found.
     */
    findIndexByName(name) {
        name = name.toUpperCase();
        for (let i = 0; i < this._variables.length; i++) {
            let varName = this._variables[i].name.toUpperCase();
            if (varName == name) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Finds variable in the list by it's name.
     * @param name The variable name to be found.
     * @returns A variable or <code>null</code> if function was not found.
     */
    findByName(name) {
        let index = this.findIndexByName(name);
        return index >= 0 ? this._variables[index] : null;
    }
    /**
     * Finds variable in the list or create a new one if variable was not found.
     * @param name The variable name to be found.
     * @returns Found or created variable.
     */
    locate(name) {
        let v = this.findByName(name);
        if (v == null) {
            v = new Variable_1.Variable(name);
            this.add(v);
        }
        return v;
    }
    /**
     * Removes a variable by its index.
     * @param index a index of the variable to be removed.
     */
    remove(index) {
        this._variables.splice(index, 1);
    }
    /**
     * Removes variable by it's name.
     * @param name The variable name to be removed.
     */
    removeByName(name) {
        let index = this.findIndexByName(name);
        if (index >= 0) {
            this.remove(index);
        }
    }
    /**
     * Clears the collection.
     */
    clear() {
        this._variables = [];
    }
    /**
     * Clears all stored variables (assigns null values).
     */
    clearValues() {
        for (let v of this._variables) {
            v.value = new Variant_1.Variant();
        }
    }
}
exports.VariableCollection = VariableCollection;
//# sourceMappingURL=VariableCollection.js.map