/** @module commands */

import { IContext } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { ValidationResult } from 'pip-services4-data-node';

import { ICommand } from './ICommand';

/**
 * An interface for stackable command intercepters, which can extend
 * and modify the command call chain.
 * 
 * This mechanism can be used for authentication, logging, and other functions.
 * 
 * @see [[ICommand]]
 * @see [[InterceptedCommand]]
 */
export interface ICommandInterceptor {
    /**
     * Gets the name of the wrapped command.
     * 
     * The interceptor can use this method to override the command name.
     * Otherwise it shall just delegate the call to the wrapped command.
     * 
     * @param command   the next command in the call chain.
     * @returns the name of the wrapped command.
     */
    getName(command: ICommand): string;

    /**
     * Executes the wrapped command with specified arguments.
     * 
     * The interceptor can use this method to intercept and alter the command execution.
     * Otherwise it shall just delete the call to the wrapped command.
     * 
     * @param context (optional) transaction id to trace execution through call chain.
     * @param command       the next command in the call chain that is to be executed.
     * @param args          the parameters (arguments) to pass to the command for execution.
     * @returns             the execution result
     * 
     * @see [[Parameters]]
     */
    execute(context: IContext, command: ICommand, args: Parameters): Promise<any>;

    /**
     * Validates arguments of the wrapped command before its execution.
     * 
     * The interceptor can use this method to intercept and alter validation of the command arguments.
     * Otherwise it shall just delegate the call to the wrapped command.
     * 
     * @param command   the next command in the call chain to be validated against.
     * @param args      the parameters (arguments) to validate.
     * @returns         an array of ValidationResults.
     * 
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    validate(command: ICommand, args: Parameters): ValidationResult[];
}
