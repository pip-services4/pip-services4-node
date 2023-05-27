let process = require('process');

import { ConfigParams } from 'pip-services4-components-node';

import { DummyClientFixture } from './DummyClientFixture';
import { DummyCommandableCloudClient } from './DummyCommandableCloudClient';

suite('DummyCommandableCloudClient', ()=> {
    let functionName = process.env['GCP_FUNCTION_NAME'];
    let protocol = process.env['GCP_FUNCTION_PROTOCOL'];
    let region = process.env['GCP_FUNCTION_REGION'];
    let projectId = process.env['GCP_PROJECT_ID'];
    let uri = process.env['GCP_FUNCTION_URI'] || 'http://localhost:3005';

    if (!uri && (!region || !functionName || !protocol || !projectId)) {
        return;
    }

    let config = ConfigParams.fromTuples(
        'connection.uri', uri,
        'connection.protocol', protocol,
        'connection.region', region,
        'connection.function', functionName,
        'connection.project_id', projectId,
    );

    let client: DummyCommandableCloudClient;
    let fixture: DummyClientFixture;

    setup(async () => {
        client = new DummyCommandableCloudClient();
        client.configure(config);

        fixture = new DummyClientFixture(client, 'commandableHandler', 3005);

        if (uri == 'http://localhost:3005')
            await fixture.startCloudControllerLocally();
        
        await client.open(null);
    });

    teardown(async () => {
        await client.close(null);

        if (uri == 'http://localhost:3005') 
            await fixture.stopCloudControllerLocally();
        
    });

    test('Crud Operations', async () => {
        await fixture.testCrudOperations();
    });

});