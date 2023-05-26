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
export declare class ProcessContainer extends Container {
    protected _configPath: string;
    /**
     * Creates a new instance of the container.
     *
     * @param name          (optional) a container name (accessible via ContextInfo)
     * @param description   (optional) a container description (accessible via ContextInfo)
     */
    constructor(name?: string, description?: string);
    private getConfigPath;
    private getParameters;
    private showHelp;
    private printHelp;
    private captureErrors;
    private captureExit;
    /**
     * Runs the container by instantiating and running components inside the container.
     *
     * It reads the container configuration, creates, configures, references and opens components.
     * On process exit it closes, unreferences and destroys components to gracefully shutdown.
     *
     * @param args  command line arguments
     */
    run(args: string[]): void;
}
