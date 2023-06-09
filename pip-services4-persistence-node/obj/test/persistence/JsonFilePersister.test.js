"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const JsonFilePersister_1 = require("../../src/persistence/JsonFilePersister");
suite('JsonFilePersister', () => {
    let _persister;
    setup(() => {
        _persister = new JsonFilePersister_1.JsonFilePersister();
    });
    test('Configure With No Path Key', () => {
        try {
            _persister.configure(new pip_services4_components_node_1.ConfigParams());
        }
        catch (ex) {
            assert.isNotNull(ex);
            assert.isTrue(ex instanceof pip_services4_commons_node_1.ConfigException);
        }
    });
    test('Configure If Path Key Check Property', () => {
        let fileName = "../JsonFilePersisterTest";
        _persister.configure(pip_services4_components_node_1.ConfigParams.fromTuples("path", fileName));
        assert.equal(fileName, _persister.path);
    });
});
//# sourceMappingURL=JsonFilePersister.test.js.map