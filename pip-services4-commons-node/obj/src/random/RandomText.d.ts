/**
 * Random generator for various text values like names, addresses or phone numbers.
 *
 * ### Example ###
 *
 *     let value1 = RandomText.name();     // Possible result: "Segio"
 *     let value2 = RandomText.verb();      // Possible result: "Run"
 *     let value3 = RandomText.Text(50);    // Possible result: "Run jorge. Red high scream?"
 */
export declare class RandomText {
    private static readonly _namePrefixes;
    private static readonly _nameSuffixes;
    private static readonly _firstNames;
    private static readonly _lastNames;
    private static readonly _colors;
    private static readonly _stuffs;
    private static readonly _adjectives;
    private static readonly _verbs;
    private static readonly _allWords;
    /**
     * Generates a random color name.
     * The result value is capitalized.
     *
     * @returns a random color name.
     */
    static color(): string;
    /**
     * Generates a random noun.
     * The result value is capitalized.
     *
     * @returns a random noun.
     */
    static noun(): string;
    /**
     * Generates a random adjective.
     * The result value is capitalized.
     *
     * @returns a random adjective.
     */
    static adjective(): string;
    /**
     * Generates a random verb.
     * The result value is capitalized.
     *
     * @returns a random verb.
     */
    static verb(): string;
    /**
     * Generates a random phrase which consists of few words separated by spaces.
     * The first word is capitalized, others are not.
     *
     * @param minLength     (optional) minimum string length.
     * @param maxLength     maximum string length.
     * @returns a random phrase.
     */
    static phrase(minLength: number, maxLength?: number): string;
    /**
     * Generates a random person's name which has the following structure
     * <optional prefix> <first name> <second name> <optional suffix>
     *
     * @returns a random name.
     */
    static fullName(): string;
    /**
     * Generates a random word from available first names, last names, colors, stuffs, adjectives, or verbs.
     *
     * @returns a random word.
     */
    static word(): string;
    /**
     * Generates a random text that consists of random number of random words separated by spaces.
     *
     * @param min   (optional) a minimum number of words.
     * @param max   a maximum number of words.
     * @returns     a random text.
     */
    static words(min: number, max?: number): string;
    /**
     * Generates a random phone number.
     * The phone number has the format: (XXX) XXX-YYYY
     *
     * @returns a random phone number.
     */
    static phone(): string;
    /**
     * Generates a random email address.
     *
     * @returns a random email address.
     */
    static email(): string;
    /**
     * Generates a random text, consisting of first names, last names, colors, stuffs, adjectives, verbs, and punctuation marks.
     *
     * @param minLength   minimum amount of words to generate. Text will contain 'minSize' words if 'maxSize' is omitted.
     * @param maxLength   (optional) maximum amount of words to generate.
     * @returns         a random text.
     */
    static text(minLength: number, maxLength?: number): string;
}
