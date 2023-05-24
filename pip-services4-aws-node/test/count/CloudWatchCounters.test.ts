import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';
import { ContextInfo } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { CloudWatchCounters } from '../../src/count/CloudWatchCounters';
import { CountersFixture } from './CountersFixture';

suite('CloudWatchCounters', ()=> {
    let _counters: CloudWatchCounters;
    let _fixture: CountersFixture;

    let AWS_REGION = process.env["AWS_REGION"] || "";
    let AWS_ACCESS_ID = process.env["AWS_ACCESS_ID"] || "";
    let AWS_ACCESS_KEY = process.env["AWS_ACCESS_KEY"] || "";

    if (!AWS_REGION || !AWS_ACCESS_ID || !AWS_ACCESS_KEY) {
        return;
    }

    setup(async () => {

        _counters = new CloudWatchCounters();
        _fixture = new CountersFixture(_counters);

        _counters.configure(ConfigParams.fromTuples(
            "interval", "5000",
            "connection.region", AWS_REGION,
            "credential.access_id", AWS_ACCESS_ID,
            "credential.access_key", AWS_ACCESS_KEY
        ));

        const contextInfo = new ContextInfo();
        contextInfo.name = "Test";
        contextInfo.description = "This is a test container";

        _counters.setReferences(References.fromTuples(
            new Descriptor("pip-services", "context-info", "default", "default", "1.0"), contextInfo,
            new Descriptor("pip-services", "counters", "cloudwatch", "default", "1.0"), _counters
        ));

        await _counters.open(null);
    });

    teardown(async () => {
        await _counters.close(null);
    });

    test('Simple Counters', async () => {
        await _fixture.testSimpleCounters();
    });

    test('Measure Elapsed Time', async () => {
        await _fixture.testMeasureElapsedTime();
    });

});