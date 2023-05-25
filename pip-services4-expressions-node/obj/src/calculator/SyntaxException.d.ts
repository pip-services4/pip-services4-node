/** @module calculator */
import { BadRequestException } from "pip-services4-commons-node";
import { IContext } from 'pip-services4-components-node';
/**
 * Exception that can be thrown by Expression Parser.
 */
export declare class SyntaxException extends BadRequestException {
    constructor(context: IContext, code: string, message: string, line: number, column: number);
}
