/** @module queues */
import { IdGenerator } from 'pip-services4-commons-node';
import { StringConverter } from 'pip-services4-commons-node';
import { DateTimeConverter } from 'pip-services4-commons-node';

/**
 * Allows adding additional information to messages. A correlation id, message id, and a message type 
 * are added to the data being sent/received. Additionally, a MessageEnvelope can reference a lock token.
 * 
 * Side note: a MessageEnvelope's message is stored as a buffer, so strings are converted 
 * using utf8 conversions.
 */
export class MessageEnvelope {
    private _reference: any;

    /**
     * Creates a new MessageEnvelope, which adds a correlation id, message id, and a type to the 
     * data being sent/received.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param messageType       a string value that defines the message's type.
     * @param message           the data being sent/received.
     */
    public constructor(correlationId: string, messageType: string, message: any) {
        this.correlation_id = correlationId;
        this.message_type = messageType;

        if (message instanceof Buffer)
            this.message = message;
        if (typeof message === "string")
            this.setMessageAsString(message);
        else this.setMessageAsObject(message);

        this.message_id = IdGenerator.nextLong();
    }

    /** The unique business transaction id that is used to trace calls across components. */
    public correlation_id: string;
    /** The message's auto-generated ID. */
    public message_id: string;
    /** String value that defines the stored message's type. */
    public message_type: string;
    /** The time at which the message was sent. */
    public sent_time: Date;
    /** The stored message. */
    public message: Buffer;

    /**
     * @returns the lock token that this MessageEnvelope references.
     */
    public getReference(): any {
        return this._reference;
    }

    /**
     * Sets a lock token reference for this MessageEnvelope.
     * 
     * @param value     the lock token to reference.
     */
    public setReference(value: any): void {
        this._reference = value;
    }

    /**
     * @returns the information stored in this message as a UTF-8 encoded string.
     */
    public getMessageAsString(): string {
        return this.message != null ? this.message.toString('utf8') : null
    }

    /**
     * Stores the given string.
     * 
     * @param value     the string to set. Will be converted to 
     *                  a buffer, using UTF-8 encoding.
     */
    public setMessageAsString(value: string): void {
        this.message = Buffer.from(value, 'utf8');
    }

    /**
     * @returns the value that was stored in this message 
     *          as a JSON string.
     * 
     * @see [[setMessageAsJson]]
     */
     public getMessageAs<T>(): T {
        if (this.message == null) return null;
        let temp = this.message.toString();
        return JSON.parse(temp);
    }

    /**
     * Stores the given value as a object.
     * 
     * @param value     the value to convert to JSON and store in 
     *                  this message.
     * 
     * @see [[getMessageAsJson]]
     */
    public setMessageAsObject(value: any): void {
        if (value == null) {
            this.message = null;
        } else {
            let temp = JSON.stringify(value);
            this.message = Buffer.from(temp, 'utf8');
        }
    }

    /**
     * Convert's this MessageEnvelope to a string, using the following format:
     * 
     * <code>"[<correlation_id>,<message_type>,<message.toString>]"</code>.
     * 
     * If any of the values are <code>null</code>, they will be replaced with <code>---</code>.
     * 
     * @returns the generated string.
     */
    public toString(): string {
        let builder = '[';
        builder += this.correlation_id || "---";
        builder += ',';
        builder += this.message_type || "---";
        builder += ',';
        builder += this.message ? this.message.toString('utf8', 0, 50) : "---";
        builder += ']';
        return builder;
    }

    /**
     * Converts this MessageEnvelop to a JSON string.
     * The message payload is passed as base64 string
     * @returns A JSON encoded representation is this object.
     */
    public toJSON(): any {
        let payload = this.message != null ? this.message.toString('base64') : null;
        let json = {
            message_id: this.message_id,
            correlation_id: this.correlation_id,
            message_type: this.message_type,
            sent_time: StringConverter.toString(this.sent_time || new Date()),
            message: payload
        };
        return json;
    }

    /**
     * Converts a JSON string into a MessageEnvelop
     * The message payload is passed as base64 string
     * @param value a JSON encoded string
     * @returns a decoded Message Envelop.
     */
    public static fromJSON(value: string): MessageEnvelope {
        if (value == null) return null;

        let json = JSON.parse(value);
        if (json == null) return null;

        let message = new MessageEnvelope(json.correlation_id, json.message_type, null);
        message.message_id = json.message_id;
        message.message = json.message != null ? Buffer.from(json.message, 'base64') : null;
        message.sent_time = DateTimeConverter.toNullableDateTime(json.sent_time);

        return message;
    }

}