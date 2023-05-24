/** @module data */
/**
 * An object that contains string translations for multiple languages.
 * Language keys use two-letter codes like: 'en', 'sp', 'de', 'ru', 'fr', 'pr'.
 * When translation for specified language does not exists it defaults to English ('en').
 * When English does not exists it falls back to the first defined language.
 *
 * ### Example ###
 *
 *     let values = MultiString.fromTuples(
 *         "en", "Hello World!",
 *         "ru", "Привет мир!"
 *     );
 *
 *     let value1 = values.get('ru'); // Result: "Привет мир!"
 *     let value2 = values.get('pt'); // Result: "Hello World!"
 */
export declare class MultiString {
    /**
     * Creates a new MultiString object and initializes it with values.
     *
     * @param map    a map with language-text pairs.
     */
    constructor(map?: any);
    /**
     * Gets a string translation by specified language.
     * When language is not found it defaults to English ('en').
     * When English is not found it takes the first value.
     *
     * @param language  a language two-symbol code.
     * @returns         a translation for the specified language or default translation.
     */
    get(language: string): string;
    /**
     * Gets all languages stored in this MultiString object,
     *
     * @returns a list with language codes.
     */
    getLanguages(): string[];
    /**
     * Puts a new translation for the specified language.
     *
     * @param language  a language two-symbol code.
     * @param value     a new translation for the specified language.
     */
    put(language: string, value: any): any;
    /**
     * Removes translation for the specified language.
     *
     * @param language  a language two-symbol code.
     */
    remove(language: string): void;
    /**
     * Appends a map with language-translation pairs.
     *
     * @param map   the map with language-translation pairs.
     */
    append(map: any): void;
    /**
     * Clears all translations from this MultiString object.
     */
    clear(): any;
    /**
     * Returns the number of translations stored in this MultiString object.
     *
     * @returns the number of translations.
     */
    length(): number;
    /**
     * Creates a new MultiString object from a value that contains language-translation pairs.
     *
     * @param value     the value to initialize MultiString.
     * @returns         a MultiString object.
     *
     * @see [[StringValueMap]]
     */
    static fromValue(value: any): MultiString;
    /**
     * Creates a new MultiString object from language-translation pairs (tuples).
     *
     * @param tuples    an array that contains language-translation tuples.
     * @returns         a MultiString Object.
     *
     * @see [[fromTuplesArray]]
     */
    static fromTuples(...tuples: any[]): MultiString;
    /**
     * Creates a new MultiString object from language-translation pairs (tuples) specified as array.
     *
     * @param tuples    an array that contains language-translation tuples.
     * @returns         a MultiString Object.
     */
    static fromTuplesArray(tuples: any[]): MultiString;
}
