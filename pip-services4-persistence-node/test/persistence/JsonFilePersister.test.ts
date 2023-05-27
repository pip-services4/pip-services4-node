const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-components-node';
import { ConfigException } from 'pip-services4-components-node';

import { JsonFilePersister } from '../../src/persistence/JsonFilePersister';
import { Dummy } from '../sample/Dummy';

suite('JsonFilePersister', ()=> {
    let _persister: JsonFilePersister<Dummy>;

    setup(() => {
        _persister = new JsonFilePersister<Dummy>();
    });

    test('Configure With No Path Key', () => {
        try {
            _persister.configure(new ConfigParams());
        } catch(ex) {
            assert.isNotNull(ex);
            assert.isTrue(ex instanceof ConfigException);
        }
    });

    test('Configure If Path Key Check Property', () => {
        let fileName: string = "../JsonFilePersisterTest";
        _persister.configure(ConfigParams.fromTuples("path", fileName));
        assert.equal(fileName, _persister.path);
    });

});