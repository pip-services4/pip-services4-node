const assert = require('chai').assert;
const restify = require('restify-clients');

import { Descriptor } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';
import { ContextInfo } from 'pip-services4-components-node';

import { StatusRestController } from '../../src/controllers/StatusRestController';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('StatusRestController', ()=> {
    let controller: StatusRestController;
    let rest: any;

    suiteSetup(async () => {
        controller = new StatusRestController();
        controller.configure(restConfig);

        let contextInfo = new ContextInfo();
        contextInfo.name = "Test";
        contextInfo.description = "This is a test container";

        let references = References.fromTuples(
            new Descriptor("pip-services", "context-info", "default", "default", "1.0"), contextInfo,
            new Descriptor("pip-services", "status-controller", "http", "default", "1.0"), controller
        );
        controller.setReferences(references);

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
            rest.get('/status', (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isNotNull(result);
    });

});
