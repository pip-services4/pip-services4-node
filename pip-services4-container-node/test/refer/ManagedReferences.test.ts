const assert = require('chai').assert;

import { Descriptor } from 'pip-services4-components-node';
import { ILogger } from 'pip-services4-observability-node';
import { DefaultObservabilityFactory } from 'pip-services4-observability-node';

import { ManagedReferences } from '../../src/refer/ManagedReferences';

suite('ManagedReferences', ()=> {
    
    test('Auto Create Component', () => {
        let refs = new ManagedReferences();

        let factory = new DefaultObservabilityFactory();
        refs.put(null, factory);

        let logger = refs.getOneRequired<ILogger>(new Descriptor("*", "logger", "*", "*", "*"));
        assert.isNotNull(logger);
    });    

    test('String Locator', () => {
        let refs = new ManagedReferences();

        let factory = new DefaultObservabilityFactory();
        refs.put(null, factory);

        let component = refs.getOneOptional("ABC");
        assert.isNull(component);
    });

    test('Null Locator', () => {
        let refs = new ManagedReferences();

        let factory = new DefaultObservabilityFactory();
        refs.put(null, factory);

        let component = refs.getOneOptional(null);
        assert.isNull(component);
    });    

});