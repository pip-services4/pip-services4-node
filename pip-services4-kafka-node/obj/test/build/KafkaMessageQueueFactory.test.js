"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const KafkaMessageQueueFactory_1 = require("../../src/build/KafkaMessageQueueFactory");
suite('KafkaMessageQueueFactory', () => {
    test('CreateMessageQueue', () => {
        let factory = new KafkaMessageQueueFactory_1.KafkaMessageQueueFactory();
        let descriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "kafka", "test", "1.0");
        let canResult = factory.canCreate(descriptor);
        assert.isNotNull(canResult);
        let queue = factory.create(descriptor);
        assert.isNotNull(queue);
        assert.equal("test", queue.getName());
    });
});
//# sourceMappingURL=KafkaMessageQueueFactory.test.js.map