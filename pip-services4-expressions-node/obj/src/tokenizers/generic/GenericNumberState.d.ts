/** @module tokenizers */
import { INumberState } from '../INumberState';
import { Token } from '../Token';
import { ITokenizer } from '../ITokenizer';
import { IScanner } from '../../io/IScanner';
/**
 * A NumberState object returns a number from a scanner. This state's idea of a number allows
 * an optional, initial minus sign, followed by one or more digits. A decimal point and another string
 * of digits may follow these digits.
 */
export declare class GenericNumberState implements INumberState {
    protected readonly MINUS: number;
    protected readonly DOT: number;
    /**
     * Gets the next token from the stream started from the character linked to this state.
     * @param scanner A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    nextToken(scanner: IScanner, tokenizer: ITokenizer): Token;
}
