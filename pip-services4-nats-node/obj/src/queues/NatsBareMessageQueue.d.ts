/** @module queues */
import { IMessageReceiver } from 'pip-services4-messaging-node';
import { MessageEnvelope } from 'pip-services4-messaging-node';
import { NatsAbstractMessageQueue } from './NatsAbstractMessageQueue';
/**
 * Message queue that sends and receives messages via NATS message broker.
 *
 * ### Configuration parameters ###
 *
 * - subject:                       name of NATS topic (subject) to subscribe
 * - queue_group:                   name of NATS queue group
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                        host name or IP address
 *   - port:                        port number
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 * - options:
 *   - serialize_message:    (optional) true to serialize entire message as JSON, false to send only message payload (default: true)
 *   - retry_connect:        (optional) turns on/off automated reconnect when connection is log (default: true)
 *   - max_reconnect:        (optional) maximum reconnection attempts (default: 3)
 *   - reconnect_timeout:    (optional) number of milliseconds to wait on each reconnection attempt (default: 3000)
 *   - flush_timeout:        (optional) number of milliseconds to wait on flushing messages (default: 3000)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>             (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 * - <code>\*:connection:nats:\*:1.0</code>       (optional) Shared connection to NATS service
 *
 * @see [[MessageQueue]]
 * @see [[MessagingCapabilities]]
 *
 * ### Example ###
 *
 *     let queue = new NatsBareMessageQueue("myqueue");
 *     queue.configure(ConfigParams.fromTuples(
 *       "topic", "mytopic",
 *       "connection.protocol", "nats"
 *       "connection.host", "localhost"
 *       "connection.port", 1883
 *     ));
 *
 *     queue.open("123", (err) => {
 *         ...
 *     });
 *
 *     queue.send("123", new MessageEnvelope(null, "mymessage", "ABC"));
 *
 *     queue.receive("123", (err, message) => {
 *         if (message != null) {
 *            ...
 *            queue.complete("123", message);
 *         }
 *     });
 */
export declare class NatsBareMessageQueue extends NatsAbstractMessageQueue {
    private _subscription;
    /**
     * Creates a new instance of the message queue.
     *
     * @param name  (optional) a queue name.
     */
    constructor(name?: string);
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @returns a peeked message.
     */
    peek(context: IContext): Promise<MessageEnvelope>;
    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     *
     * Important: This method is not supported by NATS.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns a list with peeked messages.
     */
    peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]>;
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns a received message or <code>null</code> if no message was received.
     */
    receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope>;
    private receiveMessage;
    /**
     * Listens for incoming messages and blocks the current thread until queue is closed.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     *
     * @see [[IMessageReceiver]]
     * @see [[receive]]
     */
    listen(context: IContext, receiver: IMessageReceiver): void;
    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     */
    endListen(context: IContext): void;
}
