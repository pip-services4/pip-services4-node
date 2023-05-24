const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-commons-node';
import { References } from 'pip-services4-commons-node';

import { ConnectionParams } from '../../src/connect/ConnectionParams';
import { ConnectionUtils } from '../../src/connect/ConnectionUtils';

suite('ConnectionUtils', ()=> {

    test('Parse URI', () => {
        let options = ConnectionUtils.parseUri("http://localhost:8080/test?param1=abc", "http", 80);
        assert.equal("http", options.getAsString("protocol"));
        assert.equal("localhost", options.getAsString("host"));       
        assert.equal(8080, options.getAsInteger("port"));       
        assert.equal("test", options.getAsString("path"));       
        assert.equal("abc", options.getAsString("param1"));       
    });    

    test('Compose URI', () => {
        let options = ConfigParams.fromTuples(
            "protocol", "http",
            "host", "localhost",
            "port", 8080,
            "path", "test",
            "param1", "abc"
        );
        
        let uri = ConnectionUtils.composeUri(options, "http", 80);
        assert.equal("http://localhost:8080/test?param1=abc", uri);
    });    

});