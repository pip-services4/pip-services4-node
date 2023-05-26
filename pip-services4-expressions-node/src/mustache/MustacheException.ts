/** @module mustache */

import { BadRequestException } from "pip-services4-commons-node";
import { IContext } from 'pip-services4-components-node';

/**
 * Exception that can be thrown by Mustache Template.
 */
export class MustacheException extends BadRequestException {
    public constructor(context: IContext, code: string,
        message: string, line: number, column: number) {
        if (line != 0 || column != 0) {
            message = message + " at line " + line + " and column " + column;
        }
        super(context != null ? context.getTraceId() : null, code, message);
    }
}