/** @module controllers */
import { Parameters } from 'pip-services4-components-node';
import { CloudFunctionController } from './CloudFunctionController';
/**
 * Abstract controller that receives commands via Google Function protocol
 * to operations automatically generated for commands defined in [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/commands.icommandable.html ICommandable components]].
 * Each command is exposed as invoke method that receives command name and parameters.
 *
 * Commandable controllers require only 3 lines of code to implement a robust external
 * Google Function-based remote interface.
 *
 * This controller is intended to work inside Google Function container that
 * exploses registered actions externally.
 *
 * ### Configuration parameters ###
 *
 * - dependencies:
 *   - service:            override for Service dependency
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 *
 * @see [[CloudFunctionController]]
 *
 * ### Example ###
 *
 *     class MyCommandableCloudFunctionController extends CommandableCloudFunctionController {
 *        public constructor() {
 *           base("mydata");
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *     }
 *
 *     let controller = new MyCommandableCloudFunctionController();
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     await controller.open("123");
 *     console.log("The Google Function controller is running");
 */
export declare abstract class CommandableCloudFunctionController extends CloudFunctionController {
    private _commandSet;
    /**
     * Creates a new instance of the controller.
     *
     * @param name a controller name.
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
