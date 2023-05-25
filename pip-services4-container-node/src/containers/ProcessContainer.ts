/** @module core */
/** @hidden */
let process = require('process');

import { ConsoleLogger } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-commons-node';

import { Container } from './Container';

/**
 * Inversion of control (IoC) container that runs as a system process.
 * It processes command line arguments and handles unhandled exceptions and Ctrl-C signal
 * to gracefully shutdown the container.
 * 
 * ### Command line arguments ###
 * - <code>--config / -c</code>             path to JSON or YAML file with container configuration (default: "./config/config.yml")
 * - <code>--param / --params / -p</code>   value(s) to parameterize the container configuration
 * - <code>--help / -h</code>               prints the container usage help
 * 
 * @see [[Container]]
 * 
 * ### Example ###
 * 
 *     let container = new ProcessContainer();
 *     container.addFactory(new MyComponentFactory());
 *     
 *     container.run(process.args);
 */
export class ProcessContainer extends Container {
    protected _configPath: string = './config/config.yml';

    /**
     * Creates a new instance of the container.
     * 
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    public constructor(name?: string, description?: string) {
        super(name, description);
        this._logger = new ConsoleLogger();
    }

    private getConfigPath(args: string[]): string {
        for (let index = 0; index < args.length; index++) {
            let arg = args[index];
            let nextArg = index < args.length - 1 ? args[index + 1] : null;
            nextArg = nextArg && nextArg.startsWith('-') ? null : nextArg;
            if (nextArg != null) {
                if (arg == "--config" || arg == "-c") {
                    return nextArg;
                }
            }
        }
        return this._configPath;
    }

    private getParameters(args: string[]): ConfigParams {
        // Process command line parameters
        let line = '';
        for (let index = 0; index < args.length; index++) {
            let arg = args[index];
            let nextArg = index < args.length - 1 ? args[index + 1] : null;
            nextArg = nextArg && nextArg.startsWith('-') ? null : nextArg;
            if (nextArg != null) {
                if (arg == "--param" || arg == "--params" || arg == "-p") {
                    if (line.length > 0)
                        line = line + ';';
                    line = line + nextArg;
                    index++;
                }
            }
        }
        let parameters = ConfigParams.fromString(line);

        // Process environmental variables
        parameters.append(process.env);

        return parameters;
    }

    private showHelp(args: string[]) {
        for (let index = 0; index < args.length; index++) {
            let arg = args[index];
            if (arg == "--help" || arg == "-h") {
                return true;
            }
        }
        return false;
    }

    private printHelp() {
        console.log("Pip.Services process container - http://www.pipservices.org");
        console.log("run [-h] [-c <config file>] [-p <param>=<value>]*");
    }
    
    private captureErrors(context: IContext): void {
        // Log uncaught exceptions
        process.on('uncaughtException', (ex) => {
			this._logger.fatal(context, ex, "Process is terminated");
            process.exit(1);
        });
    }

    private captureExit(context: IContext): void {
        this._logger.info(context, "Press Control-C to stop the microservice...");

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
     * Runs the container by instantiating and running components inside the container.
     * 
     * It reads the container configuration, creates, configures, references and opens components.
     * On process exit it closes, unreferences and destroys components to gracefully shutdown. 
     * 
     * @param args  command line arguments
     */
    public run(args: string[]): void {
        if (this.showHelp(args)) {
            this.printHelp();
            return;
        }

        let context = this._info.name;
        let path = this.getConfigPath(args);
        let parameters = this.getParameters(args);
        this.readConfigFromFile(context, path, parameters);

        this.captureErrors(context);
        this.captureExit(context);

    	this.open(context);
    }

}
