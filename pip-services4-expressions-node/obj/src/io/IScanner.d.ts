/** @module io */
/**
 * Defines scanner that can read and unread characters and count lines.
 * This scanner is used by tokenizers to process input streams.
 */
export interface IScanner {
    /**
     * Reads character from the top of the stream.
     * @returns A read character or <code>-1</code> if stream processed to the end.
     */
    read(): number;
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
