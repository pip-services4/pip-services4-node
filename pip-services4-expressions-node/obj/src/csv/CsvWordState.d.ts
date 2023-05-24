/** @module csv */
import { GenericWordState } from "../tokenizers/generic/GenericWordState";
/**
 * Implements a word state to tokenize CSV stream.
 */
export declare class CsvWordState extends GenericWordState {
    /**
     * Constructs this object with specified parameters.
     * @param fieldSeparators Separators for fields in CSV stream.
     * @param quoteSymbols Delimiters character to quote strings.
     */
    constructor(fieldSeparators: number[], quoteSymbols: number[]);
}
