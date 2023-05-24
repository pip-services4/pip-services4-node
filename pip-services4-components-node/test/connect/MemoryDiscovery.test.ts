const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-commons-node';

import { ConnectionParams } from '../../src/connect/ConnectionParams';
import { MemoryDiscovery } from '../../src/connect/MemoryDiscovery';

suite('MemoryDiscovery', ()=> {
    let config = ConfigParams.fromTuples(
        "key1.host", "10.1.1.100",
        "key1.port", "8080",
        "key2.host", "10.1.1.101",
        "key2.port", "8082"
    );  

    test('Resolve connections', async () => {
        let discovery = new MemoryDiscovery();
        discovery.readConnections(config);

        // Resolve one
        let connection = await discovery.resolveOne("123", "key1");

        assert.equal("10.1.1.100", connection.getHost());
        assert.equal(8080, connection.getPort());        

        connection = await discovery.resolveOne("123", "key2");

        assert.equal("10.1.1.101", connection.getHost());
        assert.equal(8082, connection.getPort());      

        // Resolve all
        discovery.register(null, "key1",
            ConnectionParams.fromTuples("host", "10.3.3.151")
        );

        let connections = await discovery.resolveAll("123", "key1");
        
        assert.isTrue(connections.length > 1);

    });    

});