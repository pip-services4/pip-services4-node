/** @module commands */

import { IContext } from 'pip-services4-components-node';
import { ValidationResult } from 'pip-services4-data-node';
import { Parameters } from 'pip-services4-components-node';
import { ICommand } from './ICommand';
import { ICommandInterceptor } from './ICommandInterceptor';

/**
 * Implements a [[ICommand command]] wrapped by an interceptor.
 * It allows to build command call chains. The interceptor can alter execution
 * and delegate calls to a next command, which can be intercepted or concrete.
 *  
 * @see [[ICommand]]
 * @see [[ICommandInterceptor]]
 * 
 * ### Example ###
 * 
 *     export class CommandLogger implements ICommandInterceptor {       
 *             
 *         public getName(command: ICommand): string {
 *             return command.getName();
 *         }
 *               
 *         public async execute(context: IContext, command: ICommand, args: Parameters): Promise<any> {
 *             console.log("Executed command " + command.getName());
 *             await command.execute(context, args);
 *         }
 *               
 *         private validate(command: ICommand, args: Parameters): ValidationResult[] {
 *             return command.validate(args);
 *         }
 *     }
 *     
 *     let logger = new CommandLogger();
 *     let loggedCommand = new InterceptedCommand(logger, command);
 *     
 *     // Each called command will output: Executed command <command name>
 * 
 */
export class InterceptedCommand implements ICommand {
    private readonly _interceptor: ICommandInterceptor;
    private readonly _next: ICommand;

    /**
     * Creates a new InterceptedCommand, which serves as a link in an execution chain. Contains information 
     * about the interceptor that is being used and the next command in the chain.
     * 
     * @param interceptor   the interceptor that is intercepting the command.
     * @param next          (link to) the next command in the command's execution chain.
     */
    public constructor(interceptor: ICommandInterceptor, next: ICommand) {
        this._interceptor = interceptor;
        this._next = next;
    }

    /**
     * @returns the name of the command that is being intercepted.
     */
    public getName(): string {
        return this._interceptor.getName(this._next);
    }


    /**
     * Executes the next command in the execution chain using the given [[Parameters parameters]] (arguments).
     * 
     * @param context unique transaction id to trace calls across components.
     * @param args          the parameters (arguments) to pass to the command for execution.
     * @returns             the execution result
     * 
     * @see [[Parameters]]
     */
    public async execute(context: IContext, args: Parameters): Promise<any> {
        return await this._interceptor.execute(context, this._next, args);
    }

    /**
     * Validates the [[Parameters parameters]] (arguments) that are to be passed to the command that is next 
     * in the execution chain.
     * 
     * @param args      the parameters (arguments) to validate for the next command.
     * @returns         an array of ValidationResults.
     * 
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    public validate(args: Parameters): ValidationResult[] {
        return this._interceptor.validate(this._next, args);
    }

}
