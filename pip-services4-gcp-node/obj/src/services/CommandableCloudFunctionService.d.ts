/** @module services */
import { Parameters } from 'pip-services4-commons-node';
import { CloudFunctionService } from './CloudFunctionService';
/**
 * Abstract service that receives commands via Google Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable services require only 3 lines of code to implement a robust external
 * Google Function-based remote interface.
 *
 * This service is intended to work inside Google Function container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - controller:            override for Controller dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[CloudFunctionService]]
 *
 * ### Example ###
 *
 *     class MyCommandableCloudFunctionService extends CommandableCloudFunctionService {
 *        public constructor() {
 *           base("mydata");
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let service = new MyCommandableCloudFunctionService();
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     await service.open("123");
 *     console.log("The Google Function service is running");
 */
export declare abstract class CommandableCloudFunctionService extends CloudFunctionService {
    private _commandSet;
    /**
     * Creates a new instance of the service.
     *
     * @param name a service name.
     */
    constructor(name: string);
    /**
     * Returns body from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns Parameters from request
     */
    protected getParameters(req: any): Parameters;
    /**
     * Registers all actions in Google Function.
     */
    register(): void;
}
