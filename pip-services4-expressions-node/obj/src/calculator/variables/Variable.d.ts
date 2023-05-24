/** @module calculator */
import { Variant } from '../../variants/Variant';
import { IVariable } from './IVariable';
/**
 * Implements a variable holder object.
 */
export declare class Variable implements IVariable {
    private _name;
    private _value;
    /**
     * Constructs this variable with name and value.
     * @param name The name of this variable.
     * @param value The variable value.
     */
    constructor(name: string, value?: Variant);
    /**
     * The variable name.
     */
    get name(): string;
    /**
     * The variable value.
     */
    get value(): Variant;
    /**
     * The variable value.
     */
    set value(value: Variant);
}
