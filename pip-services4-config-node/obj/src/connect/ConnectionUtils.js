"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionUtils = void 0;
/** @module connect */
/** @hidden */
const querystring = require("querystring");
const pip_services4_components_node_1 = require("pip-services4-components-node");
/**
 * A set of utility functions to process connection parameters
 */
class ConnectionUtils {
    /**
     * Concatinates two options by combining duplicated properties into comma-separated list
     * @param options1 first options to merge
     * @param options2 second options to merge
     * @param keys when define it limits only to specific keys
     */
    static concat(options1, options2, ...keys) {
        const options = pip_services4_components_node_1.ConfigParams.fromValue(options1);
        for (const key of options2.getKeys()) {
            const value1 = options1.getAsString(key) || "";
            const value2 = options2.getAsString(key) || "";
            if (value1 != "" && value2 != "") {
                if (keys == null || keys.length == 0 || keys.indexOf(key) >= 0) {
                    options.setAsObject(key, value1 + "," + value2);
                }
            }
            else if (value1 != "") {
                options.setAsObject(key, value1);
            }
            else if (value2 != "") {
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
    static rename(options, fromName, toName) {
        const fromValue = options.getAsObject(fromName);
        if (fromValue == null)
            return options;
        const toValue = options.getAsObject(toName);
        if (toValue != null)
            return options;
        options = pip_services4_components_node_1.ConfigParams.fromValue(options);
        options.setAsObject(toName, fromValue);
        options.remove(fromName);
        return options;
    }
    static concatValues(value1, value2) {
        if (value1 == null || value1 == "")
            return value2;
        if (value2 == null || value2 == "")
            return value1;
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
    static parseUri(uri, defaultProtocol, defaultPort) {
        const options = new pip_services4_components_node_1.ConfigParams();
        if (uri == null || uri == "")
            return options;
        uri = uri.trim();
        // Process parameters
        let pos = uri.indexOf("?");
        if (pos > 0) {
            const params = uri.substring(pos + 1);
            uri = uri.substring(0, pos);
            const paramsList = params.split("&");
            for (const param of paramsList) {
                const pos = param.indexOf("=");
                if (pos >= 0) {
                    const key = querystring.unescape(param.substring(0, pos));
                    const value = querystring.unescape(param.substring(pos + 1));
                    options.setAsObject(key, value);
                }
                else {
                    options.setAsObject(querystring.unescape(param), null);
                }
            }
        }
        // Process protocol
        pos = uri.indexOf("://");
        if (pos > 0) {
            const protocol = uri.substring(0, pos);
            uri = uri.substring(pos + 3);
            options.setAsObject("protocol", protocol);
        }
        else {
            options.setAsObject("protocol", defaultProtocol);
        }
        // Process user and password
        pos = uri.indexOf("@");
        if (pos > 0) {
            const userAndPass = uri.substring(0, pos);
            uri = uri.substring(pos + 1);
            pos = userAndPass.indexOf(":");
            if (pos > 0) {
                options.setAsObject("username", userAndPass.substring(0, pos));
                options.setAsObject("password", userAndPass.substring(pos + 1));
            }
            else {
                options.setAsObject("username", userAndPass);
            }
        }
        pos = uri.indexOf("/");
        if (pos > 0) {
            const path = uri.substring(pos + 1);
            uri = uri.substring(0, pos);
            options.setAsObject("path", path);
        }
        // Process host and ports
        // options.setAsObject("servers", this.concatValues(options.getAsString("servers"), uri));
        const servers = uri.split(",");
        for (const server of servers) {
            pos = server.indexOf(":");
            if (pos > 0) {
                options.setAsObject("servers", this.concatValues(options.getAsString("servers"), server));
                options.setAsObject("host", this.concatValues(options.getAsString("host"), server.substring(0, pos)));
                options.setAsObject("port", this.concatValues(options.getAsString("port"), server.substring(pos + 1)));
            }
            else {
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
    static composeUri(options, defaultProtocol, defaultPort) {
        let builder = "";
        const protocol = options.getAsStringWithDefault("protocol", defaultProtocol);
        if (protocol != null) {
            builder = protocol + "://" + builder;
        }
        const username = options.getAsNullableString("username");
        if (username != null) {
            builder += username;
            const password = options.getAsNullableString("password");
            if (password != null) {
                builder += ":" + password;
            }
            builder += "@";
        }
        let servers = "";
        const defaultPortStr = defaultPort > 0 ? defaultPort.toString() : "";
        const hosts = options.getAsStringWithDefault("host", "???").split(",");
        const ports = options.getAsStringWithDefault("port", defaultPortStr).split(",");
        for (let index = 0; index < hosts.length; index++) {
            if (servers.length > 0) {
                servers += ",";
            }
            const host = hosts[index];
            servers += host;
            let port = ports.length > index ? ports[index] : defaultPortStr;
            port = port != "" ? port : defaultPortStr;
            if (port != "") {
                servers += ":" + port;
            }
        }
        builder += servers;
        const path = options.getAsNullableString("path");
        if (path != null) {
            builder += "/" + path;
        }
        let params = "";
        const reservedKeys = ["protocol", "host", "port", "username", "password", "servers", "path"];
        for (const key of options.getKeys()) {
            if (reservedKeys.indexOf(key) >= 0) {
                continue;
            }
            if (params.length > 0) {
                params += "&";
            }
            params += querystring.escape(key);
            const value = options.getAsNullableString(key);
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
    static include(options, ...keys) {
        if (keys == null || keys.length == 0)
            return options;
        const result = new pip_services4_components_node_1.ConfigParams();
        for (const key of options.getKeys()) {
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
    static exclude(options, ...keys) {
        if (keys == null || keys.length == 0)
            return options;
        const result = options.clone();
        for (const key of keys) {
            result.remove(key);
        }
        return result;
    }
}
exports.ConnectionUtils = ConnectionUtils;
//# sourceMappingURL=ConnectionUtils.js.map