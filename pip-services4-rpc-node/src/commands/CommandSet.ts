/** @module commands */

import { IContext } from 'pip-services4-components-node';
import { Parameters } from 'pip-services4-components-node';
import { BadRequestException } from 'pip-services4-commons-node';
import { ValidationException } from 'pip-services4-data-node';
import { ValidationResult } from 'pip-services4-data-node';
import { ValidationResultType } from 'pip-services4-data-node';
import { IdGenerator } from 'pip-services4-data-node';

import { ICommand } from './ICommand';
import { IEvent } from './IEvent';
import { IEventListener } from './IEventListener';
import { ICommandInterceptor } from './ICommandInterceptor';
import { InterceptedCommand } from './InterceptedCommand';

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
export class CommandSet {
    private readonly _commands: ICommand[] = [];
    private readonly _events: IEvent[] = [];
    private readonly _interceptors: ICommandInterceptor[] = [];

    private _commandsByName: { [name: string]: ICommand } = {};
    private _eventsByName: { [name: string]: IEvent } = {};

    /**
     * Creates an empty CommandSet object.
     */
    public constructor() { }

    /**
     * Gets all commands registered in this command set.
     * 
     * @returns a list of commands.
     * 
     * @see [[ICommand]]
     */
    public getCommands(): ICommand[] {
        return this._commands;
    }

    /**
     * Gets all events registred in this command set.
     * 
     * @returns a list of events.
     * 
     * @see [[IEvent]]
     */
    public getEvents(): IEvent[] {
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
    public findCommand(commandName: string): ICommand {
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
    public findEvent(eventName: string): IEvent {
        return this._eventsByName[eventName];
    }

    private buildCommandChain(command: ICommand): void {
        let next: ICommand = command;

        for (let i = this._interceptors.length - 1; i >= 0; i--) {
            next = new InterceptedCommand(this._interceptors[i], next);
        }

        this._commandsByName[next.getName()] = next;
    }

    private rebuildAllCommandChains(): void {
        this._commandsByName = {};
        for (let command of this._commands) {
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
    public addCommand(command: ICommand): void {
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
    public addCommands(commands: ICommand[]): void {
        for (let command of commands) {
            this.addCommand(command);
        }
    }

    /**
     * Adds an [[IEvent event]] to this command set.
     * 
     * @param event the event to add.
     * @see [[IEvent]]
     */
    public addEvent(event: IEvent): void {
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
    public addEvents(events: IEvent[]): void {
        for (let event of events) {
            this.addEvent(event);
        }
    }

    /**
     * Adds all of the commands and events from specified [[CommandSet command set]]
     * into this one.
     * 
     * @param commandSet the CommandSet to add.
     */
    public addCommandSet(commandSet: CommandSet): void {
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
    public addListener(listener: IEventListener): void {
        for (let event of this._events) {
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
    public removeListener(listener: IEventListener): void {
        for (let event of this._events) {
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
    public addInterceptor(interceptor: ICommandInterceptor): void {
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
    public async execute(context: IContext, commandName: string, args: Parameters): Promise<any> {
        let cref = this.findCommand(commandName);

        if (cref == null) {
            throw new BadRequestException(
                context,
                "CMD_NOT_FOUND",
                "Request command does not exist"
            )
            .withDetails("command", commandName);
        }

        if (context != null && context != "") {
            context = IdGenerator.nextShort();
        }

        let results = cref.validate(args);
        ValidationException.throwExceptionIfNeeded(context, results, false);

        return await cref.execute(context, args);
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
    public validate(commandName: string, args: Parameters): ValidationResult[] {
        let cref = this.findCommand(commandName);

        if (cref == null) {
            let result: ValidationResult[] = [];
            result.push(new ValidationResult(
                null, 
                ValidationResultType.Error, 
                "CMD_NOT_FOUND", 
                "Requested command does not exist", 
                null, 
                null
            ));
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
    public notify(context: IContext, eventName: string, args: Parameters): void {
        let event = this.findEvent(eventName);
        if (event != null) {
            event.notify(context, args);
        }
    }
}
