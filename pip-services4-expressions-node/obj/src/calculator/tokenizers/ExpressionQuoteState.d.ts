/** @module calculator */
import { IQuoteState } from "../../tokenizers/IQuoteState";
import { IScanner } from "../../io/IScanner";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
/**
 * Implements an Expression-specific quote string state object.
 */
export declare class ExpressionQuoteState implements IQuoteState {
    protected readonly QUOTE: number;
    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param scanner A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
    /**
     * Encodes a string value.
     * @param value A string value to be encoded.
     * @param quoteSymbol A string quote character.
     * @returns An encoded string.
     */
    encodeString(value: string, quoteSymbol: number): string;
    /**
     * Decodes a string value.
     * @param value A string value to be decoded.
     * @param quoteSymbol A string quote character.
     * @returns An decoded string.
     */
    decodeString(value: string, quoteSymbol: number): string;
}
