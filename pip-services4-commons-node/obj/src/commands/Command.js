"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const InvocationException_1 = require("../errors/InvocationException");
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
class Command {
    /**
     * Creates a new command object and assigns it's parameters.
     *
     * @param name      the command name.
     * @param schema    the schema to validate command arguments.
     * @param action      the function to be executed by this command.
     */
    constructor(name, schema, action) {
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
        }
        else {
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
    getName() {
        return this._name;
    }
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
    execute(correlationId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._schema) {
                this._schema.validateAndThrowException(correlationId, args);
            }
            try {
                return yield this._action(correlationId, args);
            }
            catch (ex) {
                throw new InvocationException_1.InvocationException(correlationId, "EXEC_FAILED", "Execution " + this.getName() + " failed: " + ex).withDetails("command", this.getName()).wrap(ex);
            }
        });
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
    validate(args) {
        if (this._schema) {
            return this._schema.validate(args);
        }
        return [];
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map