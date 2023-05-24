/** @module csv */

import { GenericWordState } from "../tokenizers/generic/GenericWordState";
import { CsvConstant } from "./CsvConstant";

/**
 * Implements a word state to tokenize CSV stream.
 */
export class CsvWordState extends GenericWordState {
    /**
     * Constructs this object with specified parameters.
     * @param fieldSeparators Separators for fields in CSV stream.
     * @param quoteSymbols Delimiters character to quote strings.
     */
    public constructor(fieldSeparators: number[], quoteSymbols: number[]) {
        super();
        
        this.clearWordChars();
        this.setWordChars(0x0000, 0xfffe, true);

        this.setWordChars(CsvConstant.CR, CsvConstant.CR, false);
        this.setWordChars(CsvConstant.LF, CsvConstant.LF, false);

        for (let fieldSeparator of fieldSeparators) {
            this.setWordChars(fieldSeparator, fieldSeparator, false);
        }

        for (let quoteSymbol of quoteSymbols) {
            this.setWordChars(quoteSymbol, quoteSymbol, false);
        }
    }

}
