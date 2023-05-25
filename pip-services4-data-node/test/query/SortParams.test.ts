import { SortField } from "../../src/query/SortField";
import { SortParams } from "../../src/query/SortParams";

const assert = require('chai').assert;



suite('SortParams', ()=> {
    
    test('Create and Push', () => {
        let sort = new SortParams(new SortField("f1"), new SortField("f2"));
        sort.push(new SortField("f3", false));
        assert.equal(3, sort.length);
    });    

});