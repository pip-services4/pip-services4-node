/** @module csv */
import { AbstractTokenizer } from "../tokenizers/AbstractTokenizer";
/**
 * Implements a tokenizer class for CSV files.
 */
export declare class CsvTokenizer extends AbstractTokenizer {
    private _fieldSeparators;
    private _quoteSymbols;
    private _endOfLine;
    /**
     * Separator for fields in CSV stream.
     */
    get fieldSeparators(): number[];
    /**
     * Separator for fields in CSV stream.
     */
    set fieldSeparators(value: number[]);
    /**
     * Separator for rows in CSV stream.
     */
    get endOfLine(): string;
    /**
     * Separator for rows in CSV stream.
     */
    set endOfLine(value: string);
    /**
     * Character to quote strings.
     */
    get quoteSymbols(): number[];
    /**
     * Character to quote strings.
     */
    set quoteSymbols(value: number[]);
    /**
     * Assigns tokenizer states to correct characters.
     */
    private assignStates;
    /**
     * Constructs this object with default parameters.
     */
    constructor();
}
