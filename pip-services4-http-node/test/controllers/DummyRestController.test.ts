const assert = require('chai').assert;
const restify = require('restify-clients');
const fs = require('fs');

import { ConfigParams, Descriptor } from 'pip-services4-components-node';
import { IdGenerator } from 'pip-services4-data-node';
import { References } from 'pip-services4-components-node';

import { Dummy } from '../sample/Dummy';
import { DummyService } from '../sample/DummyService';
import { DummyRestController } from './DummyRestController';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000,
    "swagger.enable", "true",
    "swagger.content", "swagger yaml or json content"  // for test only
);

suite('DummyRestController', ()=> {
    let _dummy1: Dummy;
    let _dummy2: Dummy;
    let headers: any = {};

    let controller: DummyRestController;

    let rest: any;

    suiteSetup(async () => {
        let service = new DummyService();

        controller = new DummyRestController();
        controller.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*',  headers: headers });

        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
    });

    test('CRUD Operations', async () => {
        // Create one dummy
        let dummy = await new Promise<any>((resolve, reject) => {
            rest.post('/dummies', _dummy1, (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy1.content);
        assert.equal(dummy.key, _dummy1.key);

        let dummy1 = dummy;

        // Create another dummy
        dummy = await new Promise<any>((resolve, reject) => {
            rest.post('/dummies', _dummy2, (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy2.content);
        assert.equal(dummy.key, _dummy2.key);

        let dummy2 = dummy;

        // Get all dummies
        let dummies = await new Promise<any>((resolve, reject) => {
            rest.get('/dummies', (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 2);

        // Update the dummy
        dummy1.content = 'Updated Content 1';
        dummy = await new Promise<any>((resolve, reject) => {
            rest.put('/dummies', dummy1, (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.isObject(dummy);
        assert.equal(dummy.content, 'Updated Content 1');
        assert.equal(dummy.key, _dummy1.key);

        dummy1 = dummy;

        // Delete dummy
        await new Promise<any>((resolve, reject) => {
            rest.del('/dummies/' + dummy1.id, (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });

        // Try to get delete dummy
        dummy = await new Promise<any>((resolve, reject) => {
            rest.get('/dummies/' + dummy1.id, (err, req, res, result) => {
                if (err == null) resolve(result || null);
                else reject(err);
            });
        });
        // assert.isNull(dummy);
    });

    test('Failed Validation', async () => {

        // Create one dummy with an invalid id
        let dummy = await new Promise<any>((resolve, reject) => {
            rest.post('/dummies', {}, (err, req, res, result) => {
                    assert.equal(err.restCode, 'INVALID_DATA');

                    if (err != null) resolve(err);
                    else reject(dummy);
                }
            );
        });
    });

    test('Check context', async () => {
        // check transmit correllationId over params
        let result = await new Promise<any>((resolve, reject) => {
            rest.get("/dummies/check/trace_id?trace_id=test_cor_id", (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.equal("test_cor_id", result.trace_id);

        // check transmit correllationId over header
        result = await new Promise<any>((resolve, reject) => {
            headers["trace_id"] = "test_cor_id_header";
            rest.get("/dummies/check/trace_id", (err, req, res, result) => {
                if (err == null) resolve(result);
                else reject(err);
            });
        });
        assert.equal(controller.getNumberOfCalls(), 5); // Check interceptor
        assert.equal("test_cor_id_header", result.trace_id);
    });

    test('Get OpenApi Spec From String', async () => {
        let client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });

        let result = await new Promise<any>((resolve, reject) => {
            rest.get("/swagger", (err, req, res) => {
                // if (err == null) resolve(res.body);
                // else reject(err);
                resolve(res.body);
            });
        });

        let openApiContent = restConfig.getAsString("swagger.content");
        assert.equal(openApiContent, result);
    });

    test('Get OpenApi Spec From File', async () => {
        let openApiContent = "swagger yaml content from file";
        let filename = 'dummy_'+ IdGenerator.nextLong() + '.tmp';
        let client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });

        // create temp file
        await new Promise((resolve, reject) => {
            fs.writeFile(filename, openApiContent, (err) => {
                if (err == null) resolve(null);
                else reject(err);
            });
        });

        // recreate service with new configuration
        await controller.close(null);

        let serviceConfig = ConfigParams.fromTuples(
            "connection.protocol", "http",
            "connection.host", "localhost",
            "connection.port", 3000,
            "swagger.enable", "true",
            "swagger.path", filename  // for test only
        );

        let service = new DummyService();
        controller = new DummyRestController();
        controller.configure(serviceConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'rest', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);

        let content = await new Promise((resolve, reject) => {
            client.get("/swagger", (err, req, res) => {
                if (err == null) resolve(res.body);
                else reject(err);
            });
        });
        assert.equal(openApiContent, content);
        
        // delete temp file
        await new Promise((resolve, reject) => {
            fs.unlink(filename, (err) => {
                if (err == null) resolve(null);
                else reject(err);
            });
        });
    });
});
