/** @module calculator */
import { GenericWordState } from "../../tokenizers/generic/GenericWordState";
import { IScanner } from "../../io/IScanner";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";

/**
 * Implements a word state object.
 */
export class ExpressionWordState extends GenericWordState {
    /**
     * Supported expression keywords.
     */
    public readonly keywords: string[] = [
        "AND", "OR", "NOT", "XOR", "LIKE", "IS", "IN", "NULL", "TRUE", "FALSE"
    ];

    /**
     * Constructs an instance of this class.
     */
    public constructor() {
        super();

        this.clearWordChars();
        this.setWordChars('a'.charCodeAt(0), 'z'.charCodeAt(0), true);
        this.setWordChars('A'.charCodeAt(0), 'Z'.charCodeAt(0), true);
        this.setWordChars('0'.charCodeAt(0), '9'.charCodeAt(0), true);
        this.setWordChars('_'.charCodeAt(0), '_'.charCodeAt(0), true);
        this.setWordChars(0x00c0, 0x00ff, true);
        this.setWordChars(0x0100, 0xfffe, true);
    }

    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param scanner A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
     public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        let line = scanner.peekLine();
        let column = scanner.peekColumn();
        let token = super.nextToken(scanner, tokenizer);
        let value = token.value.toUpperCase();

        for (let keyword of this.keywords) {
            if (keyword == value) {
                return new Token(TokenType.Keyword, token.value, line, column);
            }
        }
        return token;
    }
}
