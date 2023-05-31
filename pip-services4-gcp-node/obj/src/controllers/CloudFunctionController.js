"use strict";
/** @module controllers */
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
exports.CloudFunctionController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_observability_node_3 = require("pip-services4-observability-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const pip_services4_rpc_node_1 = require("pip-services4-rpc-node");
const CloudFunctionRequestHelper_1 = require("../containers/CloudFunctionRequestHelper");
/**
 * Abstract controller that receives remove calls via Google Function protocol.
 *
 * This controller is intended to work inside CloudFunction container that
 * exposes registered actions externally.
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
 *
 * ### Example ###
 *
 *     class MyCloudFunctionController extends CloudFunctionController {
 *        private _service: IMyService;
 *        ...
 *        public constructor() {
 *           base('v1.mycontroller');
 *           this._dependencyResolver.put(
 *               "service",
 *               new Descriptor("mygroup","service","*","*","1.0")
 *           );
 *        }
 *
 *        public setReferences(references: IReferences): void {
 *           base.setReferences(references);
 *           this._service = this._dependencyResolver.getRequired<IMyService>("service");
 *        }
 *
 *        public register(): void {
 *            registerAction("get_mydata", null, async (req, res) => {
 *                let params = req.body;
 *                let context = params.trace_id;
 *                let id = params.id;
 *                const result = await this._service.getMyData(context, id);
 *
 *                res.send(result);
 *            });
 *            ...
 *        }
 *     }
 *
 *     let controller = new MyCloudFunctionController();
 *     controller.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 *     controller.setReferences(References.fromTuples(
 *        new Descriptor("mygroup","service","default","default","1.0"), service
 *     ));
 *
 *     controller.open("123");
 */
class CloudFunctionController {
    /**
     * Creates an instance of this controller.
     * @param name a controller name to generate action cmd.
     */
    constructor(name) {
        this._actions = [];
        this._interceptors = [];
        /**
         * The dependency resolver.
         */
        this._dependencyResolver = new pip_services4_components_node_1.DependencyResolver();
        /**
         * The logger.
         */
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        /**
         * The performance counters.
         */
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        /**
         * The tracer.
         */
        this._tracer = new pip_services4_observability_node_3.CompositeTracer();
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
     * Get all actions supported by the controller.
     * @returns an array with supported actions.
     */
    getActions() {
        return this._actions;
    }
    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a Timing object that is used to end the time measurement.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param name              a method name.
     * @returns Timing object to end the time measurement.
     */
    instrument(context, name) {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".exec_count");
        const counterTiming = this._counters.beginTiming(name + ".exec_time");
        const traceTiming = this._tracer.beginTrace(context, name, null);
        return new pip_services4_rpc_node_1.InstrumentTiming(context, name, "exec", this._logger, this._counters, counterTiming, traceTiming);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const actionWrapper = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Validate object
            if (schema && req) {
                // Perform validation
                const params = Object.assign({}, req.params, req.query, { body: req.body });
                const context = this.getTraceId(req);
                const err = schema.validateAndReturnException(context, params, false);
                if (err) {
                    pip_services4_http_node_1.HttpResponseSender.sendError(req, res, err);
                }
            }
            return action.call(this, req, res);
        });
        return actionWrapper;
    }
    applyInterceptors(action) {
        let actionWrapper = action;
        for (let index = this._interceptors.length - 1; index >= 0; index--) {
            const interceptor = this._interceptors[index];
            actionWrapper = ((action) => {
                return (req, res) => {
                    return interceptor(req, res, action);
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
     * Registers a action in Google Function function.
     *
     * @param name          an action name
     * @param schema        a validation schema to validate received parameters.
     * @param action        an action function that is called when operation is invoked.
     */
    registerAction(name, schema, action) {
        let actionWrapper = this.applyValidation(schema, action);
        actionWrapper = this.applyInterceptors(actionWrapper);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (req, res) => { return actionWrapper.call(self, req, res); }
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
        actionWrapper = (req, res) => {
            return authorize(req, res, actionWrapper);
        };
        actionWrapper = this.applyInterceptors(actionWrapper);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const registeredAction = {
            cmd: this.generateActionCmd(name),
            schema: schema,
            action: (req, res) => { return actionWrapper.call(self, req, res); }
        };
        this._actions.push(registeredAction);
    }
    /**
     * Registers a middleware for actions in Google Function controller.
     *
     * @param action an action function that is called when middleware is invoked.
     */
    registerInterceptor(cmd, action) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const interceptorWrapper = (req, res, next) => {
            const currCmd = this.getCommand(req);
            const match = (currCmd.match(cmd) || []).length > 0;
            if (cmd != null && cmd != "" && !match)
                next.call(self, req, res);
            else
                action.call(self, req, res, next);
        };
        this._interceptors.push(interceptorWrapper);
    }
    /**
     * Returns context from Google Function request.
     * This method can be overloaded in child classes
     * @param req - the function request
     * @return returns context from request
     */
    getTraceId(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getTraceId(req);
    }
    /**
     * Returns command from Google Function request.
     * This method can be overloaded in child classes
     * @param req -  the function request
     * @return returns command from request
     */
    getCommand(req) {
        return CloudFunctionRequestHelper_1.CloudFunctionRequestHelper.getCommand(req);
    }
}
exports.CloudFunctionController = CloudFunctionController;
//# sourceMappingURL=CloudFunctionController.js.map