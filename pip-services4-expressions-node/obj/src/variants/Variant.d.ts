import { VariantType } from "./VariantType";
/**
 * Defines container for variant values.
 */
export declare class Variant {
    private _type;
    private _value;
    static readonly Empty: Variant;
    /**
     * Constructs this class and assignes another variant value.
     * @param value a value to be assigned to this variant.
     */
    constructor(value?: any);
    /**
     * Gets a type of the variant value
     * @returns the variant value type
     */
    get type(): VariantType;
    /**
     * Gets variant value as integer
     */
    get asInteger(): number;
    /**
     * Sets variant value as integer
     * @param value a value to be set
     */
    set asInteger(value: number);
    /**
     * Gets variant value as long
     */
    get asLong(): number;
    /**
     * Sets variant value as long
     * @param value a value to be set
     */
    set asLong(value: number);
    /**
     * Gets variant value as boolean
     */
    get asBoolean(): boolean;
    /**
     * Sets variant value as boolean
     * @param value a value to be set
     */
    set asBoolean(value: boolean);
    /**
     * Gets variant value as float
     */
    get asFloat(): number;
    /**
     * Sets variant value as float
     * @param value a value to be set
     */
    set asFloat(value: number);
    /**
     * Gets variant value as double
     */
    get asDouble(): number;
    /**
     * Sets variant value as double
     * @param value a value to be set
     */
    set asDouble(value: number);
    /**
     * Gets variant value as string
     */
    get asString(): string;
    /**
     * Sets variant value as string
     * @param value a value to be set
     */
    set asString(value: string);
    /**
     * Gets variant value as DateTime
     */
    get asDateTime(): Date;
    /**
     * Sets variant value as DateTime
     * @param value a value to be set
     */
    set asDateTime(value: Date);
    /**
     * Gets variant value as TimeSpan
     */
    get asTimeSpan(): number;
    /**
     * Sets variant value as TimeSpan
     * @param value a value to be set
     */
    set asTimeSpan(value: number);
    /**
     * Gets variant value as Object
     */
    get asObject(): any;
    /**
     * Sets variant value as Object
     * @param value a value to be set
     */
    set asObject(value: any);
    /**
     * Gets variant value as variant array
     */
    get asArray(): Variant[];
    /**
     * Sets variant value as variant array
     * @param value a value to be set
     */
    set asArray(value: Variant[]);
    /**
     * Gets length of the array
     * @returns The length of the array or 0
     */
    get length(): number;
    /**
     * Sets a new array length
     * @param value a new array length
     */
    set length(value: number);
    /**
     * Gets an array element by its index.
     * @param index an element index
     * @returns a requested array element
     */
    getByIndex(index: number): Variant;
    /**
     * Sets an array element by its index.
     * @param index an element index
     * @param element an element value
     */
    setByIndex(index: number, element: Variant): void;
    /**
     * Checks is this variant value Null.
     * @returns <code>true</code> if this variant value is Null.
     */
    isNull(): boolean;
    /**
     * Checks is this variant value empty.
     * @returns <code>true</code< is this variant value is empty.
     */
    isEmpty(): boolean;
    /**
     * Assignes a new value to this object.
     * @param value A new value to be assigned.
     */
    assign(value: Variant): void;
    /**
     * Clears this object and assignes a VariantType.Null type.
     */
    clear(): void;
    /**
     * Returns a string value for this object.
     * @returns a string value for this object.
     */
    toString(): string;
    /**
     * Compares this object to the specified one.
     * @param obj An object to be compared.
     * @returns <code>true</code> if objects are equal.
     */
    equals(obj: any): boolean;
    /**
     * Cloning the variant value
     * @returns The cloned value of this variant
     */
    clone(): Variant;
    /**
     * Creates a new variant from Integer value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromInteger(value: number): Variant;
    /**
     * Creates a new variant from Long value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromLong(value: number): Variant;
    /**
     * Creates a new variant from Boolean value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromBoolean(value: boolean): Variant;
    /**
     * Creates a new variant from Float value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromFloat(value: number): Variant;
    /**
     * Creates a new variant from Double value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromDouble(value: number): Variant;
    /**
     * Creates a new variant from String value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromString(value: string): Variant;
    /**
     * Creates a new variant from DateTime value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromDateTime(value: Date): Variant;
    /**
     * Creates a new variant from TimeSpan value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromTimeSpan(value: number): Variant;
    /**
     * Creates a new variant from Object value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromObject(value: any): Variant;
    /**
     * Creates a new variant from Array value.
     * @param value a variant value.
     * @returns a created variant object.
     */
    static fromArray(value: Variant[]): Variant;
}
