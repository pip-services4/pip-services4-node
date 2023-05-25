/** @module services */
import { ContextInfo } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { StringConverter } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';

import { RestService } from './RestService';

/**
 * Service that returns microservice status information via HTTP/REST protocol.
 * 
 * The service responds on /status route (can be changed) with a JSON object:
 * {
 *     - "id":            unique container id (usually hostname)
 *     - "name":          container name (from ContextInfo)
 *     - "description":   container description (from ContextInfo)
 *     - "start_time":    time when container was started
 *     - "current_time":  current time in UTC
 *     - "uptime":        duration since container start time in milliseconds
 *     - "properties":    additional container properties (from ContextInfo)
 *     - "components":    descriptors of components registered in the container
 * }
 * 
 * ### Configuration parameters ###
 * 
 * - base_route:              base route for remote URI
 * - route:                   status route (default: "status")
 * - dependencies:
 *   - endpoint:              override for HTTP Endpoint dependency
 *   - controller:            override for Controller dependency
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>               (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>            (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * - <code>\*:endpoint:http:\*:1.0</code>          (optional) [[HttpEndpoint]] reference
 * 
 * @see [[RestService]]
 * @see [[RestClient]]
 * 
 * ### Example ###
 * 
 *     let service = new StatusService();
 *     service.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     await service.open("123");
 *     console.log("The Status service is accessible at http://+:8080/status");
 */
export class StatusRestService extends RestService {
    private _startTime: Date = new Date();
    private _references2: IReferences;
    private _contextInfo: ContextInfo;
    private _route: string = "status";

    /**
     * Creates a new instance of this service.
     */
    public constructor() {
        super();
        this._dependencyResolver.put("context-info", new Descriptor("pip-services", "context-info", "default", "*", "1.0"));
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);

        this._route = config.getAsStringWithDefault("route", this._route);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._references2 = references;
        super.setReferences(references);

        this._contextInfo = this._dependencyResolver.getOneOptional<ContextInfo>("context-info");
    }

    /**
     * Registers all service routes in HTTP endpoint.
     */
    public register(): void {
        this.registerRoute("get", this._route, null, this.status);
    }

    /**
     * Handles status requests
     * 
     * @param req   an HTTP request
     * @param res   an HTTP response
     */
    private status(req, res): void {
        let id = this._contextInfo != null ? this._contextInfo.contextId : "";
        let name = this._contextInfo != null ? this._contextInfo.name : "Unknown";
        let description = this._contextInfo != null ? this._contextInfo.description : "";
        let uptime = new Date().getTime() - this._startTime.getTime();
        let properties = this._contextInfo != null ? this._contextInfo.properties : "";

        let components = [];
        if (this._references2 != null) {
            for (let locator of this._references2.getAllLocators()) {
                components.push(locator.toString());
            }
        }

        let status =  {
            id: id,
            name: name,
            description: description,
            start_time: StringConverter.toString(this._startTime),
            current_time: StringConverter.toString(new Date()),
            uptime: uptime,
            properties: properties,
            components: components
        };

        this.sendResult(req, res, status);
    }
}