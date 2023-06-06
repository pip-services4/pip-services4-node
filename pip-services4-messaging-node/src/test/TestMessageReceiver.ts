/** @module test */
import { IMessageReceiver } from '../queues/IMessageReceiver';
import { IMessageQueue } from '../queues/IMessageQueue';
import { MessageEnvelope } from '../queues/MessageEnvelope';
import { ICleanable, IContext } from 'pip-services4-components-node';

export class TestMessageReceiver implements IMessageReceiver, ICleanable {
    private _messages: MessageEnvelope[] = [];

    constructor() {
        //
    }

    /**
     * Gets the list of received messages.
     */
    public get messages(): MessageEnvelope[] {
        return this._messages;
    }

    /**
     * Gets the received message count.
     */
    public get messageCount(): number {
        return this._messages.length;
    }

    /**
     * Receives incoming message from the queue.
     * 
     * @param envelope  an incoming message
     * @param queue     a queue where the message comes from
     * 
     * @see [[MessageEnvelope]]
     * @see [[IMessageQueue]]
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async receiveMessage(envelope: MessageEnvelope, queue: IMessageQueue): Promise<void> {
        this._messages.push(envelope);
    }

    /**
     * Clears all received messagers.
     * @param context     (optional) a context to trace execution through call chain.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async clear(context: IContext): Promise<void> {
        this._messages = [];
    }
}