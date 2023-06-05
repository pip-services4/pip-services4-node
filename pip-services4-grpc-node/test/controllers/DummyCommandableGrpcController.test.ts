const assert = require('chai').assert;
const grpc = require('@grpc/grpc-js');
import protoLoader = require('@grpc/proto-loader');

let services = require('../../../src/protos/commandable_grpc_pb');
let messages = require('../../../src/protos/commandable_pb');

import { Descriptor } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { References } from 'pip-services4-components-node';

import { Dummy } from '../sample/Dummy';
import { DummyService } from '../sample/DummyService';
import { DummyCommandableGrpcController } from './DummyCommandableGrpcController';

let grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3001
);

suite('DummyCommandableGrpcService', ()=> {
    let _dummy1: Dummy;
    let _dummy2: Dummy;

    let controller: DummyCommandableGrpcController;

    let client: any;

    suiteSetup(async () => {
        let service = new DummyService();

        controller = new DummyCommandableGrpcController();
        controller.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'service', 'default', 'default', '1.0'), service,
            new Descriptor('pip-services-dummies', 'controller', 'grpc', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        await controller.open(null);
    });
    
    suiteTeardown(async () => {
        await controller.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../src/protos/commandable.proto",
            {
                keepCase: true,
                // longs: String,
                // enums: String,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).commandable.Commandable;

        client = new clientProto('localhost:3001', grpc.credentials.createInsecure());

        _dummy1 = { id: null, key: "Key 1", content: "Content 1"};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2"};
    });

    test('CRUD Operations', async () => {
        // Create one dummy
        let response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.create_dummy',
                    args_empty: false,
                    args_json: JSON.stringify({ 
                        dummy: _dummy1
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        let dummy = JSON.parse(response.result_json);

        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy1.content);
        assert.equal(dummy.key, _dummy1.key);

        let dummy1 = dummy;

        // Create another dummy
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.create_dummy',
                    args_empty: false,
                    args_json: JSON.stringify({ 
                        dummy: _dummy2
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        dummy = JSON.parse(response.result_json);

        assert.isObject(dummy);
        assert.equal(dummy.content, _dummy2.content);
        assert.equal(dummy.key, _dummy2.key);

        // Get all dummies
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.get_dummies',
                    args_empty: false,
                    args_json: JSON.stringify({})
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        let dummies = JSON.parse(response.result_json);
        
        assert.isObject(dummies);
        assert.lengthOf(dummies.data, 2);

        // Update the dummy
        dummy1.content = 'Updated Content 1';
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.update_dummy',
                    args_empty: false,
                    args_json: JSON.stringify({ 
                        dummy: dummy1
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        dummy = JSON.parse(response.result_json);
        
        assert.isObject(dummy);
        assert.equal(dummy.content, 'Updated Content 1');
        assert.equal(dummy.key, _dummy1.key);

        dummy1 = dummy;

        // Delete dummy
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.delete_dummy',
                    args_empty: false,
                    args_json: JSON.stringify({ 
                        dummy_id: dummy1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isNull(response.error);

        // Try to get delete dummy
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'dummy.get_dummy_by_id',
                    args_empty: false,
                    args_json: JSON.stringify({ 
                        dummy_id: dummy1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });
        assert.isNull(response.error);
        assert.isTrue(response.result_empty);
    });

});
