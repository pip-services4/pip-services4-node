/** @module commands */
import { ICommand } from './ICommand';
import { Schema } from '../validate/Schema';
import { Parameters } from '../run/Parameters';
import { ValidationResult } from '../validate/ValidationResult';
import { IExecutable } from '../run/IExecutable';
/**
 * Command action function.
 * @param correlationId (optional) transaction id to trace execution through call chain.
 * @param args          the parameters (arguments) to pass to this command for execution.
 * @returns             the execution result
 */
type CommandAction = (correlationId: string, args: Parameters) => Promise<any>;
/**
 * Concrete implementation of [[ICommand ICommand]] interface. Command allows to call a method
 * or function using Command pattern.
 *
 * ### Example ###
 *
 *     let command = new Command("add", null, async (correlationId, args) => {
 *         let param1 = args.getAsFloat("param1");
 *         let param2 = args.getAsFloat("param2");
 *         let result = param1 + param2;
 *         return result;
 *     });
 *
 *     result = await command.execute(
 *       "123",
 *       Parameters.fromTuples(
 *         "param1", 2,
 *         "param2", 2
 *       )
 *     );
 *
 *     console.log("2 + 2 = " + result);
 *     // Console output: 2 + 2 = 4
 *
 * @see [[ICommand]]
 * @see [[CommandSet]]
 */
export declare class Command implements ICommand {
    private _name;
    private readonly _schema;
    private readonly _action;
    /**
     * Creates a new command object and assigns it's parameters.
     *
     * @param name      the command name.
     * @param schema    the schema to validate command arguments.
     * @param action      the function to be executed by this command.
     */
    constructor(name: string, schema: Schema, action: IExecutable | CommandAction);
    /**
     * Gets the command name.
     * @returns the name of this command.
     */
    getName(): string;
    /**
     * Executes the command. Before execution it validates [[Parameters args]] using
     * the defined schema.
     *
     * @param correlationId (optional) transaction id to trace execution through call chain.
     * @param args          the parameters (arguments) to pass to this command for execution.
     * @returns             the execution result
     *
     * @see [[Parameters]]
     */
    execute(correlationId: string, args: Parameters): Promise<any>;
    /**
     * Validates the command [[Parameters args]] before execution using the defined schema.
     *
     * @param args  the parameters (arguments) to validate using this command's schema.
     * @returns     an array of ValidationResults or an empty array (if no schema is set).
     *
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    validate(args: Parameters): ValidationResult[];
}
export {};
