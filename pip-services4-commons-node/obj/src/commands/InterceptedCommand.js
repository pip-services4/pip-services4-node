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
exports.InterceptedCommand = void 0;
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
 *         public async execute(correlationId: string, command: ICommand, args: Parameters): Promise<any> {
 *             console.log("Executed command " + command.getName());
 *             await command.execute(correlationId, args);
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
class InterceptedCommand {
    /**
     * Creates a new InterceptedCommand, which serves as a link in an execution chain. Contains information
     * about the interceptor that is being used and the next command in the chain.
     *
     * @param interceptor   the interceptor that is intercepting the command.
     * @param next          (link to) the next command in the command's execution chain.
     */
    constructor(interceptor, next) {
        this._interceptor = interceptor;
        this._next = next;
    }
    /**
     * @returns the name of the command that is being intercepted.
     */
    getName() {
        return this._interceptor.getName(this._next);
    }
    /**
     * Executes the next command in the execution chain using the given [[Parameters parameters]] (arguments).
     *
     * @param correlationId unique transaction id to trace calls across components.
     * @param args          the parameters (arguments) to pass to the command for execution.
     * @returns             the execution result
     *
     * @see [[Parameters]]
     */
    execute(correlationId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._interceptor.execute(correlationId, this._next, args);
        });
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
    validate(args) {
        return this._interceptor.validate(this._next, args);
    }
}
exports.InterceptedCommand = InterceptedCommand;
//# sourceMappingURL=InterceptedCommand.js.map