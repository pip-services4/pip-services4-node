const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-commons-node';
import { GcpConnectionParams } from '../../src/connect/GcpConnectionParams';
import { GcpConnectionResolver } from '../../src/connect/GcpConnectionResolver';

suite('GcpConnectionParams', ()=> {

    test('Test Empty Connection', async () => {
        let connection = new GcpConnectionParams();
        assert.isNull(connection.getUri());
        assert.isNull(connection.getProjectId());
        assert.isNull(connection.getFunction());
        assert.isNull(connection.getRegion());
        assert.isNull(connection.getProtocol());
        assert.isNull(connection.getAuthToken());
    });

    test('Compose Config', async () => {
        const config1 = ConfigParams.fromTuples(
            'connection.uri', 'http://east-my_test_project.cloudfunctions.net/myfunction',
            'credential.auth_token', '1234',
        );
        const config2 = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.region', 'east',
            'connection.function', 'myfunction',
            'connection.project_id', 'my_test_project',
            'credential.auth_token', '1234',
        );
        let resolver = new GcpConnectionResolver();
        resolver.configure(config1);
        let connection =  await resolver.resolve('');

        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunction());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());

        resolver = new GcpConnectionResolver();
        resolver.configure(config2);
        connection =  await resolver.resolve('');

        assert.equal('http://east-my_test_project.cloudfunctions.net/myfunction', connection.getUri());
        assert.equal('east', connection.getRegion());
        assert.equal('http', connection.getProtocol());
        assert.equal('myfunction', connection.getFunction());
        assert.equal('my_test_project', connection.getProjectId());
        assert.equal('1234', connection.getAuthToken());
    });
});