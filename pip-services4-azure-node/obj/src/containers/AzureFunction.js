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
exports.AzureFunction = void 0;
/** @module containers */
/** @hidden */
const process = require('process');
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const pip_services3_commons_node_4 = require("pip-services4-commons-node");
const pip_services3_commons_node_5 = require("pip-services4-commons-node");
const pip_services3_container_node_1 = require("pip-services4-container-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_components_node_3 = require("pip-services4-components-node");
const pip_services3_rpc_node_1 = require("pip-services4-rpc-node");
const AzureFunctionContextHelper_1 = require("./AzureFunctionContextHelper");
/**
 * Abstract Azure Function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * When handling calls "cmd" parameter determines which what action shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Azure Function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:service:azurefunc:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-azure-node/interfaces/services.iazurefunctionservice.html IAzureFunctionService]] services to handle action requests
 * - <code>\*:service:commandable-azurefunc:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-azure-node/interfaces/services.iazurefunctionservice.html IAzureFunctionService]] services to handle action requests
 *
 *
 * ### Example ###
 *
 *     class MyAzureFunctionFunction extends AzureFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup Azure Function");
 *         }
 *     }
 *
 *     let azureFunction = new MyAzureFunctionFunction();
 *
 *     await service.run();
 *     console.log("MyAzureFunctionFunction is started");
 */
class AzureFunction extends pip_services3_container_node_1.Container {
    /**
     * Creates a new instance of this Azure Function function.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name, description) {
        super(name, description);
        /**
         * The performanc counters.
         */
        this._counters = new pip_services3_components_node_1.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services3_components_node_3.CompositeTracer();
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services3_commons_node_3.DependencyResolver();
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
        this._logger = new pip_services3_components_node_2.ConsoleLogger();
    }
    getConfigPath() {
        return process.env.CONFIG_PATH || this._configPath;
    }
    getParameters() {
        return pip_services3_commons_node_2.ConfigParams.fromValue(process.env);
    }
    captureErrors(correlationId) {
        // Log uncaught exceptions
        process.on('uncaughtException', (ex) => {
            this._logger.fatal(correlationId, ex, "Process is terminated");
            process.exit(1);
        });
    }
    captureExit(correlationId) {
        this._logger.info(correlationId, "Press Control-C to stop the microservice...");
        // Activate graceful exit
        process.on('SIGINT', () => {
            process.exit();
        });
        // Gracefully shutdown
        process.on('exit', () => {
            this.close(correlationId);
            this._logger.info(correlationId, "Goodbye!");
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
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     */
    open(correlationId) {
        const _super = Object.create(null, {
            open: { get: () => super.open }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOpen())
                return;
            yield _super.open.call(this, correlationId);
            this.registerServices();
        });
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a InstrumentTiming object that is used to end the time measurement.
     *
     * Note: This method has been deprecated. Use AzureFunctionService instead.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns {InstrumentTiming} object to end the time measurement.
     */
    instrument(correlationId, name) {
        this._logger.trace(correlationId, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, name, null);
        return new pip_services3_rpc_node_1.InstrumentTiming(correlationId, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
    }
    /**
     * Runs this Azure Function, loads container configuration,
     * instantiate components and manage their lifecycle,
     * makes this function ready to access action calls.
     *
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = this._info.name;
            let path = this.getConfigPath();
            let parameters = this.getParameters();
            this.readConfigFromFile(correlationId, path, parameters);
            this.captureErrors(correlationId);
            this.captureExit(correlationId);
            yield this.open(correlationId);
        });
    }
    /**
     * Registers all actions in this Azure Function.
     *
     * Note: Overloading of this method has been deprecated. Use AzureFunctionService instead.
     */
    register() { }
    /**
     * Registers all Azure Function services in the container.
     */
    registerServices() {
        // Extract regular and commandable Azure Function services from references
        let services = this._references.getOptional(new pip_services3_commons_node_4.Descriptor("*", "service", "azurefunc", "*", "*"));
        let cmdServices = this._references.getOptional(new pip_services3_commons_node_4.Descriptor("*", "service", "commandable-azurefunc", "*", "*"));
        services.push(...cmdServices);
        // Register actions defined in those services
        for (let service of services) {
            // Check if the service implements required interface
            if (typeof service.getActions !== "function")
                continue;
            let actions = service.getActions();
            for (let action of actions) {
                this.registerAction(action.cmd, action.schema, action.action);
            }
        }
    }
    /**
     * Registers an action in this Azure Function.
     *
     * Note: This method has been deprecated. Use AzureFunctionService instead.
     *
     * @param cmd           a action/command name.
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when action is invoked.
     */
    registerAction(cmd, schema, action) {
        if (cmd == '') {
            throw new pip_services3_commons_node_5.UnknownException(null, 'NO_COMMAND', 'Missing command');
        }
        if (action == null) {
            throw new pip_services3_commons_node_5.UnknownException(null, 'NO_ACTION', 'Missing action');
        }
        if (typeof action != "function") {
            throw new pip_services3_commons_node_5.UnknownException(null, 'ACTION_NOT_FUNCTION', 'Action is not a function');
        }
        if (this._actions.hasOwnProperty(cmd)) {
            throw new pip_services3_commons_node_5.UnknownException(null, 'DUPLICATED_ACTION', `"${cmd}" action already exists`);
        }
        // Hack!!! Wrapping action to preserve prototyping context
        const actionCurl = (context) => {
            // Perform validation
            if (schema != null) {
                let params = Object.assign({}, context.params, context.query, { body: context.body });
                let correlationId = this.getCorrelationId(context);
                let err = schema.validateAndReturnException(correlationId, params, false);
                if (err != null) {
                    return err;
                }
            }
            // Todo: perform verification?
            return action.call(this, context);
        };
        this._actions[cmd] = actionCurl;
    }
    /**
     * Returns correlationId from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns correlationId from context
     */
    getCorrelationId(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getCorrelationId(context);
    }
    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  Azure Function context
     * @return Returns command from context
     */
    getCommand(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getCommand(context);
    }
    /**
     * Executes this Azure Function and returns the result.
     * This method can be overloaded in child classes
     * if they need to change the default behavior
     *
     * @params context the context parameters (or function arguments)
     * @returns the result of the function execution.
     */
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmd = this.getCommand(context);
            let correlationId = this.getCorrelationId(context);
            if (cmd == null) {
                throw new pip_services3_commons_node_1.BadRequestException(correlationId, 'NO_COMMAND', 'Cmd parameter is missing');
            }
            const action = this._actions[cmd];
            if (action == null) {
                throw new pip_services3_commons_node_1.BadRequestException(correlationId, 'NO_ACTION', 'Action ' + cmd + ' was not found')
                    .withDetails('command', cmd);
            }
            return action(context);
        });
    }
    handler(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // If already started then execute
            if (this.isOpen()) {
                return this.execute(context);
            }
            // Start before execute
            yield this.run();
            return this.execute(context);
        });
    }
    /**
     * Gets entry point into this Azure Function.
     *
     * @param context     an incoming context object with invocation parameters.
     */
    getHandler() {
        let self = this;
        // Return plugin function
        return function (context) {
            return __awaiter(this, void 0, void 0, function* () {
                // Calling run with changed context
                return self.handler.call(self, context);
            });
        };
    }
    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determin
     * what action shall be called.
     *
     * This method shall only be used in testing.
     *
     * @param context action parameters.
     */
    act(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getHandler()({ body: context });
        });
    }
}
exports.AzureFunction = AzureFunction;
//# sourceMappingURL=AzureFunction.js.map