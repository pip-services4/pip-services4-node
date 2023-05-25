/** @module commands */
import { ICommand } from './ICommand';
import { InvocationException } from '../../../pip-services4-commons-node/src/errors/InvocationException';
import { Schema } from '../../../pip-services4-commons-node/src/validate/Schema';
import { Parameters } from '../../../pip-services4-commons-node/src/run/Parameters';
import { ValidationResult } from '../../../pip-services4-commons-node/src/validate/ValidationResult';
import { IExecutable } from '../../../pip-services4-commons-node/src/run/IExecutable';

/**
 * Command action function.
 * @param context (optional) transaction id to trace execution through call chain.
 * @param args          the parameters (arguments) to pass to this command for execution.
 * @returns             the execution result
 */
type CommandAction = (context: IContext, args: Parameters) => Promise<any>;

/**
 * Concrete implementation of [[ICommand ICommand]] interface. Command allows to call a method
 * or function using Command pattern.
 * 
 * ### Example ###
 *  
 *     let command = new Command("add", null, async (context, args) => {
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
export class Command implements ICommand {
    private _name: string;
    private readonly _schema: Schema;
    private readonly _action: CommandAction;

    /**
     * Creates a new command object and assigns it's parameters.
     * 
     * @param name      the command name.
     * @param schema    the schema to validate command arguments.
     * @param action      the function to be executed by this command.
     */
    public constructor(name: string, schema: Schema, action: IExecutable | CommandAction) {
        if (name == null) {
            throw new Error("Name cannot be null");
        }
        if (action == null) {
            throw new Error("Action cannot be null");
        }

        this._name = name;
        this._schema = schema;

        if (typeof action !== "function") {
            this._action = action.execute;
        } else {
            this._action = action;
        }

        if (typeof this._action !== "function") {
            throw new Error("Function doesn't have function type");
        }
    }

    /** 
     * Gets the command name.
     * @returns the name of this command. 
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Executes the command. Before execution it validates [[Parameters args]] using
     * the defined schema.
     * 
     * @param context (optional) transaction id to trace execution through call chain.
     * @param args          the parameters (arguments) to pass to this command for execution.
     * @returns             the execution result
     * 
     * @see [[Parameters]]
     */
    public async execute(context: IContext, args: Parameters): Promise<any> {
        if (this._schema) {
            this._schema.validateAndThrowException(context, args);
        }

        try {
            return await this._action(context, args);
        } catch (ex) {
            throw new InvocationException(
                context,
                "EXEC_FAILED",
                "Execution " + this.getName() + " failed: " + ex
            ).withDetails("command", this.getName()).wrap(ex);
        }
    }

    /**
     * Validates the command [[Parameters args]] before execution using the defined schema.
     * 
     * @param args  the parameters (arguments) to validate using this command's schema.
     * @returns     an array of ValidationResults or an empty array (if no schema is set).
     * 
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    public validate(args: Parameters): ValidationResult[] {
        if (this._schema) {
            return this._schema.validate(args);
        }

        return [];
    }
}
