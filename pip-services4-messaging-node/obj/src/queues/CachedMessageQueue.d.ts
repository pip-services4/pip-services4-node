/** @module queues */
import { IMessageReceiver } from './IMessageReceiver';
import { MessageQueue } from './MessageQueue';
import { MessagingCapabilities } from './MessagingCapabilities';
import { MessageEnvelope } from './MessageEnvelope';
import { ICleanable, ConfigParams, IContext } from 'pip-services4-components-node';
/**
 * Message queue that caches received messages in memory to allow peek operations
 * that may not be supported by the undelying queue.
 *
 * This queue is users as a base implementation for other queues
 */
export declare abstract class CachedMessageQueue extends MessageQueue implements ICleanable {
    protected _autoSubscribe: boolean;
    protected _messages: MessageEnvelope[];
    protected _receiver: IMessageReceiver;
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name  (optional) a queue name
     * @param capabilities (optional) a capabilities of this message queue
     */
    constructor(name?: string, capabilities?: MessagingCapabilities);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Opens the component.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    open(context: IContext): Promise<void>;
    /**
     * Closes component and frees used resources.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    close(context: IContext): Promise<void>;
    /**
     * Subscribes to the message broker.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    protected abstract subscribe(context: IContext): Promise<void>;
    /**
     * Unsubscribes from the message broker.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    protected abstract unsubscribe(context: IContext): Promise<void>;
    /**
     * Clears component state.
     *
     * @param context     (optional) execution context to trace execution through call chain.
     */
    clear(context: IContext): Promise<void>;
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @returns       a number of messages in the queue.
     */
    readMessageCount(): Promise<number>;
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns                 a peeked message or <code>null</code>.
     */
    peek(context: IContext): Promise<MessageEnvelope>;
    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     *
     * Important: This method is not supported by MQTT.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @returns                 a list with peeked messages.
     */
    peekBatch(context: IContext, messageCount: number): Promise<MessageEnvelope[]>;
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @returns                 a received message or <code>null</code>.
     */
    receive(context: IContext, waitTimeout: number): Promise<MessageEnvelope>;
    protected sendMessageToReceiver(receiver: IMessageReceiver, message: MessageEnvelope): Promise<void>;
    /**
    * Listens for incoming messages and blocks the current thread until queue is closed.
    *
    * @param context     (optional) a context to trace execution through call chain.
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
     * @param context     (optional) a context to trace execution through call chain.
     */
    endListen(context: IContext): void;
}
