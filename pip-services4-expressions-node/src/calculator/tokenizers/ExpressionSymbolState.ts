/** @module calculator */
import { TokenType } from "../../tokenizers/TokenType";
import { GenericSymbolState } from "../../tokenizers/generic/GenericSymbolState";

/**
 * Implements a symbol state object.
 */
export class ExpressionSymbolState extends GenericSymbolState {
    /**
     * Constructs an instance of this class.
     */
    public constructor() {
        super();
        
        this.add("<=", TokenType.Symbol);
        this.add(">=", TokenType.Symbol);
        this.add("<>", TokenType.Symbol);
        this.add("!=", TokenType.Symbol);
        this.add(">>", TokenType.Symbol);
        this.add("<<", TokenType.Symbol);
    }
}
