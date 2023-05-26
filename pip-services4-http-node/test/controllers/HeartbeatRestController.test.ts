const assert = require('chai').assert;
const restify = require('restify-clients');

import { ConfigParams } from 'pip-services4-components-node';

import { HeartbeatRestController } from '../../src/controllers/HeartbeatRestController';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('HeartbeatRestController', ()=> {
    let controller: HeartbeatRestController;
    let rest: any;

    suiteSetup(async () => {
        controller = new HeartbeatRestController();
        controller.configure(restConfig);
        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    test('Status', async () => {
        let result = await new Promise((resolve, reject) => {
            rest.get('/heartbeat', (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isNotNull(result);
    });

});
