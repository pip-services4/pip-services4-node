"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_components_node_3 = require("pip-services4-components-node");
const pip_services3_components_node_4 = require("pip-services4-components-node");
const MessagingCapabilities_1 = require("./MessagingCapabilities");
const MessageEnvelope_1 = require("./MessageEnvelope");
/**
 * Abstract message queue that is used as a basis for specific message queue implementations.
 *
 * ### Configuration parameters ###
 *
 * - name:                        name of the message queue
 * - connection(s):
 *   - discovery_key:             key to retrieve parameters from discovery service
 *   - protocol:                  connection protocol like http, https, tcp, udp
 *   - host:                      host name or IP address
 *   - port:                      port number
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 key to retrieve parameters from credential store
 *   - username:                  user name
 *   - password:                  user password
 *   - access_id:                 application access id
 *   - access_key:                application secret key
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] components to discover connection(s)
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]] componetns to lookup credential(s)
 */
class MessageQueue {
    /**
     * Creates a new instance of the message queue.
     *
     * @param name  (optional) a queue name
     * @param capabilities (optional) a capabilities of this message queue
     */
    constructor(name, capabilities) {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_2.CompositeCounters();
        this._connectionResolver = new pip_services3_components_node_3.ConnectionResolver();
        this._credentialResolver = new pip_services3_components_node_4.CredentialResolver();
        this._name = name;
        this._capabilities = capabilities
            || new MessagingCapabilities_1.MessagingCapabilities(false, false, false, false, false, false, false, false, false);
    }
    /**
     * Gets the queue name
     *
     * @returns the queue name.
     */
    getName() { return this._name; }
    /**
     * Gets the queue capabilities
     *
     * @returns the queue's capabilities object.
     */
    getCapabilities() { return this._capabilities; }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._name = pip_services3_commons_node_2.NameResolver.resolve(config, this._name);
        this._logger.configure(config);
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
        this._name = config.getAsStringWithDefault("queue", this._name);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let connections = yield this._connectionResolver.resolveAll(context);
            let credential = yield this._credentialResolver.lookup(context);
            yield this.openWithParams(context, connections, credential);
        });
    }
    /**
     * Opens the component with given connection and credential parameters.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param connection        connection parameters
     * @param credential        credential parameters
     */
    openWithParams(context, connections, credential) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
    /**
     * Checks if the queue has been opened and throws an exception is it's not.
     * @param context     (optional) transaction id to trace execution through call chain.
     */
    checkOpen(context) {
        if (!this.isOpen()) {
            throw new pip_services3_commons_node_1.InvalidStateException(context, "NOT_OPENED", "The queue is not opened");
        }
    }
    /**
     * Sends an object into the queue.
     * Before sending the object is converted into JSON string and wrapped in a [[MessageEnvelope]].
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param messageType       a message type
     * @param value             an object value to be sent
     *
     * @see [[send]]
     */
    sendAsObject(context, messageType, message) {
        let envelope = new MessageEnvelope_1.MessageEnvelope(context, messageType, message);
        return this.send(context, envelope);
    }
    /**
     * Listens for incoming messages without blocking the current thread.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     *
     * @see [[listen]]
     * @see [[IMessageReceiver]]
     */
    beginListen(context, receiver) {
        setImmediate(() => {
            this.listen(context, receiver);
        });
    }
    /**
     * Gets a string representation of the object.
     *
     * @returns a string representation of the object.
     */
    toString() {
        return "[" + this.getName() + "]";
    }
}
exports.MessageQueue = MessageQueue;
//# sourceMappingURL=MessageQueue.js.map