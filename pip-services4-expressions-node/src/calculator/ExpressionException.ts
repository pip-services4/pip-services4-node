/** @module calculator */

import { BadRequestException } from "pip-services4-commons-node";

/**
 * Exception that can be thrown by Expression Calculator.
 */
export class ExpressionException extends BadRequestException {
    public constructor(context: IContext, code: string,
        message: string, line: number = 0, column: number = 0) {
        if (line != 0 || column != 0) {
            message = message + " at line " + line + " and column " + column;
        }
        super(context, code, message);
    }
}