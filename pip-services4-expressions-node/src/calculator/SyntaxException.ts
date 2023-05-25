/** @module calculator */

import { BadRequestException } from "pip-services4-commons-node";

/**
 * Exception that can be thrown by Expression Parser.
 */
export class SyntaxException extends BadRequestException {
    public constructor(context: IContext, code: string,
        message: string, line: number, column: number) {
        if (line != 0 || column != 0) {
            message = message + " at line " + line + " and column " + column;
        }
        super(context, code, message);
    }
}