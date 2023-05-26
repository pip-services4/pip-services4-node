/** @module commands */

import { IExecutable } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { ValidationResult } from 'pip-services4-data-node';

/**
 * An interface for Commands, which are part of the Command design pattern.
 * Each command wraps a method or function and allows to call them in uniform and safe manner.
 * 
 * @see [[Command]]
 * @see [[IExecutable]]
 * @see [[ICommandInterceptor]]
 * @see [[InterceptedCommand]]
 */
export interface ICommand extends IExecutable {
    /**
     * Gets the command name.
     * 
     * @returns the command name.
     */
    getName(): string;

    /**
     * Validates command arguments before execution using defined schema.
     * 
     * @param args  the parameters (arguments) to validate.
     * @returns     an array of ValidationResults.
     * 
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    validate(args: Parameters): ValidationResult[];
}
