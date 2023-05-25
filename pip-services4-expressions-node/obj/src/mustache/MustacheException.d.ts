/** @module mustache */
import { BadRequestException } from "pip-services4-commons-node";
/**
 * Exception that can be thrown by Mustache Template.
 */
export declare class MustacheException extends BadRequestException {
    constructor(context: IContext, code: string, message: string, line: number, column: number);
}
