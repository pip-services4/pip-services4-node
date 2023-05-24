/** @module tokenizers */
import { ITokenizerState } from './ITokenizerState';
/**
 * Defines an interface for tokenizer state that processes quoted strings.
 */
export interface IQuoteState extends ITokenizerState {
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
