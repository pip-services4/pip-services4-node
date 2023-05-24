const assert = require('chai').assert;

import { MustacheTemplate } from '../../src/mustache/MustacheTemplate';

suite('MustacheTemplate', ()=> {

    test('Template1', () => {
        let template = new MustacheTemplate();
        template.template = "Hello, {{{NAME}}}{{ #if ESCLAMATION }}!{{/if}}{{{^ESCLAMATION}}}.{{{/ESCLAMATION}}}";
        let variables = {
            'NAME': 'Alex',
            'ESCLAMATION': '1'
        };
        let result = template.evaluateWithVariables(variables);
        assert.equal("Hello, Alex!", result);

        template.defaultVariables['name'] = 'Mike';
        template.defaultVariables['esclamation'] = false;

        result = template.evaluate();
        assert.equal("Hello, Mike.", result);
    });      

});