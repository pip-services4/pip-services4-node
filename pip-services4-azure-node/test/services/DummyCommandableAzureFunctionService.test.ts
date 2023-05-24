const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-commons-node';

import { Dummy } from '../Dummy';
import { DummyCommandableAzureFunction } from './DummyCommandableAzureFunction';

suite('DummyCommandableAzureFunctionService', () => {
    let DUMMY1: Dummy = { id: null, key: "Key 1", content: "Content 1" };
    let DUMMY2: Dummy = { id: null, key: "Key 2", content: "Content 2" };

    let _functionService: DummyCommandableAzureFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'controller.descriptor', 'pip-services-dummies:controller:default:default:1.0',
            'service.descriptor', 'pip-services-dummies:service:commandable-azurefunc:default:1.0'
        );

        _functionService = new DummyCommandableAzureFunction();
        _functionService.configure(config);
        await _functionService.open(null);
    });

    suiteTeardown(async () => {
        await _functionService.close(null);
    });

    test('CRUD Operations', async () => {

        // Create one dummy
        let dummy1 = await _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: DUMMY1
        });
        assert.isObject(dummy1);
        assert.equal(dummy1.content, DUMMY1.content);
        assert.equal(dummy1.key, DUMMY1.key);

        // Create another dummy
        let dummy2 = await _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: DUMMY2
        });
        assert.isObject(dummy2);
        assert.equal(dummy2.content, DUMMY2.content);
        assert.equal(dummy2.key, DUMMY2.key);

        // Update the dummy
        dummy1.content = 'Updated Content 1'
        const updatedDummy1 = await _functionService.act({
            cmd: 'dummies.update_dummy',
            dummy: dummy1
        });
        assert.isObject(updatedDummy1);
        assert.equal(updatedDummy1.id, dummy1.id);
        assert.equal(updatedDummy1.content, dummy1.content);
        assert.equal(updatedDummy1.key, dummy1.key);
        dummy1 = updatedDummy1

        // Delete dummy
        await _functionService.act({
            cmd: 'dummies.delete_dummy',
            dummy_id: dummy1.id
        });

        const dummy = await _functionService.act({
            cmd: 'dummies.get_dummy_by_id',
            dummy_id: dummy1.id
        });
        assert.isNull(dummy || null);

        // Failed validation
        let err = await _functionService.act({
            cmd: 'dummies.create_dummy',
            dummy: null
        });
        
        assert.equal(err.code, 'INVALID_DATA');
    });
});
