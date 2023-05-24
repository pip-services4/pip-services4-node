/** @module io */

import { IScanner } from './IScanner';

/**
 * Scan characters in a string that allows tokenizers
 * to look ahead through stream to perform lexical analysis.
 */
export class StringScanner implements IScanner {
    public static readonly Eof: number = -1;

    private _content: string;
    private _position: number;
    private _line: number;
    private _column: number;

    /**
     * Creates an instance of this class.
     * @param content A text content to be read.
     */
    public constructor(content: string) {
        if (content == null)
            throw new Error("Content cannot be null");

        this._content = content;
        this._position = -1;
        this._line = 1;
        this._column = 0;
    }
    
    /**
     * Returns character from a specified position in the stream
     * @param position a position to read character
     * @returns a character from the specified position or EOF (-1)
     */
    private charAt(position: number): number {
        if (position < 0 || position >= this._content.length) {
            return StringScanner.Eof
        }

        return this._content.charCodeAt(position);
    }

    /**
     * Checks if the current character represents a new line 
     * @param charBefore the character before the current one
     * @param charAt the current character
     * @param charAfter the character after the current one
     * @returns <code>true</code> if the current character is a new line, or <code>false</code> otherwise.
     */
    private isLine(charBefore: number, charAt: number, charAfter: number): boolean {
        if (charAt != 10 && charAt != 13) {
            return false;
        }
        if (charAt == 13 && (charBefore == 10 || charAfter == 10)) {
            return false;
        }
        return true;
    }

    /**
     * Checks if the current character represents a column 
     * @param charAt the current character
     * @returns <code>true</code> if the current character is a column, or <code>false</code> otherwise.
     */
     private isColumn(charAt: number): boolean {
        if (charAt == 10 || charAt == 13) {
            return false;
        }
        return true;
    }

    /**
     * Gets the current line number
     * @returns The current line number in the stream
     */
     public line(): number {
         return this._line;
     }

    /**
     * Gets the column in the current line
     * @returns The column in the current line in the stream
     */
    public column(): number {
        return this._column;
    }

    /**
     * Reads character from the top of the stream.
     * A read character or <code>-1</code> if stream processed to the end.
     */
    public read(): number {
        // Skip if we are at the end
        if ((this._position + 1) > this._content.length) {
            return StringScanner.Eof;
        }

        // Update the current position
        this._position++;

        if (this._position >= this._content.length) {
            return StringScanner.Eof;
        }

        // Update line and columns
        let charBefore = this.charAt(this._position - 1);
        let charAt = this.charAt(this._position);
        let charAfter = this.charAt(this._position + 1);

        if (this.isLine(charBefore, charAt, charAfter)) {
            this._line++;
            this._column = 0;
        }
        if (this.isColumn(charAt)) {
            this._column++;
        }

        return charAt;
    }

    /**
     * Returns the character from the top of the stream without moving the stream pointer.
     * @returns A character from the top of the stream or <code>-1</code> if stream is empty.
     */
    public peek(): number {
        return this.charAt(this._position + 1);
    }

    /**
     * Gets the next character line number
     * @returns The next character line number in the stream
     */
    public peekLine(): number {
        let charBefore = this.charAt(this._position);
        let charAt = this.charAt(this._position + 1);
        let charAfter = this.charAt(this._position + 2);

        return this.isLine(charBefore, charAt, charAfter) ? this._line + 1 : this._line;
    }

    /**
     * Gets the next character column number
     * @returns The next character column number in the stream
     */
    public peekColumn(): number {
        let charBefore = this.charAt(this._position);
        let charAt = this.charAt(this._position + 1);
        let charAfter = this.charAt(this._position + 2);

        if (this.isLine(charBefore, charAt, charAfter)) {
            return 0;
        }

        return this.isColumn(charAt) ? this._column + 1 : this._column;
    }

    /**
     * Puts the one character back into the stream stream.
     * @param value A character to be pushed back.
     */
    public unread(): void {
        // Skip if we are at the beginning
        if (this._position < -1) {
            return
        }

        // Update the current position
        this._position--;

        // Update line and columns (optimization)
        if (this._column > 0) {
            this._column--;
            return;
        }

        // Update line and columns (full version)
        this._line = 1;
        this._column = 0;

        let charBefore = StringScanner.Eof;
        let charAt = StringScanner.Eof;
        let charAfter = this.charAt(0)

        for (let position = 0; position <= this._position; position++) {
            charBefore = charAt;
            charAt = charAfter;
            charAfter = this.charAt(position + 1);

            if (this.isLine(charBefore, charAt, charAfter)) {
                this._line++;
                this._column = 0;
            }
            if (this.isColumn(charAt)) {
                this._column++;
            }
        }
    }

    /**
     * Pushes the specified number of characters to the top of the stream.
     * @param count A number of characcted to be pushed back.
     */
    public unreadMany(count: number): void {
        while (count > 0) {
            this.unread();
            count--;
        }
    }

    /**
     * Resets scanner to the initial position
     */
    public reset(): void {
        this._position = -1;
        this._line = 1;
        this._column = 0;
    }

}