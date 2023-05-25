const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { ConnectionParams } from '../../src/connect/ConnectionParams';
import { ConnectionResolver } from '../../src/connect/ConnectionResolver';

suite('ConnectionResolver', ()=> {
	let RestConfig = ConfigParams.fromTuples(
        "connection.protocol", "http",
        "connection.host", "localhost",
        "connection.port", 3000
	);

    test('Configure', () => {
		let connectionResolver = new ConnectionResolver(RestConfig);
		let configList = connectionResolver.getAll();
		assert.equal(configList[0].get("protocol"), "http");
		assert.equal(configList[0].get("host"), "localhost");
		assert.equal(configList[0].get("port"), "3000");
    });    
		
    test('Register', async () => {
		let connectionParams = new ConnectionParams();
		let connectionResolver = new ConnectionResolver(RestConfig);

        await connectionResolver.register("correlationId", connectionParams);
        let configList = connectionResolver.getAll();
        assert.equal(configList.length, 1);

        await connectionResolver.register("correlationId", connectionParams);
        configList = connectionResolver.getAll();
        assert.equal(configList.length, 1);

        connectionParams.setDiscoveryKey("Discovery key value");
        let references = new References();
        connectionResolver.setReferences(references);
        await connectionResolver.register("correlationId", connectionParams);
        configList = connectionResolver.getAll();
        assert.equal(configList.length, 2);
        assert.equal(configList[0].get("protocol"), "http");
        assert.equal(configList[0].get("host"), "localhost");
        assert.equal(configList[0].get("port"), "3000");
        //assert.equal(configList[0].get("discovery_key"), "Discovery key value");
	});
	
    test('Resolve', async () => {
        let connectionResolver = new ConnectionResolver(RestConfig);
        let connectionParams = await connectionResolver.resolve("correlationId");
        assert.equal(connectionParams.get("protocol"), "http");
        assert.equal(connectionParams.get("host"), "localhost");
        assert.equal(connectionParams.get("port"), "3000");

        let RestConfigDiscovery = ConfigParams.fromTuples(
            "connection.protocol", "http",
            "connection.host", "localhost",
            "connection.port", 3000,
            "connection.discovery_key", "Discovery key value"
        );
        let references = new References();
        connectionResolver = new ConnectionResolver(RestConfigDiscovery , references);		
        try {
            let connectionParams = await connectionResolver.resolve("correlationId");
        } catch {
            // Expected exception
        }
	});

});