"use strict";
/** @module csv */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvTokenizer = void 0;
const AbstractTokenizer_1 = require("../tokenizers/AbstractTokenizer");
const CsvConstant_1 = require("./CsvConstant");
const CsvWordState_1 = require("./CsvWordState");
const CsvSymbolState_1 = require("./CsvSymbolState");
const CsvQuoteState_1 = require("./CsvQuoteState");
/**
 * Implements a tokenizer class for CSV files.
 */
class CsvTokenizer extends AbstractTokenizer_1.AbstractTokenizer {
    /**
     * Separator for fields in CSV stream.
     */
    get fieldSeparators() {
        return this._fieldSeparators;
    }
    /**
     * Separator for fields in CSV stream.
     */
    set fieldSeparators(value) {
        if (value == null) {
            throw new Error("value");
        }
        for (let fieldSeparator of value) {
            if (fieldSeparator == CsvConstant_1.CsvConstant.CR
                || fieldSeparator == CsvConstant_1.CsvConstant.LF
                || fieldSeparator == CsvConstant_1.CsvConstant.Nil) {
                throw new Error("Invalid field separator.");
            }
            for (let quoteSymbol of this.quoteSymbols) {
                if (fieldSeparator == quoteSymbol) {
                    throw new Error("Invalid field separator.");
                }
            }
        }
        this._fieldSeparators = value;
        this.wordState = new CsvWordState_1.CsvWordState(value, this.quoteSymbols);
        this.assignStates();
    }
    /**
     * Separator for rows in CSV stream.
     */
    get endOfLine() {
        return this._endOfLine;
    }
    /**
     * Separator for rows in CSV stream.
     */
    set endOfLine(value) {
        this._endOfLine = value;
    }
    /**
     * Character to quote strings.
     */
    get quoteSymbols() {
        return this._quoteSymbols;
    }
    /**
     * Character to quote strings.
     */
    set quoteSymbols(value) {
        if (value == null) {
            throw new Error("value");
        }
        for (let quoteSymbol of value) {
            if (quoteSymbol == CsvConstant_1.CsvConstant.CR
                || quoteSymbol == CsvConstant_1.CsvConstant.LF
                || quoteSymbol == CsvConstant_1.CsvConstant.Nil) {
                throw new Error("Invalid quote symbol.");
            }
            for (let fieldSeparator of this.fieldSeparators) {
                if (quoteSymbol == fieldSeparator) {
                    throw new Error("Invalid quote symbol.");
                }
            }
        }
        this._quoteSymbols = value;
        this.wordState = new CsvWordState_1.CsvWordState(this.fieldSeparators, value);
        this.assignStates();
    }
    /**
     * Assigns tokenizer states to correct characters.
     */
    assignStates() {
        this.clearCharacterStates();
        this.setCharacterState(0x0000, 0xfffe, this.wordState);
        this.setCharacterState(CsvConstant_1.CsvConstant.CR, CsvConstant_1.CsvConstant.CR, this.symbolState);
        this.setCharacterState(CsvConstant_1.CsvConstant.LF, CsvConstant_1.CsvConstant.LF, this.symbolState);
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
    constructor() {
        super();
        this._fieldSeparators = [','.charCodeAt(0)];
        this._quoteSymbols = ['"'.charCodeAt(0)];
        this._endOfLine = "\n\r";
        this.numberState = null;
        this.whitespaceState = null;
        this.commentState = null;
        this.wordState = new CsvWordState_1.CsvWordState(this.fieldSeparators, this.quoteSymbols);
        this.symbolState = new CsvSymbolState_1.CsvSymbolState();
        this.quoteState = new CsvQuoteState_1.CsvQuoteState();
        this.assignStates();
    }
}
exports.CsvTokenizer = CsvTokenizer;
//# sourceMappingURL=CsvTokenizer.js.map