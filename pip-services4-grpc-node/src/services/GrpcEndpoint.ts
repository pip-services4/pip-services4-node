/** @module services */
/** @hidden */
const fs = require('fs');

import { IOpenable } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { CompositeLogger } from 'pip-services4-components-node';
import { CompositeCounters } from 'pip-services4-components-node';
import { ErrorDescriptionFactory } from 'pip-services4-commons-node';
import { ConnectionException } from 'pip-services4-commons-node';
import { InvocationException } from 'pip-services4-commons-node';
import { HttpConnectionResolver } from 'pip-services4-rpc-node';
import { Schema } from 'pip-services4-commons-node';

import { IRegisterable } from './IRegisterable';

/**
 * Used for creating GRPC endpoints. An endpoint is a URL, at which a given service can be accessed by a client. 
 * 
 * ### Configuration parameters ###
 * 
 * Parameters to pass to the [[configure]] method for component configuration:
 * 
 * - connection(s) - the connection resolver's connections:
 *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
 *     - "connection.protocol" - the connection's protocol;
 *     - "connection.host" - the target host;
 *     - "connection.port" - the target port;
 *     - "connection.uri" - the target URI.
 * - credential - the HTTPS credentials:
 *     - "credential.ssl_key_file" - the SSL private key in PEM
 *     - "credential.ssl_crt_file" - the SSL certificate in PEM
 *     - "credential.ssl_ca_file" - the certificate authorities (root cerfiticates) in PEM
 * 
 * ### References ###
 * 
 * A logger, counters, and a connection resolver can be referenced by passing the 
 * following references to the object's [[setReferences]] method:
 * 
 * - logger: <code>"\*:logger:\*:\*:1.0"</code>;
 * - counters: <code>"\*:counters:\*:\*:1.0"</code>;
 * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver).
 * 
 * ### Examples ###
 * 
 *     public MyMethod(_config: ConfigParams, _references: IReferences) {
 *         let endpoint = new HttpEndpoint();
 *         if (this._config)
 *             endpoint.configure(this._config);
 *         if (this._references)
 *             endpoint.setReferences(this._references);
 *         ...
 * 
 *         await this._endpoint.open(correlationId);
 *     }
 */
export class GrpcEndpoint implements IOpenable, IConfigurable, IReferenceable {

    private static readonly _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        "connection.protocol", "http",
        "connection.host", "0.0.0.0",
        "connection.port", 3000,

        "credential.ssl_key_file", null,
        "credential.ssl_crt_file", null,
        "credential.ssl_ca_file", null,

        "options.maintenance_enabled", false,
        "options.request_max_size", 1024*1024,
        "options.file_max_size", 200*1024*1024,
        "options.connect_timeout", 60000,
        "options.debug", true
    );

	private _server: any;
	private _connectionResolver: HttpConnectionResolver = new HttpConnectionResolver();
	private _logger: CompositeLogger = new CompositeLogger();
	private _counters: CompositeCounters = new CompositeCounters();
    private _maintenanceEnabled: boolean = false;
    private _fileMaxSize: number = 200 * 1024 * 1024;
    private _uri: string;
    private _registrations: IRegisterable[] = [];
    private _commandableMethods: any;
    private _commandableSchemas: any;
    private _commandableService: any;
    
    /**
     * Configures this HttpEndpoint using the given configuration parameters.
     * 
     * __Configuration parameters:__
     * - __connection(s)__ - the connection resolver's connections;
     *     - "connection.discovery_key" - the key to use for connection resolving in a discovery service;
     *     - "connection.protocol" - the connection's protocol;
     *     - "connection.host" - the target host;
     *     - "connection.port" - the target port;
     *     - "connection.uri" - the target URI.
     *     - "credential.ssl_key_file" - SSL private key in PEM
     *     - "credential.ssl_crt_file" - SSL certificate in PEM
     *     - "credential.ssl_ca_file" - Certificate authority (root certificate) in PEM
     * 
     * @param config    configuration parameters, containing a "connection(s)" section.
     * 
     * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/config.configparams.html ConfigParams]] (in the PipServices "Commons" package)
     */
	public configure(config: ConfigParams): void {
		config = config.setDefaults(GrpcEndpoint._defaultConfig);
		this._connectionResolver.configure(config);

        this._maintenanceEnabled = config.getAsBooleanWithDefault('options.maintenance_enabled', this._maintenanceEnabled);
        this._fileMaxSize = config.getAsLongWithDefault('options.file_max_size', this._fileMaxSize)
    }
        
    /**
     * Sets references to this endpoint's logger, counters, and connection resolver.
     * 
     * __References:__
     * - logger: <code>"\*:logger:\*:\*:1.0"</code>
     * - counters: <code>"\*:counters:\*:\*:1.0"</code>
     * - discovery: <code>"\*:discovery:\*:\*:1.0"</code> (for the connection resolver)
     * 
     * @param references    an IReferences object, containing references to a logger, counters, 
     *                      and a connection resolver.
     * 
     * @see [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferences.html IReferences]] (in the PipServices "Commons" package)
     */
	public setReferences(references: IReferences): void {
		this._logger.setReferences(references);
		this._counters.setReferences(references);
		this._connectionResolver.setReferences(references);
	}

    /**
     * @returns whether or not this endpoint is open with an actively listening GRPC server.
     */
	public isOpen(): boolean {
		return this._server != null;
	}
    
    //TODO: check for correct understanding.
    /**
     * Opens a connection using the parameters resolved by the referenced connection
     * resolver and creates a GRPC server (service) using the set options and parameters.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
	public async open(correlationId: string): Promise<void> {
    	if (this.isOpen()) {
            return;
        }
    	
		let connection = await this._connectionResolver.resolve(correlationId);

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
                options.ca = ca;
            }
        
            // Create instance of express application   
            let grpc = require('@grpc/grpc-js'); 
            this._server = new grpc.Server();
            
            let credentials = connection.getAsStringWithDefault("protocol", 'http') == 'https' 
                ? grpc.ServerCredentials.createSsl(options.ca, options.kvpair)
                : grpc.ServerCredentials.createInsecure();

            await new Promise<void>((resolve, reject) => {
                this._server.bindAsync(
                    connection.getAsString("host") + ":" + connection.getAsInteger("port"),
                    credentials,
                    (err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    }
                );
            });

            // Register the service URI
            await this._connectionResolver.register(correlationId);

            this._logger.debug(correlationId, "Opened GRPC service at %s", this._uri);
            
            // Start operations
            this.performRegistrations();
            this._server.start();
        } catch (ex) {
            this._server = null;

            throw new ConnectionException(
                correlationId,
                "CANNOT_CONNECT",
                "Opening GRPC service failed"
            ).wrap(ex).withDetails("url", this._uri);
        }
    }

    /**
     * Closes this endpoint and the GRPC server (service) that was opened earlier.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    public async close(correlationId: string): Promise<void> {
        if (this._server != null) {
            this._uri = null;
            this._commandableMethods = null;
            this._commandableSchemas = null;
            this._commandableService = null;

            // Eat exceptions
            try {
                await new Promise<void>((resolve, reject) => {
                    this._server.tryShutdown((err) => {
                        if (err != null) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });

                this._logger.debug(correlationId, "Closed GRPC service at %s", this._uri);

                this._server = null;
            } catch (ex) {
                this._logger.warn(correlationId, "Failed while closing GRPC service: %s", ex);
                throw ex;
            }
        }
    }

    /**
     * Registers a registerable object for dynamic endpoint discovery.
     * 
     * @param registration      the registration to add. 
     * 
     * @see [[IRegisterable]]
     */
    public register(registration: IRegisterable): void {
        this._registrations.push(registration);
    }

    /**
     * Unregisters a registerable object, so that it is no longer used in dynamic 
     * endpoint discovery.
     * 
     * @param registration      the registration to remove. 
     * 
     * @see [[IRegisterable]]
     */
    public unregister(registration: IRegisterable): void {
        this._registrations = this._registrations.filter(r => r != registration);
    }

    private performRegistrations(): void {
        for (let registration of this._registrations) {
            registration.register();
        }

        this.registerCommandableService();
    }

    private registerCommandableService() {
        if (this._commandableMethods == null)  return;

        let grpc = require('@grpc/grpc-js');
        let protoLoader = require('@grpc/proto-loader');

        let options = {
            keepCase: true,
            // longs: String,
            // enums: String,
            defaults: true,
            oneofs: true
        };

        let packageDefinition = protoLoader.loadSync(__dirname + "../../../../src/protos/commandable.proto", options);
        let packageObject = grpc.loadPackageDefinition(packageDefinition);
        let service = packageObject.commandable.Commandable.service;     

        this.registerService(
            service, 
            { 
                invoke: (call, callback) => { 
                    this.invokeCommandableMethod(call)
                    .then((result) => {
                        callback(null, result);
                    })
                    .catch((err) => {
                        callback(err, null);
                    }); 
                } 
            }
        );
    }

    private async invokeCommandableMethod(call: any): Promise<any> {
        let method = call.request.method;
        let action = this._commandableMethods ? this._commandableMethods[method] : null;
        let correlationId = call.request.correlation_id;

        // Handle method not found
        if (action == null) {
            let err = new InvocationException(
                correlationId,
                "METHOD_NOT_FOUND",
                "Method " + method + " was not found"
            ).withDetails("method", method);
            
            let response = { 
                error: ErrorDescriptionFactory.create(err),
                result_empty: true,
                result_json: null 
            };

            return response;
        }

        return await action(call);
    }

    /**
     * Registers a service with related implementation
     * 
     * @param service        a GRPC service object.
     * @param implementation the service implementation methods.
     */
    public registerService(service: any, implementation: any): void {
        this._server.addService(service, implementation);
    }

    /**
     * Registers a commandable method in this objects GRPC server (service) by the given name.,
     * 
     * @param method        the GRPC method name.
     * @param schema        the schema to use for parameter validation.
     * @param action        the action to perform at the given route.
     */
    public registerCommadableMethod(method: string, schema: Schema,
        action: (call: any) => Promise<any>): void {

        this._commandableMethods = this._commandableMethods || {};
        this._commandableMethods[method] = action;

        this._commandableSchemas = this._commandableSchemas || {};
        this._commandableSchemas[method] = schema;
    }

}