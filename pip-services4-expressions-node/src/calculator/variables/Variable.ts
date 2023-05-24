/** @module calculator */
import { Variant } from '../../variants/Variant';
import { IVariable } from './IVariable';

/**
 * Implements a variable holder object.
 */
export class Variable implements IVariable {
    private _name: string;
    private _value: Variant;

    /**
     * Constructs this variable with name and value.
     * @param name The name of this variable.
     * @param value The variable value.
     */
    public constructor(name: string, value?: Variant) {
        if (name == null) {
            throw new Error("Name parameter cannot be null.");
        }
        this._name = name;
        this._value = value || new Variant();
    }

    /**
     * The variable name.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * The variable value.
     */
    public get value(): Variant {
        return this._value;
    }

    /**
     * The variable value.
     */
    public set value(value: Variant) {
        this._value = value;
    }
}