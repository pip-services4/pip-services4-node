/** @module connect */
/** @hidden */
const querystring = require('querystring');

import { ConfigParams } from "pip-services4-commons-node";

/**
 * A set of utility functions to process connection parameters
 */
export class ConnectionUtils {
    /**
     * Concatinates two options by combining duplicated properties into comma-separated list
     * @param options1 first options to merge
     * @param options2 second options to merge
     * @param keys when define it limits only to specific keys
     */
     public static concat(options1: ConfigParams, options2: ConfigParams, ...keys: string[]): ConfigParams {
        let options = ConfigParams.fromValue(options1)
        for (let key of options2.getKeys()) {
            let value1 = options1.getAsString(key) || "";
            let value2 = options2.getAsString(key) || "";
            
            if (value1 != "" && value2 != "") {
                if (keys == null || keys.length == 0 || keys.indexOf(key) >= 0) {
                    options.setAsObject(key, value1 + "," + value2);
                }
            } else if (value1 != "") {
                options.setAsObject(key, value1);
            } else if (value2 != "") {
                options.setAsObject(key, value2);
            }
        }
        return options;
    }

    /**
     * Renames property if the target name is not used.
     * 
     * @param options configuration options
     * @param fromName original property name.
     * @param toName property name to rename to.
     * @returns updated configuration options
     */
    public static rename(options: ConfigParams, fromName: string, toName: string): ConfigParams {
        let fromValue = options.getAsObject(fromName);
        if (fromValue == null) return options;

        let toValue = options.getAsObject(toName);
        if (toValue != null) return options;

        options = ConfigParams.fromValue(options);
        options.setAsObject(toName, fromValue);
        options.remove(fromName);
        return options;
    }

    private static concatValues(value1: string, value2: string): string {
        if (value1 == null || value1 == "") return value2;
        if (value2 == null || value2 == "") return value1;
        return value1 + "," + value2;
    }

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
    public static parseUri(uri: string, defaultProtocol: string, defaultPort: number): ConfigParams {
        let options = new ConfigParams()

        if (uri == null || uri == "") return options;

        uri = uri.trim();

        // Process parameters
        let pos = uri.indexOf("?");
        if (pos > 0) {
            let params = uri.substring(pos + 1);            
            uri = uri.substring(0, pos);

            let paramsList = params.split("&");
            for (let param of paramsList) {
                let pos = param.indexOf("=");
                if (pos >= 0) {
                    let key =  querystring.unescape(param.substring(0, pos));
                    let value = querystring.unescape(param.substring(pos+1));
                    options.setAsObject(key, value);
                } else {
                    options.setAsObject(querystring.unescape(param), null);
                }
            }
        }

        // Process protocol
        pos = uri.indexOf("://");
        if (pos > 0) {
            let protocol = uri.substring(0,pos);
            uri = uri.substring(pos + 3);
            options.setAsObject("protocol", protocol);
        } else {
            options.setAsObject("protocol", defaultProtocol);
        }

        // Process user and password
        pos = uri.indexOf("@");
        if (pos > 0) {
            let userAndPass = uri.substring(0, pos);
            uri = uri.substring(pos + 1);
            
            pos = userAndPass.indexOf(":");
            if (pos > 0) {
                options.setAsObject("username", userAndPass.substring(0, pos));
                options.setAsObject("password", userAndPass.substring(pos + 1));
            } else {
                options.setAsObject("username", userAndPass);
            }
        }

        pos = uri.indexOf("/");
        if (pos > 0) {
            let path = uri.substring(pos + 1);
            uri = uri.substring(0, pos);
            options.setAsObject("path", path);
        }

        // Process host and ports
        // options.setAsObject("servers", this.concatValues(options.getAsString("servers"), uri));
        let servers = uri.split(",");
        for (let server of servers) {
            pos = server.indexOf(":");
            if (pos > 0) {
                options.setAsObject("servers", this.concatValues(options.getAsString("servers"), server));
                options.setAsObject("host", this.concatValues(options.getAsString("host"), server.substring(0, pos)));
                options.setAsObject("port", this.concatValues(options.getAsString("port"), server.substring(pos + 1)));
            } else {
                options.setAsObject("servers", this.concatValues(options.getAsString("servers"), server + ":" + defaultPort.toString()));
                options.setAsObject("host", this.concatValues(options.getAsString("host"), server));
                options.setAsObject("port", this.concatValues(options.getAsString("port"), defaultPort.toString()));
            }
        }

        return options;
    }

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
     public static composeUri(options: ConfigParams, defaultProtocol: string, defaultPort: number): string {
        let builder = "";

        let protocol = options.getAsStringWithDefault("protocol", defaultProtocol);
        if (protocol != null) {
            builder = protocol + "://" + builder;
        }

        let username = options.getAsNullableString("username");
        if (username != null) {
            builder += username;
            let password = options.getAsNullableString("password");
            if (password != null) {
                builder += ":" + password;
            }
            builder += "@";
        }

        let servers = "";
        let defaultPortStr = defaultPort > 0 ? defaultPort.toString() : "";
        let hosts = options.getAsStringWithDefault("host", "???").split(",");
        let ports = options.getAsStringWithDefault("port", defaultPortStr).split(",")
        for (let index = 0; index < hosts.length; index++) {
            if (servers.length > 0) {
                servers += ",";
            }            

            let host = hosts[index];
            servers += host;
            
            let port = ports.length > index ? ports[index] : defaultPortStr;
            port = port != "" ? port : defaultPortStr;
            if (port != "") {
                servers += ":" + port;
            }
        }
        builder += servers;

        let path = options.getAsNullableString("path");
        if (path != null) {
            builder += "/" + path;
        }

        let params = "";
        let reservedKeys = ["protocol", "host", "port", "username", "password", "servers", "path"];
        for (let key of options.getKeys()) {
            if (reservedKeys.indexOf(key) >= 0) {
                continue;
            }
            
            if (params.length > 0) {
                params += "&";
            }
            params += querystring.escape(key);

            let value = options.getAsNullableString(key);
            if (value != null && value != "") {
                params += "=" + querystring.escape(value);
            }
        }

        if (params.length > 0) {
            builder += "?" + params;
        }

        return builder.toString();
    }

    /**
     * Includes specified keys from the config parameters.
     * @param options configuration parameters to be processed.
     * @param keys a list of keys to be included.
     * @returns a processed config parameters.
     */
    public static include(options: ConfigParams, ...keys: string[]): ConfigParams {
        if (keys == null || keys.length == 0) return options;

        let result = new ConfigParams();

        for (let key of options.getKeys()) {
            if (keys.indexOf(key) >= 0) {
                result.setAsObject(key, options.getAsString(key));
            }
        }

        return result;
    }

    /**
     * Excludes specified keys from the config parameters.
     * @param options configuration parameters to be processed.
     * @param keys a list of keys to be excluded.
     * @returns a processed config parameters.
     */
     public static exclude(options: ConfigParams, ...keys: string[]): ConfigParams {
        if (keys == null || keys.length == 0) return options;

        let result = options.clone();

        for (let key of keys) {
            result.remove(key);
        }

        return result;
    }

}