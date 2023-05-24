/** @module csv */

import { AbstractTokenizer } from "../tokenizers/AbstractTokenizer";
import { CsvConstant } from "./CsvConstant";
import { CsvWordState } from "./CsvWordState";
import { CsvSymbolState } from "./CsvSymbolState";
import { CsvQuoteState } from "./CsvQuoteState";

/**
 * Implements a tokenizer class for CSV files.
 */
export class CsvTokenizer extends AbstractTokenizer {
    private _fieldSeparators: number[] = [ ','.charCodeAt(0) ];
    private _quoteSymbols: number[] = [ '"'.charCodeAt(0) ];
    private _endOfLine: string = "\n\r";

    /**
     * Separator for fields in CSV stream.
     */
    public get fieldSeparators(): number[] {
        return this._fieldSeparators;
    }

    /**
     * Separator for fields in CSV stream.
     */
    public set fieldSeparators(value: number[]) {
        if (value == null) {
            throw new Error("value");
        }

        for (let fieldSeparator of value) {
            if (fieldSeparator == CsvConstant.CR
                || fieldSeparator == CsvConstant.LF
                || fieldSeparator == CsvConstant.Nil) {
                throw new Error("Invalid field separator.");
            }

            for (let quoteSymbol of this.quoteSymbols) {
                if (fieldSeparator == quoteSymbol) {
                    throw new Error("Invalid field separator.");
                }
            }
        }

        this._fieldSeparators = value;
        this.wordState = new CsvWordState(value, this.quoteSymbols);
        this.assignStates();
    }

    /**
     * Separator for rows in CSV stream.
     */
    public get endOfLine(): string {
        return this._endOfLine;
    }

    /**
     * Separator for rows in CSV stream.
     */
    public set endOfLine(value: string) {
        this._endOfLine = value;
    }

    /**
     * Character to quote strings.
     */
    public get quoteSymbols(): number[] {
        return this._quoteSymbols;
    }

    /**
     * Character to quote strings.
     */
    public set quoteSymbols(value: number[]) {
        if (value == null) {
            throw new Error("value");
        }
        for (let quoteSymbol of value) {
            if (quoteSymbol == CsvConstant.CR
                || quoteSymbol == CsvConstant.LF
                || quoteSymbol == CsvConstant.Nil) {
                throw new Error("Invalid quote symbol.");
            }

            for (let fieldSeparator of this.fieldSeparators) {
                if (quoteSymbol == fieldSeparator) {
                    throw new Error("Invalid quote symbol.");
                }
            }
        }

        this._quoteSymbols = value;
        this.wordState = new CsvWordState(this.fieldSeparators, value);
        this.assignStates();
    }

    /**
     * Assigns tokenizer states to correct characters.
     */
    private assignStates(): void {
        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0xfffe, this.wordState);
        this.setCharacterState(CsvConstant.CR, CsvConstant.CR, this.symbolState);
        this.setCharacterState(CsvConstant.LF, CsvConstant.LF, this.symbolState);

        for (let fieldSeparator of this.fieldSeparators) {
            this.setCharacterState(fieldSeparator, fieldSeparator, this.symbolState);
        }
        
        for (let quoteSymbol of this.quoteSymbols) {
            this.setCharacterState(quoteSymbol, quoteSymbol, this.quoteState);
        }
    }

    /**
     * Constructs this object with default parameters.
     */
    public constructor() {
        super();

        this.numberState = null;
        this.whitespaceState = null;
        this.commentState = null;
        this.wordState = new CsvWordState(this.fieldSeparators, this.quoteSymbols);
        this.symbolState = new CsvSymbolState();
        this.quoteState = new CsvQuoteState();
        this.assignStates();
    }
}