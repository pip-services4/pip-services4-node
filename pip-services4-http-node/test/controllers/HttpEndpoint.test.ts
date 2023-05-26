const assert = require('chai').assert;
const restify = require('restify-clients');

import { Descriptor } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';

import { HttpEndpoint } from '../../src/controllers/HttpEndpoint';
import { Dummy } from '../sample/Dummy';
import { DummyService } from '../sample/DummyService';
import { DummyRestController } from './DummyRestController';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('HttpEndpoint', ()=> {
    let _dummy1: Dummy;
    let _dummy2: Dummy;

    let endpoint: HttpEndpoint;
    let controller: DummyRestController;

    let rest: any;

    suiteSetup(async () => {
        let service = new DummyService();

        controller = new DummyRestController();
        controller.configure(ConfigParams.fromTuples(
            'base_route', '/api/v1'
        ));

        endpoint = new HttpEndpoint();
        endpoint.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller,
            new Descriptor('pip-services', 'endpoint', 'http', 'default', '1.0'), endpoint
        );
        controller.setReferences(references);

        await endpoint.open(null);
        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
        await endpoint.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });

        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
    });

    test('CRUD Operations', (done) => {
        rest.get('/api/v1/dummies',
            (err, req, res, dummies) => {
                assert.isNull(err);
                
                assert.isObject(dummies);
                assert.lengthOf(dummies.data, 0);

                done();
            }
        );
    });

});
