"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsConnectionParams = void 0;
/** @module connect */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
/**
 * Contains connection parameters to authenticate against Amazon Web Services (AWS)
 * and connect to specific AWS resource.
 *
 * The class is able to compose and parse AWS resource ARNs.
 *
 * ### Configuration parameters ###
 *
 * - access_id:     application access id
 * - client_id:     alternative to access_id
 * - access_key:    application secret key
 * - client_key:    alternative to access_key
 * - secret_key:    alternative to access_key
 *
 * In addition to standard parameters [[https://pip-services4-node.github.io/pip-services4-components-node/classes/auth.credentialparams.html CredentialParams]] may contain any number of custom parameters
 *
 * @see [[AwsConnectionResolver]]
 *
 * ### Example ###
 *
 *     let connection = AwsConnectionParams.fromTuples(
 *         "region", "us-east-1",
 *         "access_id", "XXXXXXXXXXXXXXX",
 *         "secret_key", "XXXXXXXXXXXXXXX",
 *         "service", "s3",
 *         "bucket", "mybucket"
 *     );
 *
 *     let region = connection.getRegion();                     // Result: "us-east-1"
 *     let accessId = connection.getAccessId();                 // Result: "XXXXXXXXXXXXXXX"
 *     let secretKey = connection.getAccessKey();               // Result: "XXXXXXXXXXXXXXX"
 *     let pin = connection.getAsNullableString("bucket");      // Result: "mybucket"
 */
class AwsConnectionParams extends pip_services4_components_node_1.ConfigParams {
    /**
     * Creates an new instance of the connection parameters.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this connection.
     */
    constructor(values = null) {
        super(values);
    }
    /**
     * Gets the AWS partition name.
     *
     * @returns {string} the AWS partition name.
     */
    getPartition() {
        return super.getAsNullableString("partition") || "aws";
    }
    /**
     * Sets the AWS partition name.
     *
     * @param value a new AWS partition name.
     */
    setPartition(value) {
        super.put("partition", value);
    }
    /**
     * Gets the AWS service name.
     *
     * @returns {string} the AWS service name.
     */
    getService() {
        return super.getAsNullableString("service") || super.getAsNullableString("protocol");
    }
    /**
     * Sets the AWS service name.
     *
     * @param value a new AWS service name.
     */
    setService(value) {
        super.put("service", value);
    }
    /**
     * Gets the AWS region.
     *
     * @returns {string} the AWS region.
     */
    getRegion() {
        return super.getAsNullableString("region");
    }
    /**
     * Sets the AWS region.
     *
     * @param value a new AWS region.
     */
    setRegion(value) {
        super.put("region", value);
    }
    /**
     * Gets the AWS account id.
     *
     * @returns {string} the AWS account id.
     */
    getAccount() {
        return super.getAsNullableString("account");
    }
    /**
     * Sets the AWS account id.
     *
     * @param value the AWS account id.
     */
    setAccount(value) {
        super.put("account", value);
    }
    /**
     * Gets the AWS resource type.
     *
     * @returns {string} the AWS resource type.
     */
    getResourceType() {
        return super.getAsNullableString("resource_type");
    }
    /**
     * Sets the AWS resource type.
     *
     * @param value a new AWS resource type.
     */
    setResourceType(value) {
        super.put("resource_type", value);
    }
    /**
     * Gets the AWS resource id.
     *
     * @returns {string} the AWS resource id.
     */
    getResource() {
        return super.getAsNullableString("resource");
    }
    /**
     * Sets the AWS resource id.
     *
     * @param value a new AWS resource id.
     */
    setResource(value) {
        super.put("resource", value);
    }
    /**
     * Gets the AWS resource ARN.
     * If the ARN is not defined it automatically generates it from other properties.
     *
     * @returns {string} the AWS resource ARN.
     */
    getArn() {
        let arn = super.getAsNullableString("arn");
        if (arn)
            return arn;
        arn = "arn";
        const partition = this.getPartition() || "aws";
        arn += ":" + partition;
        const service = this.getService() || "";
        arn += ":" + service;
        const region = this.getRegion() || "";
        arn += ":" + region;
        const account = this.getAccount() || "";
        arn += ":" + account;
        const resourceType = this.getResourceType() || "";
        if (resourceType != "")
            arn += ":" + resourceType;
        const resource = this.getResource() || "";
        arn += ":" + resource;
        return arn;
    }
    /**
     * Sets the AWS resource ARN.
     * When it sets the value, it automatically parses the ARN
     * and sets individual parameters.
     *
     * @param value a new AWS resource ARN.
     */
    setArn(value) {
        super.put("arn", value);
        if (value != null) {
            const tokens = value.split(":");
            this.setPartition(tokens[1]);
            this.setService(tokens[2]);
            this.setRegion(tokens[3]);
            this.setAccount(tokens[4]);
            if (tokens.length > 6) {
                this.setResourceType(tokens[5]);
                this.setResource(tokens[6]);
            }
            else {
                const temp = tokens[5];
                const pos = temp.indexOf("/");
                if (pos > 0) {
                    this.setResourceType(temp.substring(0, pos));
                    this.setResource(temp.substring(pos + 1));
                }
                else {
                    this.setResourceType(null);
                    this.setResource(temp);
                }
            }
        }
    }
    /**
     * Gets the AWS access id.
     *
     * @returns {string} the AWS access id.
     */
    getAccessId() {
        return super.getAsNullableString("access_id") || super.getAsNullableString("client_id");
    }
    /**
     * Sets the AWS access id.
     *
     * @param value the AWS access id.
     */
    setAccessId(value) {
        super.put("access_id", value);
    }
    /**
     * Gets the AWS client key.
     *
     * @returns {string} the AWS client key.
     */
    getAccessKey() {
        return super.getAsNullableString("access_key") || super.getAsNullableString("client_key");
    }
    /**
     * Sets the AWS client key.
     *
     * @param value a new AWS client key.
     */
    setAccessKey(value) {
        super.put("access_key", value);
    }
    /**
     * Creates a new AwsConnectionParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		                a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					                Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns {AwsConnectionParams}	a new AwsConnectionParams object.
     */
    static fromString(line) {
        const map = pip_services4_commons_node_1.StringValueMap.fromString(line);
        return new AwsConnectionParams(map);
    }
    /**
     * Validates this connection parameters
     *
     * @param context     (optional) a context to trace execution through call chain.
     */
    validate(context) {
        const arn = this.getArn();
        if (arn == "arn:aws::::") {
            throw new pip_services4_commons_node_2.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "NO_AWS_CONNECTION", "AWS connection is not set");
        }
        if (this.getAccessId() == null) {
            throw new pip_services4_commons_node_2.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "NO_ACCESS_ID", "No access_id is configured in AWS credential");
        }
        if (this.getAccessKey() == null) {
            throw new pip_services4_commons_node_2.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "NO_ACCESS_KEY", "No access_key is configured in AWS credential");
        }
    }
    /**
     * Retrieves AwsConnectionParams from configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param config 	                configuration parameters
     * @returns {AwsConnectionParams}	the generated AwsConnectionParams object.
     *
     * @see [[mergeConfigs]]
     */
    static fromConfig(config) {
        const result = new AwsConnectionParams();
        const credentials = pip_services4_config_node_1.CredentialParams.manyFromConfig(config);
        for (const credential of credentials)
            result.append(credential);
        const connections = pip_services4_config_node_1.ConnectionParams.manyFromConfig(config);
        for (const connection of connections)
            result.append(connection);
        return result;
    }
    /**
     * Retrieves AwsConnectionParams from multiple configuration parameters.
     * The values are retrieves from "connection" and "credential" sections.
     *
     * @param configs 	                a list with configuration parameters
     * @returns {AwsConnectionParams}	the generated AwsConnectionParams object.
     *
     * @see [[fromConfig]]
     */
    static mergeConfigs(...configs) {
        const config = pip_services4_components_node_1.ConfigParams.mergeConfigs(...configs);
        return new AwsConnectionParams(config);
    }
}
exports.AwsConnectionParams = AwsConnectionParams;
//# sourceMappingURL=AwsConnectionParams.js.map