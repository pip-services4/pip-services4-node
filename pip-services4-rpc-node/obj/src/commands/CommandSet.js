"use strict";
/** @module commands */
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
exports.CommandSet = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_data_node_4 = require("pip-services4-data-node");
const InterceptedCommand_1 = require("./InterceptedCommand");
/**
 * Contains a set of commands and events supported by a [[ICommandable commandable]] object.
 * The CommandSet supports command interceptors to extend and the command call chain.
 *
 * CommandSets can be used as alternative commandable interface to a business object.
 * It can be used to auto generate multiple external services for the business object
 * without writing much code.
 *
 * @see [[Command]]
 * @see [[Event]]
 * @see [[ICommandable]]
 *
 * ### Example ###
 *
 *     export class MyDataCommandSet extends CommandSet {
 *         private _service: IMyDataService;
 *
 *         constructor(service: IMyDataService) { // Any data service interface
 *             super();
 *             this._service = service;
 *             this.addCommand(this.makeGetMyDataCommand());
 *         }
 *
 *         private makeGetMyDataCommand(): ICommand {
 *             return new Command(
 *               'get_mydata',
 *               null,
 *               async (context: IContext, args: Parameters) => Promise<any> {
 *                   let param = args.getAsString('param');
 *                   return await this._service.getMyData(context, param);
 *               }
 *             );
 *         }
 *     }
 */
class CommandSet {
    /**
     * Creates an empty CommandSet object.
     */
    constructor() {
        this._commands = [];
        this._events = [];
        this._interceptors = [];
        this._commandsByName = {};
        this._eventsByName = {};
        //
    }
    /**
     * Gets all commands registered in this command set.
     *
     * @returns a list of commands.
     *
     * @see [[ICommand]]
     */
    getCommands() {
        return this._commands;
    }
    /**
     * Gets all events registred in this command set.
     *
     * @returns a list of events.
     *
     * @see [[IEvent]]
     */
    getEvents() {
        return this._events;
    }
    /**
     * Searches for a command by its name.
     *
     * @param commandName the name of the command to search for.
     * @returns the command, whose name matches the provided name.
     *
     * @see [[ICommand]]
     */
    findCommand(commandName) {
        return this._commandsByName[commandName];
    }
    /**
     * Searches for an event by its name in this command set.
     *
     * @param eventName the name of the event to search for.
     * @returns the event, whose name matches the provided name.
     *
     * @see [[IEvent]]
     */
    findEvent(eventName) {
        return this._eventsByName[eventName];
    }
    buildCommandChain(command) {
        let next = command;
        for (let i = this._interceptors.length - 1; i >= 0; i--) {
            next = new InterceptedCommand_1.InterceptedCommand(this._interceptors[i], next);
        }
        this._commandsByName[next.getName()] = next;
    }
    rebuildAllCommandChains() {
        this._commandsByName = {};
        for (const command of this._commands) {
            this.buildCommandChain(command);
        }
    }
    /**
     * Adds a [[ICommand command]] to this command set.
     *
     * @param command   the command to add.
     *
     * @see [[ICommand]]
     */
    addCommand(command) {
        this._commands.push(command);
        this.buildCommandChain(command);
    }
    /**
     * Adds multiple [[ICommand commands]] to this command set.
     *
     * @param commands the array of commands to add.
     *
     * @see [[ICommand]]
     */
    addCommands(commands) {
        for (const command of commands) {
            this.addCommand(command);
        }
    }
    /**
     * Adds an [[IEvent event]] to this command set.
     *
     * @param event the event to add.
     * @see [[IEvent]]
     */
    addEvent(event) {
        this._events.push(event);
        this._eventsByName[event.getName()] = event;
    }
    /**
     * Adds multiple [[IEvent events]] to this command set.
     *
     * @param events the array of events to add.
     *
     * @see [[IEvent]]
     */
    addEvents(events) {
        for (const event of events) {
            this.addEvent(event);
        }
    }
    /**
     * Adds all of the commands and events from specified [[CommandSet command set]]
     * into this one.
     *
     * @param commandSet the CommandSet to add.
     */
    addCommandSet(commandSet) {
        this.addCommands(commandSet.getCommands());
        this.addEvents(commandSet.getEvents());
    }
    /**
     * Adds a [[IEventListener listener]] to receive notifications on fired events.
     *
     * @param listener  the listener to add.
     *
     * @see [[IEventListener]]
     */
    addListener(listener) {
        for (const event of this._events) {
            event.addListener(listener);
        }
    }
    /**
     * Removes previosly added [[IEventListener listener]].
     *
     * @param listener  the listener to remove.
     *
     * @see [[IEventListener]]
     */
    removeListener(listener) {
        for (const event of this._events) {
            event.removeListener(listener);
        }
    }
    /**
     * Adds a [[ICommandInterceptor command interceptor]] to this command set.
     *
     * @param interceptor     the interceptor to add.
     *
     * @see [[ICommandInterceptor]]
     */
    addInterceptor(interceptor) {
        this._interceptors.push(interceptor);
        this.rebuildAllCommandChains();
    }
    /**
     * Executes a [[ICommand command]] specificed by its name.
     *
     * @param context (optional) transaction id to trace execution through call chain.
     * @param commandName   the name of that command that is to be executed.
     * @param args          the parameters (arguments) to pass to the command for execution.
     * @returns             the execution result
     *
     * @see [[ICommand]]
     * @see [[Parameters]]
     */
    execute(context, commandName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const cref = this.findCommand(commandName);
            let traceId = context != null ? context.getTraceId() : null;
            if (cref == null) {
                throw new pip_services4_commons_node_1.BadRequestException(traceId, "CMD_NOT_FOUND", "Request command does not exist")
                    .withDetails("command", commandName);
            }
            if (traceId != null && traceId != "") {
                traceId = pip_services4_data_node_4.IdGenerator.nextShort();
            }
            const results = cref.validate(args);
            pip_services4_data_node_1.ValidationException.throwExceptionIfNeeded(traceId, results, false);
            return yield cref.execute(context != null ? context : pip_services4_components_node_1.Context.fromTraceId(traceId), args);
        });
    }
    /**
     * Validates [[Parameters args]] for command specified by its name using defined schema.
     * If validation schema is not defined than the methods returns no errors.
     * It returns validation error if the command is not found.
     *
     * @param commandName   the name of the command for which the 'args' must be validated.
     * @param args          the parameters (arguments) to validate.
     * @returns             an array of ValidationResults. If no command is found by the given
     *                      name, then the returned array of ValidationResults will contain a
     *                      single entry, whose type will be ValidationResultType.Error.
     *
     * @see [[Command]]
     * @see [[Parameters]]
     * @see [[ValidationResult]]
     */
    validate(commandName, args) {
        const cref = this.findCommand(commandName);
        if (cref == null) {
            const result = [];
            result.push(new pip_services4_data_node_2.ValidationResult(null, pip_services4_data_node_3.ValidationResultType.Error, "CMD_NOT_FOUND", "Requested command does not exist", null, null));
            return result;
        }
        return cref.validate(args);
    }
    /**
     * Fires event specified by its name and notifies all registered
     * [[IEventListener listeners]]
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param eventName         the name of the event that is to be fired.
     * @param args              the event arguments (parameters).
     */
    notify(context, eventName, args) {
        const event = this.findEvent(eventName);
        if (event != null) {
            event.notify(context, args);
        }
    }
}
exports.CommandSet = CommandSet;
//# sourceMappingURL=CommandSet.js.map