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
exports.CloudFunction = void 0;
/** @module containers */
/** @hidden */
const process = require("process");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_container_node_1 = require("pip-services4-container-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_observability_node_3 = require("pip-services4-observability-node");
const pip_services4_rpc_node_1 = require("pip-services4-rpc-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const CloudFunctionRequestHelper_1 = require("./CloudFunctionRequestHelper");
/**
 * Abstract Google Function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Google Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:cloudfunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/controllers.iCloudFunctioncontroller.html ICloudFunctionController]] controllers to handle action requests
 * - <code>\*:controller:commandable-cloudfunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-gcp-node/interfaces/controllers.iCloudFunctioncontroller.html ICloudFunctionController]] controllers to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyCloudFunction extends CloudFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup Google Function");
 *         }
 *     }
 *
 *     let cloudFunction = new MyCloudFunction();
 *
 *     await cloudFunction.run();
 *     console.log("MyCloudFunction is started");
 */
class CloudFunction extends pip_services4_container_node_1.Container {
    /**
     * Creates a new instance of this Google Function function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        super(name, description);
        /**
         * The performanc counters.
         */
        this._counters = new pip_services4_observability_node_1.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services4_observability_node_3.CompositeTracer();
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services4_components_node_2.DependencyResolver();
        /**
         * The map of registred validation schemas.
         */
        this._schemas = {};
        /**
         * The map of registered actions.
         */
        this._actions = {};
        /**
         * The default path to config file.
         */
        this._configPath = './config/config.yml';
        this._logger = new pip_services4_observability_node_2.ConsoleLogger();
    }
    getConfigPath() {
        return process.env.CONFIG_PATH || this._configPath;
    }
    getConfigParameters() {
        return pip_services4_components_node_1.ConfigParams.fromValue(process.env);
    }
    captureErrors(context) {
        // Log uncaught exceptions
        process.on('uncaughtException', (ex) => {
            this._logger.fatal(context, ex, "Process is terminated");
            process.exit(1);
        });
    }
    captureExit(context) {
        this._logger.info(context, "Press Control-C to stop the microcontroller...");
        // Activate graceful exit
        process.on('SIGINT', () => {
            process.exit();
        });
        // Gracefully shutdown
        process.on('exit', () => {
            this.close(context);
            this._logger.info(context, "Goodbye!");
        });
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        super.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this.register();
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        const _super = Object.create(null, {
            open: { get: () => super.open }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen())
                return;
            yield _super.open.call(this, context);
            this.registerControllers();
        });
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     *
     * Note: This method has been deprecated. Use CloudFunctionController instead.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    instrument(context, name) {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new pip_services4_rpc_node_1.InstrumentTiming(context, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
    }
    /**
     * Runs this Google Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = pip_services4_components_node_1.Context.fromTraceId(this._info.name);
            const path = this.getConfigPath();
            const parameters = this.getConfigParameters();
            this.readConfigFromFile(context, path, parameters);
            this.captureErrors(context);
            this.captureExit(context);
            yield this.open(context);
        });
    }
    /**
     * Registers all actions in this Google Function.
     *
     * Note: Overloading of this method has been deprecated. Use CloudFunctionController instead.
     */
    register() {
        //
    }
    /**
     * Registers all Google Function controllers in the container.
     */
    registerControllers() {
        // Extract regular and commandable Google Function controllers from references
        const controllers = this._references.getOptional(new pip_services4_components_node_3.Descriptor("*", "controller", "cloudfunc", "*", "*"));
        const cmdControllers = this._references.getOptional(new pip_services4_components_node_3.Descriptor("*", "controller", "commandable-cloudfunc", "*", "*"));
        controllers.push(...cmdControllers);
        // Register actions defined in those controllers
        for (const controller of controllers) {
            // Check if the controller implements required interface
            if (typeof controller.getActions !== "function")
                continue;
            const actions = controller.getActions();
            for (const action of actions) {
                this.registerAction(action.cmd, action.schema, action.action);
            }
        }
    }
    /**
     * Registers an action in this Google Function.
     *
     * Note: This method has been deprecated. Use CloudFunctionController instead.
     *
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    registerAction(cmd, schema, action) {
        if (cmd == '') {
            throw new pip_services4_commons_node_2.UnknownException(null, 'NO_COMMAND', 'Missing command');
        }
        if (action == null) {
            throw new pip_services4_commons_node_2.UnknownException(null, 'NO_ACTION', 'Missing action');
        }
        if (typeof action != "function") {
            throw new pip_services4_commons_node_2.UnknownException(null, 'ACTION_NOT_FUNCTION', 'Action is not a function');
        }
        if (Object.prototype.hasOwnProperty.call(this._actions, cmd)) {
            throw new pip_services4_commons_node_2.UnknownException(null, 'DUPLICATED_ACTION', `"${cmd}" action already exists`);
        }
        // Hack!!! Wrapping action to preserve prototyping request
        const actionCurl = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Perform validation
            if (schema != null) {
                const params = Object.assign({}, req.params, req.query, { body: req.body });
                const context = this.getTraceId(req);
                const err = schema.validateAndReturnException(context, params, false);
                if (err != null) {
                    pip_services4_http_node_1.HttpResponseSender.sendError(req, res, err);
                }
            }
            // Todo: perform verification?
            return yield action.call(this, req, res);
        });
        this._actions[cmd] = actionCurl;
    }
    /**
     * Returns context from Googel Function request.
     * This method can be overloaded in child classes
     * @param req -  Googel Function request
     * @return Returns context from request
     */
    getTraceId(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getTraceId(req);
    }
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  Google Function request
     * @return Returns command from request
     */
    getCommand(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getCommand(req);
    }
    /**
     * Executes this Google Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     *
     * @param req the function request
     * @param res the function response
     * @returns the promise.
     */
    execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = this.getCommand(req);
            const traceId = this.getTraceId(req);
            if (cmd == null) {
                pip_services4_http_node_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.BadRequestException(traceId, 'NO_COMMAND', 'Cmd parameter is missing'));
                return;
            }
            const action = this._actions[cmd];
            if (action == null) {
                pip_services4_http_node_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.BadRequestException(traceId, 'NO_ACTION', 'Action ' + cmd + ' was not found').withDetails('command', cmd));
                return;
            }
            return yield action(req, res);
        });
    }
    handler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // If already started then execute
            if (this.isOpen()) {
                return yield this.execute(req, res);
            }
            // Start before execute
            yield this.run();
            return yield this.execute(req, res);
        });
    }
    /**
     * Gets entry point into this Google Function.
     *
     * @param res     an incoming request object with invocation parameters.
     * @param res     an returnning response object with result parameters.
     */
    getHandler() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        // Return plugin function
        return function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                // Calling run with changed request
                return self.handler.call(self, req, res);
            });
        };
    }
}
exports.CloudFunction = CloudFunction;
//# sourceMappingURL=CloudFunction.js.map