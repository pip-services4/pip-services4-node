/** @module calculator */
import { BadRequestException } from "pip-services4-commons-node";
/**
 * Exception that can be thrown by Expression Calculator.
 */
export declare class ExpressionException extends BadRequestException {
    constructor(context: IContext, code: string, message: string, line?: number, column?: number);
}
