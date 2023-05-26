"use strict";
/** @module data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiString = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class MultiString {
    /**
     * Creates a new MultiString object and initializes it with values.
     *
     * @param map    a map with language-text pairs.
     */
    constructor(map = null) {
        if (map != null) {
            this.append(map);
        }
    }
    /**
     * Gets a string translation by specified language.
     * When language is not found it defaults to English ('en').
     * When English is not found it takes the first value.
     *
     * @param language  a language two-symbol code.
     * @returns         a translation for the specified language or default translation.
     */
    get(language) {
        // Get specified language
        let value = this[language];
        // Default to english
        if (value == null) {
            value = this['en'];
        }
        // Default to the first property
        if (value == null) {
            for (const language in this) {
                if (Object.prototype.hasOwnProperty.call(this, language))
                    value = this[language];
                break;
            }
        }
        return value;
    }
    /**
     * Gets all languages stored in this MultiString object,
     *
     * @returns a list with language codes.
     */
    getLanguages() {
        const languages = [];
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                languages.push(key);
            }
        }
        return languages;
    }
    /**
     * Puts a new translation for the specified language.
     *
     * @param language  a language two-symbol code.
     * @param value     a new translation for the specified language.
     */
    put(language, value) {
        this[language] = pip_services4_commons_node_1.StringConverter.toNullableString(value);
    }
    /**
     * Removes translation for the specified language.
     *
     * @param language  a language two-symbol code.
     */
    remove(language) {
        delete this[language];
    }
    /**
     * Appends a map with language-translation pairs.
     *
     * @param map   the map with language-translation pairs.
     */
    append(map) {
        if (map == null)
            return;
        for (const key in map) {
            const value = map[key];
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                this[key] = pip_services4_commons_node_1.StringConverter.toNullableString(value);
            }
        }
    }
    /**
     * Clears all translations from this MultiString object.
     */
    clear() {
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                delete this[key];
            }
        }
    }
    /**
     * Returns the number of translations stored in this MultiString object.
     *
     * @returns the number of translations.
     */
    length() {
        let count = 0;
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                count++;
            }
        }
        return count;
    }
    /**
     * Creates a new MultiString object from a value that contains language-translation pairs.
     *
     * @param value     the value to initialize MultiString.
     * @returns         a MultiString object.
     *
     * @see [[StringValueMap]]
     */
    static fromValue(value) {
        return new MultiString(value);
    }
    /**
     * Creates a new MultiString object from language-translation pairs (tuples).
     *
     * @param tuples    an array that contains language-translation tuples.
     * @returns         a MultiString Object.
     *
     * @see [[fromTuplesArray]]
     */
    static fromTuples(...tuples) {
        return MultiString.fromTuplesArray(tuples);
    }
    /**
     * Creates a new MultiString object from language-translation pairs (tuples) specified as array.
     *
     * @param tuples    an array that contains language-translation tuples.
     * @returns         a MultiString Object.
     */
    static fromTuplesArray(tuples) {
        const result = new MultiString();
        if (tuples == null || tuples.length == 0) {
            return result;
        }
        for (let index = 0; index < tuples.length; index += 2) {
            if (index + 1 >= tuples.length)
                break;
            const name = pip_services4_commons_node_1.StringConverter.toString(tuples[index]);
            const value = pip_services4_commons_node_1.StringConverter.toNullableString(tuples[index + 1]);
            result[name] = value;
        }
        return result;
    }
}
exports.MultiString = MultiString;
//# sourceMappingURL=MultiString.js.map