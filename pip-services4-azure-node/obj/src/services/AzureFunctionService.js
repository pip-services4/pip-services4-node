"use strict";
/** @module services */
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
exports.AzureFunctionService = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_components_node_3 = require("pip-services4-components-node");
const pip_services3_rpc_node_1 = require("pip-services4-rpc-node");
const AzureFunctionContextHelper_1 = require("../containers/AzureFunctionContextHelper");
/**
 * Abstract service that receives remove calls via Azure Function protocol.
 *
 * This service is intended to work inside AzureFunction container that
 * exposes registered actions externally.
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
 *
 * ### Example ###
 *
 *     class MyAzureFunctionService extends AzureFunctionService {
 *        private _controller: IMyController;
 *        ...
 *        public constructor() {
 *           base('v1.myservice');
 *           this._dependencyResolver.put(
 *               "controller",
 *               new Descriptor("mygroup","controller","*","*","1.0")
 *           );
 *        }
 *
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._controller = this._dependencyResolver.getRequired<IMyController>("controller");
 *        }
 *
 *        public register(): void {
 *            registerAction("get_mydata", null, async (context) => {
 *                let context = context.trace_id;
 *                let id = context.id;
 *                return await this._controller.getMyData(context, id);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let service = new MyAzureFunctionService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     service.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","controller","default","default","1.0"), controller
 *     ));
 *
 *     service.open("123");
 */
class AzureFunctionService {
    /**
     * Creates an instance of this service.
     * @param name a service name to generate action cmd.
     */
    constructor(name) {
        this._actions = [];
        this._interceptors = [];
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services3_commons_node_1.DependencyResolver();
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services3_components_node_3.CompositeTracer();
        this._name = name;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }
    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    getActions() {
        return this._actions;
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(context, name) {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        let counterTiming = this._counters.beginTiming(name + ".exec_time");
        let traceTiming = this._tracer.beginTrace(context, name, null);
        return new pip_services3_rpc_node_1.InstrumentTiming(context, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            this.register();
            this._opened = true;
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._opened) {
                return;
            }
            this._opened = false;
            this._actions = [];
            this._interceptors = [];
        });
    }
    applyValidation(schema, action) {
        // Create an action function
        let actionWrapper = (context) => __awaiter(this, void 0, void 0, function* () {
            // Validate object
            if (schema && context) {
                // Perform validation
                let params = Object.assign({}, context.params, context.query, { body: context.body });
                let context = this.getTraceId(context);
                let err = schema.validateAndReturnException(context, params, false);
                if (err) {
                    return err;
                }
            }
            let result = yield action.call(this, context);
            return result;
        });
        return actionWrapper;
    }
    applyInterceptors(action) {
        let actionWrapper = action;
        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            let interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (context) => {
                    return interceptor(context, action);
                };
            })(actionWrapper);
        }
        return actionWrapper;
    }
    generateActionCmd(name) {
        let cmd = name;
        if (this._name != null) {
            cmd = this._name + "." + cmd;
        }
        return cmd;
    }
    /**
     * Registers a action in Azure Function function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    registerAction(name, schema, action) {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);
        let self = this;
        let registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
        };
        this._actions.push(registeredAction);
    }
    /**
     * Registers an action with authorization.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param authorize     an authorization interceptor
     * @param action        an action function that is called when operation is invoked.
     */
    registerActionWithAuth(name, schema, authorize, action) {
        let actionWrapper = this.applyValidation(schema, action);
        // Add authorization just before validation
        actionWrapper = (call) => {
            return authorize(call, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);
        let self = this;
        let registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (context) => { return actionWrapper.call(self, context); }
        };
        this._actions.push(registeredAction);
    }
    /**
     * Registers a middleware for actions in Azure Function service.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    registerInterceptor(cmd, action) {
        let self = this;
        let interceptorWrapper = (req, next) => __awaiter(this, void 0, void 0, function* () {
            let currCmd = this.getCommand(req);
            let match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                return yield next.call(self, req);
            else
                return yield action.call(self, req, next);
        });
        this._interceptors.push(interceptorWrapper);
    }
    /**
     * Returns context from Azure Function context.
     * This method can be overloaded in child classes
     * @param context - the context context
     * @return returns context from context
     */
    getTraceId(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getTraceId(context);
    }
    /**
     * Returns command from Azure Function context.
     * This method can be overloaded in child classes
     * @param context -  the context context
     * @return returns command from context
     */
    getCommand(context) {
        return AzureFunctionContextHelper_1.AzureFunctionContextHelper.getCommand(context);
    }
    /**
     * Calls registered action in this Azure Function.
     * "cmd" parameter in the action parameters determine
     * what action shall be called.
     *
     * This method shall only be used in testing.
     *
     * @param context the context context.
     */
    act(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmd = this.getCommand(context);
            let context = this.getTraceId(context);
            if (cmd == null) {
                throw new pip_services3_commons_node_2.BadRequestException(context, 'NO_COMMAND', 'Cmd parameter is missing');
            }
            const action = this._actions.find(a => a.cmd == cmd);
            if (action == null) {
                throw new pip_services3_commons_node_2.BadRequestException(context, 'NO_ACTION', 'Action ' + cmd + ' was not found')
                    .withDetails('command', cmd);
            }
            return action.action(context);
        });
    }
}
exports.AzureFunctionService = AzureFunctionService;
//# sourceMappingURL=AzureFunctionService.js.map