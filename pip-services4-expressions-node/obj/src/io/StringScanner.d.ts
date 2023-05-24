/** @module io */
import { IScanner } from './IScanner';
/**
 * Scan characters in a string that allows tokenizers
 * to look ahead through stream to perform lexical analysis.
 */
export declare class StringScanner implements IScanner {
    static readonly Eof: number;
    private _content;
    private _position;
    private _line;
    private _column;
    /**
     * Creates an instance of this class.
     * @param content A text content to be read.
     */
    constructor(content: string);
    /**
     * Returns character from a specified position in the stream
     * @param position a position to read character
     * @returns a character from the specified position or EOF (-1)
     */
    private charAt;
    /**
     * Checks if the current character represents a new line
     * @param charBefore the character before the current one
     * @param charAt the current character
     * @param charAfter the character after the current one
     * @returns <code>true</code> if the current character is a new line, or <code>false</code> otherwise.
     */
    private isLine;
    /**
     * Checks if the current character represents a column
     * @param charAt the current character
     * @returns <code>true</code> if the current character is a column, or <code>false</code> otherwise.
     */
    private isColumn;
    /**
     * Gets the current line number
     * @returns The current line number in the stream
     */
    line(): number;
    /**
     * Gets the column in the current line
     * @returns The column in the current line in the stream
     */
    column(): number;
    /**
     * Reads character from the top of the stream.
     * A read character or <code>-1</code> if stream processed to the end.
     */
    read(): number;
    /**
     * Returns the character from the top of the stream without moving the stream pointer.
     * @returns A character from the top of the stream or <code>-1</code> if stream is empty.
     */
    peek(): number;
    /**
     * Gets the next character line number
     * @returns The next character line number in the stream
     */
    peekLine(): number;
    /**
     * Gets the next character column number
     * @returns The next character column number in the stream
     */
    peekColumn(): number;
    /**
     * Puts the one character back into the stream stream.
     * @param value A character to be pushed back.
     */
    unread(): void;
    /**
     * Pushes the specified number of characters to the top of the stream.
     * @param count A number of characcted to be pushed back.
     */
    unreadMany(count: number): void;
    /**
     * Resets scanner to the initial position
     */
    reset(): void;
}
