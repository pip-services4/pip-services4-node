/** @module calculator */
import { IVariable } from "./IVariable";

/**
 * Defines a variables list.
 */
export interface IVariableCollection {
    /**
     * Adds a new variable to the collection.
     * @param variable a variable to be added.
     */
    add(variable: IVariable): void;

    /**
     * Gets a number of variables stored in the collection.
     * @returns a number of stored variables.
     */
    length: number;

    /**
     * Get a variable by its index.
     * @param index a variable index.
     * @returns a retrieved variable.
     */
    get(index: number): IVariable;

    /**
     * Get all variables stores in the collection
     * @returns a list with variables.
     */
    getAll(): IVariable[];

    /**
     * Finds variable index in the list by it's name. 
     * @param name The variable name to be found.
     * @returns Variable index in the list or <code>-1</code> if variable was not found.
     */
    findIndexByName(name: string): number;

    /**
     * Finds variable in the list by it's name.
     * @param name The variable name to be found.
     * @returns A variable or <code>null</code> if function was not found.
     */
    findByName(name: string): IVariable;

    /**
     * Finds variable in the list or create a new one if variable was not found.
     * @param name The variable name to be found.
     * @returns Found or created variable.
     */
    locate(name: string): IVariable;

    /**
     * Removes a variable by its index.
     * @param index a index of the variable to be removed.
     */
    remove(index: number): void;

    /**
     * Removes variable by it's name.
     * @param name The variable name to be removed.
     */
    removeByName(name: string): void;

    /**
     * Clears the collection.
     */
    clear(): void;

    /**
     * Clears all stored variables (assigns null values).
     */
    clearValues(): void;
}