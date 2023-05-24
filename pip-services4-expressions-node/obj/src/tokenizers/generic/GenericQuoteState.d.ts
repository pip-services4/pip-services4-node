/** @module tokenizers */
import { IQuoteState } from '../IQuoteState';
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
/**
  * A quoteState returns a quoted string token from a scanner. This state will collect characters
  * until it sees a match to the character that the tokenizer used to switch to this state.
  * For example, if a tokenizer uses a double-quote character to enter this state,
  * then <code>nextToken()</code> will search for another double-quote until it finds one
  * or finds the end of the scanner.
  */
export declare class GenericQuoteState implements IQuoteState {
    /**
     * Return a quoted string token from a scanner. This method will collect
     * characters until it sees a match to the character that the tokenizer used
     * to switch to this state.
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
