import { ConfigParams } from "pip-services4-commons-node";
/**
 * A set of utility functions to process connection parameters
 */
export declare class ConnectionUtils {
    /**
     * Concatinates two options by combining duplicated properties into comma-separated list
     * @param options1 first options to merge
     * @param options2 second options to merge
     * @param keys when define it limits only to specific keys
     */
    static concat(options1: ConfigParams, options2: ConfigParams, ...keys: string[]): ConfigParams;
    /**
     * Renames property if the target name is not used.
     *
     * @param options configuration options
     * @param fromName original property name.
     * @param toName property name to rename to.
     * @returns updated configuration options
     */
    static rename(options: ConfigParams, fromName: string, toName: string): ConfigParams;
    private static concatValues;
    /**
     * Parses URI into config parameters.
     * The URI shall be in the following form:
     *   protocol://username@password@host1:port1,host2:port2,...?param1=abc&param2=xyz&...
     *
     * @param uri the URI to be parsed
     * @param defaultProtocol a default protocol
     * @param defaultPort a default port
     * @returns a configuration parameters with URI elements
     */
    static parseUri(uri: string, defaultProtocol: string, defaultPort: number): ConfigParams;
    /**
     * Composes URI from config parameters.
     * The result URI will be in the following form:
     *   protocol://username@password@host1:port1,host2:port2,...?param1=abc&param2=xyz&...
     *
     * @param options configuration parameters
     * @param defaultProtocol a default protocol
     * @param defaultPort a default port
     * @returns a composed URI
     */
    static composeUri(options: ConfigParams, defaultProtocol: string, defaultPort: number): string;
    /**
     * Includes specified keys from the config parameters.
     * @param options configuration parameters to be processed.
     * @param keys a list of keys to be included.
     * @returns a processed config parameters.
     */
    static include(options: ConfigParams, ...keys: string[]): ConfigParams;
    /**
     * Excludes specified keys from the config parameters.
     * @param options configuration parameters to be processed.
     * @param keys a list of keys to be excluded.
     * @returns a processed config parameters.
     */
    static exclude(options: ConfigParams, ...keys: string[]): ConfigParams;
}
