/** @module clients */
/** @hidden */
const fs = require('fs');

import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { CompositeTracer } from 'pip-services4-components-node';
import { InstrumentTiming } from 'pip-services4-rpc-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { HttpConnectionResolver } from 'pip-services4-rpc-node';

/**
 * Abstract client that calls remove endpoints using GRPC protocol.
 * 
 * ### Configuration parameters ###
 * 
 * - connection(s):           
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.htmls IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 * 
 * ### References ###
 * 
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 * 
 * @see [[GrpcService]]
 * @see [[CommandableGrpcService]]
 * 
 * ### Example ###
 * 
 *     class MyGrpcClient extends GrpcClient implements IMyClient {
 *        ...
 * 
 *        public getData(context: IContext, id: string, 
 *            callback: (err: any, result: MyData) => void): void {
 *        
 *            let timing = this.instrument(context, 'myclient.get_data');
 *            this.call("get_data", context, { id: id }, (err, result) => {
 *                timing.endTiming();
 *                callback(err, result);
 *            });        
 *        }
 *        ...
 *     }
 * 
 *     let client = new MyGrpcClient();
 *     client.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
 *     ));
 * 
 *     client.getData("123", "1", (err, result) => {
 *       ...
 *     });
 */
export abstract class GrpcClient implements IOpenable, IConfigurable, IReferenceable {

    private static readonly _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "http",
        "connection.host", "0.0.0.0",
        "connection.port", 3000,

        "options.request_max_size", 1024*1024,
        "options.connect_timeout", 10000,
        "options.timeout", 10000,
        "options.retries", 3,
        "options.debug", true
    );

    private _clientType: any;
    private _protoPath: string;
    private _clientName: string;
    private _packageOptions: any;

    /**
     * The GRPC client.
     */
    protected _client: any;
    /**
     * The connection resolver.
     */
    protected _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();
    /** 
     * The logger.
     */
    protected _logger: CompositeLogger = new CompositeLogger();
    /** 
     * The performance counters.
     */
    protected _counters: CompositeCounters = new CompositeCounters();
    /**
     * The tracer.
     */
    protected _tracer: CompositeTracer = new CompositeTracer();
     /**
     * The configuration options.
     */
    protected _options: ConfigParams = new ConfigParams();
    /**
     * The connection timeout in milliseconds.
     */
    protected _connectTimeout: number = 10000;
    /**
     * The invocation timeout in milliseconds.
     */
    protected _timeout: number = 10000;
    /**
     * The remote service uri which is calculated on open.
     */
	protected _uri: string;

    public constructor(clientTypeOrPath: any, clientName?: string, packageOptions?: any) {
        this._clientType = (typeof clientTypeOrPath !== "string") ? clientTypeOrPath : null;
        this._protoPath = (typeof clientTypeOrPath === "string") ? clientTypeOrPath : null;
        this._clientName = clientName;
        this._packageOptions = packageOptions;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
	public configure(config: ConfigParams): void {
		config = config.setDefaults(GrpcClient._defaultConfig);
		this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));

        this._connectTimeout = config.getAsIntegerWithDefault("options.connect_timeout", this._connectTimeout);
        this._timeout = config.getAsIntegerWithDefault("options.timeout", this._timeout);
	}
        
    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
	public setReferences(references: IReferences): void {
		this._logger.setReferences(references);
		this._counters.setReferences(references);
        this._tracer.setReferences(references);
		this._connectionResolver.setReferences(references);
	}

    /**
     * Adds instrumentation to log calls and measure call time.
     * It returns a CounterTiming object that is used to end the time measurement.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param name              a method name.
     * @returns CounterTiming object to end the time measurement.
     */
	protected instrument(context: IContext, name: string): InstrumentTiming {
        this._logger.trace(context, "Executing %s method", name);
        this._counters.incrementOne(name + ".call_time");

		let counterTiming = this._counters.beginTiming(name + ".call_time");
        let traceTiming = this._tracer.beginTrace(context, name, null);
        return new InstrumentTiming(context, name, "exec",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    // /**
    //  * Adds instrumentation to error handling.
    //  * 
    //  * @param context     (optional) transaction id to trace execution through call chain.
    //  * @param name              a method name.
    //  * @param err               an occured error
    //  * @param result            (optional) an execution result
    //  * @param callback          (optional) an execution callback
    //  */
    // protected instrumentError(context: IContext, name: string, err: any,
    //     result: any = null, callback: (err: any, result: any) => void = null): void {
    //     if (err != null) {
    //         this._logger.error(context, err, "Failed to call %s method", name);
    //         this._counters.incrementOne(name + '.call_errors');    
    //     }

    //     if (callback) callback(err, result);
    // }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
	public isOpen(): boolean {
		return this._client != null;
	}
    
    /**
	 * Opens the component.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
	public async open(context: IContext): Promise<void> {
        if (this.isOpen()) {
            return;
        }
    	
		let connection = await this._connectionResolver.resolve(context);

        this._uri = connection.getAsString("uri");

        try {
            let options: any = {};

            if (connection.getAsStringWithDefault("protocol", 'http') == 'https') {
                let sslKeyFile = connection.getAsNullableString('ssl_key_file');
                let privateKey = fs.readFileSync(sslKeyFile).toString();
    
                let sslCrtFile = connection.getAsNullableString('ssl_crt_file');
                let certificate = fs.readFileSync(sslCrtFile).toString();
    
                let ca = [];
                let sslCaFile = connection.getAsNullableString('ssl_ca_file');
                if (sslCaFile != null) {
                    let caText = fs.readFileSync(sslCaFile).toString();
                    while (caText != null && caText.trim().length > 0) {
                        let crtIndex = caText.lastIndexOf('-----BEGIN CERTIFICATE-----');
                        if (crtIndex > -1) {
                            ca.push(caText.substring(crtIndex));
                            caText = caText.substring(0, crtIndex);
                        }
                    }
                }
    
                options.kvpair = {
                    'private_key': privateKey,
                    'cert_chain': certificate
                };
                options.key = privateKey;
                options.cert = certificate;
                options.ca = ca;
            }
        
            // Create instance of express application   
            let grpc = require('@grpc/grpc-js'); 
            
            let credentials = connection.getAsStringWithDefault("protocol", 'http') == 'https' 
                ? grpc.credentials.createSsl(options.ca, options.key, options.cert)
                : grpc.credentials.createInsecure();

            let clientType = this._clientType;

            // Dynamically load client type
            if (clientType == null) {
                let protoLoader = require('@grpc/proto-loader');
    
                let options = this._packageOptions || {
                    keepCase: true,
                    longs: Number,
                    enums:  Number,
                    defaults: true,
                    oneofs: true
                };
    
                let packageDefinition = protoLoader.loadSync(this._protoPath, options);
                let packageObject = grpc.loadPackageDefinition(packageDefinition);
                clientType = this.getClientByName(packageObject, this._clientName);            
            } 
            // Statically load client type
            else {
                clientType = this.getClientByName(this._clientType, this._clientName);
            }
        
            this._client = new clientType(connection.getAsString("host") + ':' + connection.getAsInteger("port"), credentials);
        } catch (ex) {
            this._client = null;
            throw new ConnectionException(
                context,
                "CANNOT_CONNECT",
                "Opening GRPC client failed"
            ).wrap(ex).withDetails("url", this._uri);
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param context 	(optional) execution context to trace execution through call chain.
     */
    public async close(context: IContext): Promise<void> {
        if (this._client != null) {
            // Eat exceptions
            try {
                this._logger.debug(context, "Closed GRPC service at %s", this._uri);
            } catch (ex) {
                this._logger.warn(context, "Failed while closing GRPC service: %s", ex);
            }

            this._client = null;
            this._uri = null;
        }
    }

    private getClientByName(packageObject: any, clientName: string): any {
        if (packageObject == null || clientName == null) {
            return packageObject;
        }

        let names = clientName.split(".");
        for (let name of names) {
            packageObject = packageObject[name];
            if (packageObject == null) break;
        }

        return packageObject;
    }

    /**
     * Calls a remote method via GRPC protocol.
     * 
     * @param method            a method name to called
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param request           (optional) request object.
     * @returns the received result.
     */
    protected call<T>(method: string, context?: string, request: any = {}): Promise<T> {
        method = method.toLowerCase();

        return new Promise<any>((resolve, reject) => {
            this._client[method](request, (err, response) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(response);
            });    
        });
    }
}