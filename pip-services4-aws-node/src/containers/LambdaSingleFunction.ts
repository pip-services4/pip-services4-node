/** @module containers */
/** @hidden */
import process = require("process");

import { ILambdaController } from "../controllers/ILambdaController";
import {
  UnknownException,
  BadRequestException,
} from "pip-services4-commons-node";
import {
  DependencyResolver,
  ConfigParams,
  IContext,
  IReferences,
  Descriptor,
  Context,
} from "pip-services4-components-node";
import { Container } from "pip-services4-container-node";
import {
  CompositeCounters,
  CompositeTracer,
  ConsoleLogger,
} from "pip-services4-observability-node";
import { InstrumentTiming } from "pip-services4-rpc-node";
import { Schema } from "pip-services4-data-node";

/**
 * Abstract AWS single Lambda function, that acts as a container to instantiate and run components
 * and expose them via external entry point.
 *
 * Function has only one action which shall be called, while
 * other parameters are passed to the action itself.
 *
 * Container configuration for this Lambda function is stored in <code>"./config/config.yml"</code> file.
 * But this path can be overriden by <code>CONFIG_PATH</code> environment variable.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:controller:awslambda:\*:1.0</code>       (optional) [[https://pip-services4-node.github.io/pip-services4-aws-node/interfaces/services.ilambdacontroller.html ILambdaController]] controllers to handle action requests
 * - <code>\*:controller:commandable-awslambda:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-aws-node/interfaces/services.ilambdacontroller.html ILambdaController]] controllers to handle action requests
 *
 * @see [[LambdaClient]]
 *
 * ### Example ###
 *
 *     class MyLambdaSingleFunction extends LambdaSingleFunction {
 *         public constructor() {
 *             base("mygroup", "MyGroup lambda single function");
 *         }
 *     }
 *
 *     let lambda = new MyLambdaFunction();
 *
 *     await container.run();
 *     console.log("MyLambdaSingleFunction is started");
 */
export abstract class LambdaSingleFunction extends Container {
  /**
   * The performanc counters.
   */
  protected _counters = new CompositeCounters();
  /**
   * The tracer.
   */
  protected _tracer: CompositeTracer = new CompositeTracer();
  /**
   * The dependency resolver.
   */
  protected _dependencyResolver = new DependencyResolver();
  /**
   * The map of registred validation schemas.
   */
  protected _schemas: { [id: string]: Schema } = {};
  /**
   * The map of registered actions.
   */
  protected _action: { [id: string]: any } = {};
  /**
   * The default path to config file.
   */
  protected _configPath = "./config/config.yml";

  /**
   * The default path to config file.
   */
  protected _name = "";

  /**
   * Creates a new instance of this lambda function.
   *
   * @param name          (optional) a container name (accessible via ContextInfo)
   * @param description   (optional) a container description (accessible via ContextInfo)
   */
  public constructor(name?: string, description?: string) {
    super(name, description);

    this._logger = new ConsoleLogger();
    this._dependencyResolver;
    this._name = name || "Single Lambda Function";
  }

  private getConfigPath(): string {
    return process.env.CONFIG_PATH || this._configPath;
  }

  private getParameters(): ConfigParams {
    return ConfigParams.fromValue(process.env);
  }

  private captureErrors(context: IContext): void {
    // Log uncaught exceptions
    process.on("uncaughtException", (ex) => {
      this._logger.fatal(context, ex, "Process is terminated");
      process.exit(1);
    });
  }

  private captureExit(context: IContext): void {
    this._logger.info(context, "Press Control-C to stop the microservice...");

    // Activate graceful exit
    process.on("SIGINT", () => {
      process.exit();
    });

    // Gracefully shutdown
    process.on("exit", () => {
      this.close(context);
      this._logger.info(context, "Goodbye!");
    });
  }

  /**
   * Sets references to dependent components.
   *
   * @param references 	references to locate the component dependencies.
   */
  public setReferences(references: IReferences): void {
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
  public async open(context: IContext): Promise<void> {
    if (this.isOpen()) return;

    await super.open(context);
    //  this.registerControllers();
  }

  /**
   * Adds instrumentation to log calls and measure call time.
   * It returns a InstrumentTiming object that is used to end the time measurement.
   *
   * Note: This method has been deprecated. Use LambdaController instead.
   *
   * @param context     (optional) a context to trace execution through call chain.
   * @param name              a method name.
   * @returns {InstrumentTiming} object to end the time measurement.
   */
  protected instrument(context: IContext, name: string): InstrumentTiming {
    this._logger.trace(context, "Executing %s method", name);
    this._counters.incrementOne(name + ".exec_count");

    const counterTiming = this._counters.beginTiming(name + ".exec_time");
    const traceTiming = this._tracer.beginTrace(context, name, null);
    return new InstrumentTiming(
      context,
      name,
      "exec",
      this._logger,
      this._counters,
      counterTiming,
      traceTiming
    );
  }

  /**
   * Runs this lambda function, loads container configuration,
   * instantiate components and manage their lifecycle,
   * makes this function ready to access action calls.
   *
   */
  public async run(): Promise<void> {
    const context = Context.fromTraceId(this._info.name);

    const path = this.getConfigPath();
    const parameters = this.getParameters();
    this.readConfigFromFile(context, path, parameters);

    this.captureErrors(context);
    this.captureExit(context);
    await this.open(context);
  }

  /**
   * Registers all actions in this lambda function.
   *
   * Note: Overloading of this method has been deprecated. Use LambdaController instead.
   */
  protected register(): void {
    //
  }

  /**
   * Registers all lambda controllers in the container.
   */
  // protected registerControllers(): void {
  //     // Extract regular and commandable Lambda controllers from references
  //     const controllers = this._references.getOptional<ILambdaController>(
  //         new Descriptor("*", "controller", "awslambda", "*", "*")
  //     );
  //     const cmdControllers = this._references.getOptional<ILambdaController>(
  //         new Descriptor("*", "controller", "commandable-awslambda", "*", "*")
  //     );
  //     controllers.push(...cmdControllers);

  //     // Register actions defined in those controllers
  //     for (const controller of controllers) {
  //         // Check if the controller implements required interface
  //         if (typeof controller.getActions !== "function") continue;

  //         const actions = controller.getActions();
  //         for (const action of actions) {
  //             this.registerAction(action.cmd, action.schema, action.action);
  //         }
  //     }
  // }

  /**
   * Registers an action in this lambda function.
   *
   * Note: This method has been deprecated. Use LambdaController instead.
   *
   * @param cmd           a action/command name.
   * @param schema        a validation schema to validate received parameters.
   * @param action        an action function that is called when action is invoked.
   */
  protected registerSingleAction(
    schema: Schema,
    action: (params: any) => Promise<any>
  ): void {
    if (action == null) {
      throw new UnknownException(null, "NO_ACTION", "Missing action");
    }

    if (typeof action != "function") {
      throw new UnknownException(
        null,
        "ACTION_NOT_FUNCTION",
        "Action is not a function"
      );
    }

    // Hack!!! Wrapping action to preserve prototyping context
    const actionCurl = (params) => {
      // Perform validation
      if (schema != null) {
        const context = params.trace_id;
        const err = schema.validateAndReturnException(context, params, false);
        if (err != null) {
          throw err;
        }
      }

      // Todo: perform verification?
      return action.call(this, params);
    };

    this._action = actionCurl;
  }

  /**
   * Executes this AWS Lambda function and returns the result.
   * This method can be overloaded in child classes
   * if they need to change the default behavior
   *
   * @params event the event parameters (or function arguments)
   * @returns the result of the function execution.
   */
  protected async execute(event: any): Promise<any> {
    const context = event.trace_id;

    const action: any = this._action;
    if (action == null) {
      throw new BadRequestException(
        context,
        "NO_ACTION",
        "Action was not found in " + this._name
      ).withDetails("single_function_name", this._name);
    }

    return action(event);
  }

  private async handler(event: any): Promise<any> {
    // If already started then execute
    if (this.isOpen()) {
      return this.execute(event);
    }
    // Start before execute
    await this.run();
    return this.execute(event);
  }

  /**
   * Gets entry point into this lambda function.
   *
   * @param event     an incoming event object with invocation parameters.
   */
  public getHandler(): (event: any) => Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    // Return plugin function
    return async function (event) {
      // Calling run with changed context
      return self.handler.call(self, event);
    };
  }

  /**
   * Calls registered action in this lambda function.
   * "cmd" parameter in the action parameters determin
   * what action shall be called.
   *
   * This method shall only be used in testing.
   *
   * @param params action parameters.
   */
  public async act(params: any): Promise<any> {
    return this.getHandler()(params);
  }
}
