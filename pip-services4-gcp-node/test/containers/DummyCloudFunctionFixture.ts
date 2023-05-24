const assert = require('chai').assert;
const restify = require('restify');
const waitPort = require('wait-port');

import { exec } from 'child_process';
import { Dummy } from '../Dummy';


export class DummyCloudFunctionFixture {
    private port: number;
    private process: any;
    private functionName: string;
    private rest: any;

    public constructor(functionName: string, port: number = 3000) {
        this.functionName = functionName;
        this.port = port;

        let url = `http://localhost:${port}`;
        this.rest = restify.createJsonClient({
            url: url, version: '*', 
            retry: {
                'retries': 0
            }
        });
    }

    public async startCloudServiceLocally(): Promise<any> {
        let ff = exec(
            `npx functions-framework --target=${this.functionName} --signature-type=http --port=${this.port} --source=test/containers`
        );
        await waitPort({ host: 'localhost', port: this.port });
        this.process = ff;

        await new Promise<void>((resolve, reject) => {
            setTimeout(resolve, 500);
        });
    }

    public async stopCloudServiceLocally(): Promise<any> {
        this.process.kill();
        this.process = null;

        // Hack to close all sockets from functions-framework
        process['_getActiveHandles']().forEach(element => {
            if (element.constructor.name == 'Socket')
                element.emit('close');
        });
    }

    protected async httpInvoke(data): Promise<any> {
        let response = await new Promise<any>((resolve, reject) => {
            this.rest.post('/' + this.functionName,
                data,
                (err, req, res, entity) => {
                    if (err != null) {
                        resolve(err);
                        return;
                    }
                    resolve(Object.keys(entity).length > 0 ? entity : null);
                });
        });

        return response;
    }

    public async testCrudOperations(): Promise<void> {
        let DUMMY1 = { id: null, key: "Key 1", content: "Content 1" };
        let DUMMY2 = { id: null, key: "Key 2", content: "Content 2" };

        // Create one dummy
        let dummy1 = await this.httpInvoke({
            cmd: 'create_dummy',
            dummy: DUMMY1
        })
        assert.isObject(dummy1);
        assert.equal(dummy1.content, DUMMY1.content);
        assert.equal(dummy1.key, DUMMY1.key);

        // Create another dummy
        let dummy2 = await this.httpInvoke({
            cmd: 'create_dummy',
            dummy: DUMMY2
        });
        assert.isObject(dummy2);
        assert.equal(dummy2.content, DUMMY2.content);
        assert.equal(dummy2.key, DUMMY2.key);

        // Update the dummy
        dummy1.content = 'Updated Content 1'
        const updatedDummy1 = await this.httpInvoke({
            cmd: 'update_dummy',
            dummy: dummy1

        });
        assert.isObject(updatedDummy1);
        assert.equal(updatedDummy1.id, dummy1.id);
        assert.equal(updatedDummy1.content, dummy1.content);
        assert.equal(updatedDummy1.key, dummy1.key);
        dummy1 = updatedDummy1

        // Delete dummy
        let deleted = await this.httpInvoke({
            cmd: 'delete_dummy',
            dummy_id: dummy1.id
        });

        assert.isObject(deleted);
        assert.equal(deleted.id, dummy1.id);
        assert.equal(deleted.content, dummy1.content);
        assert.equal(deleted.key, dummy1.key);

        let dummy = await this.httpInvoke({
            cmd: 'get_dummy_by_id',
            dummy_id: dummy1.id
        });
        assert.isNull(dummy || null);


        // Failed validation
        let err = await this.httpInvoke({
            cmd: 'create_dummy',
            dummy: null
        })

        assert.equal(err.restCode, 'INVALID_DATA');
    }
}