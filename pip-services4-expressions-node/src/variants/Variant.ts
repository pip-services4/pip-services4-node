/** @module variants */
import { StringConverter } from 'pip-services4-commons-node';

import { VariantType } from "./VariantType";

/**
 * Defines container for variant values.
 */
export class Variant {
    private _type: VariantType;
    private _value: any;

    public static readonly Empty = new Variant(null)

    /**
     * Constructs this class and assignes another variant value.
     * @param value a value to be assigned to this variant.
     */
    public constructor(value?: any) {
        this.asObject = value
    }

    /**
     * Gets a type of the variant value
     * @returns the variant value type 
     */
    public get type(): VariantType {
        return this._type;
    }

    /**
     * Gets variant value as integer
     */
    public get asInteger(): number {
        return this._value; 
    }

    /**
     * Sets variant value as integer
     * @param value a value to be set
     */
    public set asInteger(value: number) {
        this._type = VariantType.Integer;
        this._value = value;
    }

    /**
     * Gets variant value as long
     */
    public get asLong(): number {
        return this._value; 
    }

    /**
     * Sets variant value as long
     * @param value a value to be set
     */
    public set asLong(value: number) {
        this._type = VariantType.Long;
        this._value = value;
    }

    /**
     * Gets variant value as boolean
     */
    public get asBoolean(): boolean {
        return this._value; 
    }

    /**
     * Sets variant value as boolean
     * @param value a value to be set
     */
    public set asBoolean(value: boolean) {
        this._type = VariantType.Boolean;
        this._value = value;
    }

    /**
     * Gets variant value as float
     */
    public get asFloat(): number {
        return this._value; 
    }

    /**
     * Sets variant value as float
     * @param value a value to be set
     */
    public set asFloat(value: number) {
        this._type = VariantType.Float;
        this._value = value;
    }

    /**
     * Gets variant value as double
     */
    public get asDouble(): number {
        return this._value; 
    }

    /**
     * Sets variant value as double
     * @param value a value to be set
     */
    public set asDouble(value: number) {
        this._type = VariantType.Double;
        this._value = value;
    }

    /**
     * Gets variant value as string
     */
    public get asString(): string {
        return this._value; 
    }

    /**
     * Sets variant value as string
     * @param value a value to be set
     */
    public set asString(value: string) {
        this._type = VariantType.String;
        this._value = value;
    }

    /**
     * Gets variant value as DateTime
     */
    public get asDateTime(): Date {
        return this._value; 
    }

    /**
     * Sets variant value as DateTime
     * @param value a value to be set
     */
    public set asDateTime(value: Date) {
        this._type = VariantType.DateTime;
        this._value = value;
    }

    /**
     * Gets variant value as TimeSpan
     */
    public get asTimeSpan(): number {
        return this._value; 
    }

    /**
     * Sets variant value as TimeSpan
     * @param value a value to be set
     */
    public set asTimeSpan(value: number) {
        this._type = VariantType.TimeSpan;
        this._value = value;
    }

    /**
     * Gets variant value as Object
     */
    public get asObject(): any {
        return this._value; 
    }

    /**
     * Sets variant value as Object
     * @param value a value to be set
     */
    public set asObject(value: any) {
        this._value = value;

        if (value == null)
            this._type = VariantType.Null;
        else if (Number.isInteger(value))
            this._type = VariantType.Integer;
        else if (typeof value === "number")
            this._type = VariantType.Double;
        else if (typeof value === "boolean")
            this._type = VariantType.Boolean;
        else if (value instanceof Date)
            this._type = VariantType.DateTime;
        else if (typeof value === "string")
            this. _type = VariantType.String;
        else if (Array.isArray(value)) {
            this._type = VariantType.Array;
        } else if (value instanceof Variant) {
            this._type = value._type;
            this._value = value._value;
        } else {
            this._type = VariantType.Object;
        }
    }

    /**
     * Gets variant value as variant array
     */
    public get asArray(): Variant[] {
        return this._value; 
    }

    /**
     * Sets variant value as variant array
     * @param value a value to be set
     */
    public set asArray(value: Variant[]) {
        this._type = VariantType.Array;
        if (value != null) {
            this._value = [...value];
        } else {
            this._value = null;
        }
    }

    /**
     * Gets length of the array
     * @returns The length of the array or 0
     */
    public get length(): number {
        if (this._type == VariantType.Array) {
            return Array.isArray(this._value) ? this._value.length : 0;
        }
        return 0;
    }

    /**
     * Sets a new array length
     * @param value a new array length
     */
    public set length(value: number) {
        if (this._type == VariantType.Array) {
            this._value = [...this._value];

            while (this._value.length < value) {
                this._value.push(null)
            }
        } else {
            throw new Error("Cannot set array length for non-array data type.");
        }
    }

    /**
     * Gets an array element by its index.
     * @param index an element index
     * @returns a requested array element
     */
    public getByIndex(index: number): Variant {
        if (this._type == VariantType.Array) {
            if (Array.isArray(this._value) && this._value.length > index) {
                return this._value[index];
            }    
            throw new Error("Requested element of array is not accessible.");
        }
        throw new Error("Cannot access array element for none-array data type.");
    }

    /**
     * Sets an array element by its index.
     * @param index an element index
     * @param element an element value
     */
    public setByIndex(index: number, element: Variant): void {
        if (this._type == VariantType.Array) {
            if (Array.isArray(this._value)) {
                while (this._value.length <= index) {
                    this._value.push(null)
                }

                this._value[index] = element;
            } else {
                throw new Error("Requested element of array is not accessible.");
            }
        } else {
            throw new Error("Cannot access array element for none-array data type.");
        }
    }

    /**
     * Checks is this variant value Null.
     * @returns <code>true</code> if this variant value is Null.
     */
    public isNull(): boolean {
        return this._type == VariantType.Null;
    }

    /**
     * Checks is this variant value empty.
     * @returns <code>true</code< is this variant value is empty.
     */
    public isEmpty(): boolean {
        return this._value == null;
    }

    /**
     * Assignes a new value to this object.
     * @param value A new value to be assigned.
     */
    public assign(value: Variant): void {
        if (value != null) {
            this._type = value._type;
            this._value = value._value;
        } else {
            this._type = VariantType.Null;
            this._value = null;
        }
    }

    /**
     * Clears this object and assignes a VariantType.Null type.
     */
    public clear(): void {
        this._type = VariantType.Null;
        this._value = null;
    }

    /**
     * Returns a string value for this object.
     * @returns a string value for this object.
     */
    public toString(): string {
        return this._value == null ? "null" : StringConverter.toString(this._value);
    }

    /**
     * Compares this object to the specified one.
     * @param obj An object to be compared.
     * @returns <code>true</code> if objects are equal.
     */
    public equals(obj: any): boolean {
        if (obj instanceof Variant) {
            const varObj = <Variant>obj;
            const value1 = this._value;
            const value2 = varObj._value;
            if (value1 == null || value2 == null) {
                return value1 == value2;
            }
            return (this._type == varObj._type) && (value1 == value2);
        }
        return false;
    }

    /**
     * Cloning the variant value
     * @returns The cloned value of this variant
     */
    public clone(): Variant {
        return new Variant(this);
    }

    /**
     * Creates a new variant from Integer value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromInteger(value: number): Variant {
        const result = new Variant();
        result.asInteger = value;
        return result;
    }

    /**
     * Creates a new variant from Long value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromLong(value: number): Variant {
        const result = new Variant();
        result.asLong = value;
        return result;
    }

    /**
     * Creates a new variant from Boolean value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromBoolean(value: boolean): Variant {
        const result = new Variant();
        result.asBoolean = value;
        return result;
    }

    /**
     * Creates a new variant from Float value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromFloat(value: number): Variant {
        const result = new Variant();
        result.asFloat = value;
        return result;
    }

    /**
     * Creates a new variant from Double value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromDouble(value: number): Variant {
        const result = new Variant();
        result.asDouble = value;
        return result;
    }

    /**
     * Creates a new variant from String value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromString(value: string): Variant {
        const result = new Variant();
        result.asString = value;
        return result;
    }

    /**
     * Creates a new variant from DateTime value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromDateTime(value: Date): Variant {
        const result = new Variant();
        result.asDateTime = value;
        return result;
    }

    /**
     * Creates a new variant from TimeSpan value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromTimeSpan(value: number): Variant {
        const result = new Variant();
        result.asTimeSpan = value;
        return result;
    }

    /**
     * Creates a new variant from Object value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromObject(value: any): Variant {
        const result = new Variant();
        result.asObject = value;
        return result;
    }

    /**
     * Creates a new variant from Array value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    public static fromArray(value: Variant[]): Variant {
        const result = new Variant();
        result.asArray = value;
        return result;
    }

}