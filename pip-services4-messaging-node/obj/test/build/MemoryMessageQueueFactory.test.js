"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const MemoryMessageQueueFactory_1 = require("../../src/build/MemoryMessageQueueFactory");
suite('MemoryMessageQueueFactory', () => {
    test('CreateMessageQueue', () => {
        let factory = new MemoryMessageQueueFactory_1.MemoryMessageQueueFactory();
        let descriptor = new pip_services4_components_node_1.Descriptor("pip-services", "message-queue", "memory", "test", "1.0");
        let canResult = factory.canCreate(descriptor);
        assert.isNotNull(canResult);
        let queue = factory.create(descriptor);
        assert.isNotNull(queue);
        assert.equal("test", queue.getName());
    });
});
//# sourceMappingURL=MemoryMessageQueueFactory.test.js.map