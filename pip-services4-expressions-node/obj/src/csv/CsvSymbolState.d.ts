/** @module csv */
import { IScanner } from "../io/IScanner";
import { ITokenizer } from "../tokenizers/ITokenizer";
import { Token } from "../tokenizers/Token";
import { GenericSymbolState } from "../tokenizers/generic/GenericSymbolState";
/**
 * Implements a symbol state to tokenize delimiters in CSV streams.
 */
export declare class CsvSymbolState extends GenericSymbolState {
    /**
     * Constructs this object with specified parameters.
     */
    constructor();
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
}
