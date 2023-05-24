/** @module csv */

import { IScanner } from "../io/IScanner";
import { ITokenizer } from "../tokenizers/ITokenizer";
import { Token } from "../tokenizers/Token";
import { TokenType } from "../tokenizers/TokenType";
import { GenericSymbolState } from "../tokenizers/generic/GenericSymbolState";
import { CsvConstant } from "./CsvConstant";

/**
 * Implements a symbol state to tokenize delimiters in CSV streams.
 */
export class CsvSymbolState extends GenericSymbolState {
    /**
     * Constructs this object with specified parameters.
     */
    public constructor() {
        super();
        this.add("\n", TokenType.Eol);
        this.add("\r", TokenType.Eol);
        this.add("\r\n", TokenType.Eol);
        this.add("\n\r", TokenType.Eol);
    }

    public nextToken(scanner: IScanner, tokenizer: ITokenizer): Token {
        // Optimization...
        let nextSymbol = scanner.read();
        let line = scanner.line();
        let column = scanner.column();

        if (nextSymbol != CsvConstant.LF && nextSymbol != CsvConstant.CR) {
            return new Token(TokenType.Symbol, String.fromCharCode(nextSymbol), line, column);
        } else {
            scanner.unread();
            return super.nextToken(scanner, tokenizer);
        }
    }

}