const assert = require('chai').assert;

import { Descriptor } from 'pip-services4-commons-node';

import { RabbitMQMessageQueueFactory } from '../../src/build/RabbitMQMessageQueueFactory';

suite('RabbitMQMessageQueueFactory', ()=> {

    test('CreateMessageQueue', () => {
        let factory = new RabbitMQMessageQueueFactory();
        let descriptor = new Descriptor("pip-services", "message-queue", "rabbitmq", "test", "1.0");
    
        let canResult = factory.canCreate(descriptor);
        assert.isNotNull(canResult);
    
        let queue = factory.create(descriptor);
        assert.isNotNull(queue);
        assert.equal("test", queue.getName());
    });

});