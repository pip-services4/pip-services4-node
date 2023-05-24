/** @module calculator */
import { GenericWordState } from "../../tokenizers/generic/GenericWordState";
import { IScanner } from "../../io/IScanner";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
/**
 * Implements a word state object.
 */
export declare class ExpressionWordState extends GenericWordState {
    /**
     * Supported expression keywords.
     */
    readonly keywords: string[];
    /**
     * Constructs an instance of this class.
     */
    constructor();
    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param scanner A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
}
