/** @module calculator */
import { IVariable } from "./IVariable";
import { Variable } from './Variable';
import { Variant } from "../../variants/Variant";
import { IVariableCollection } from "./IVariableCollection";

/**
 * Implements a variables list.
 */
export class VariableCollection implements IVariableCollection {
    private _variables: IVariable[] = [];

    /**
     * Adds a new variable to the collection.
     * @param variable a variable to be added.
     */
    public add(variable: IVariable): void {
        if (variable == null) {
            throw new Error("Variable cannot be null");
        }
        this._variables.push(variable);
    }

    /**
     * Gets a number of variables stored in the collection.
     * @returns a number of stored variables.
     */
    public get length(): number {
        return this._variables.length;
    }

    /**
     * Get a variable by its index.
     * @param index a variable index.
     * @returns a retrieved variable.
     */
    public get(index: number): IVariable {
        return this._variables[index];
    }

    /**
     * Get all variables stores in the collection
     * @returns a list with variables.
     */
    public getAll(): IVariable[] {
        let result: IVariable[] = [];
        result.push(...this._variables);
        return result;
    }

    /**
     * Finds variable index in the list by it's name. 
     * @param name The variable name to be found.
     * @returns Variable index in the list or <code>-1</code> if variable was not found.
     */
    public findIndexByName(name: string): number {
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
    public findByName(name: string): IVariable {
        let index = this.findIndexByName(name);
        return index >= 0 ? this._variables[index] : null;
    }

    /**
     * Finds variable in the list or create a new one if variable was not found.
     * @param name The variable name to be found.
     * @returns Found or created variable.
     */
    public locate(name: string): IVariable {
        let v = this.findByName(name);
        if (v == null) {
            v = new Variable(name);
            this.add(v);
        }
        return v;
    }

    /**
     * Removes a variable by its index.
     * @param index a index of the variable to be removed.
     */
    public remove(index: number): void {
        this._variables.splice(index, 1);
    }

    /**
     * Removes variable by it's name.
     * @param name The variable name to be removed.
     */
    public removeByName(name: string): void {
        let index = this.findIndexByName(name);
        if (index >= 0) {
            this.remove(index);
        }
    }

    /**
     * Clears the collection.
     */
    public clear(): void {
        this._variables = [];
    }

    /**
     * Clears all stored variables (assigns null values).
     */
    public clearValues(): void {
        for (let v of this._variables) {
            v.value = new Variant();
        }
    }
}