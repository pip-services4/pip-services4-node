"use strict";
/** @module csv */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvWordState = void 0;
const GenericWordState_1 = require("../tokenizers/generic/GenericWordState");
const CsvConstant_1 = require("./CsvConstant");
/**
 * Implements a word state to tokenize CSV stream.
 */
class CsvWordState extends GenericWordState_1.GenericWordState {
    /**
     * Constructs this object with specified parameters.
     * @param fieldSeparators Separators for fields in CSV stream.
     * @param quoteSymbols Delimiters character to quote strings.
     */
    constructor(fieldSeparators, quoteSymbols) {
        super();
        this.clearWordChars();
        this.setWordChars(0x0000, 0xfffe, true);
        this.setWordChars(CsvConstant_1.CsvConstant.CR, CsvConstant_1.CsvConstant.CR, false);
        this.setWordChars(CsvConstant_1.CsvConstant.LF, CsvConstant_1.CsvConstant.LF, false);
        for (let fieldSeparator of fieldSeparators) {
            this.setWordChars(fieldSeparator, fieldSeparator, false);
        }
        for (let quoteSymbol of quoteSymbols) {
            this.setWordChars(quoteSymbol, quoteSymbol, false);
        }
    }
}
exports.CsvWordState = CsvWordState;
//# sourceMappingURL=CsvWordState.js.map