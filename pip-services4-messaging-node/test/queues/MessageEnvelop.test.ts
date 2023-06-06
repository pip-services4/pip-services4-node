const assert = require('chai').assert;

import { Context } from 'pip-services4-components-node';
import { MessageEnvelope } from '../../src/queues/MessageEnvelope';

suite('MessageEnvelop', () => {

    test('From/To JSON', () => {
        let message = new MessageEnvelope(Context.fromTraceId("123"), "Test", "This is a test message");
        let json = JSON.stringify(message);

        let message2 = MessageEnvelope.fromJSON(json);
        assert.equal(message.message_id, message2.message_id);
        assert.equal(message.trace_id, message2.trace_id);
        assert.equal(message.message_type, message2.message_type);
        assert.equal(message.message.toString(), message2.message.toString());
    });

});
