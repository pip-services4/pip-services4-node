/** @module mustache */
import { Token } from "../../tokenizers/Token";
import { AbstractTokenizer } from "../../tokenizers/AbstractTokenizer";
export declare class MustacheTokenizer extends AbstractTokenizer {
    private _special;
    private _specialState;
    /**
     * Constructs this object with default parameters.
     */
    constructor();
    protected readNextToken(): Token;
}
