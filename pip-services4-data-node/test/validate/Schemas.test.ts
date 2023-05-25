const assert = require('chai').assert;

import { TestObject } from './TestObject';
import { TestSubObject } from './TestSubObject';

import { Schema } from '../../src/validate/Schema';
import { ObjectSchema } from '../../src/validate/ObjectSchema';
import { ArraySchema } from '../../src/validate/ArraySchema';
import { MapSchema } from '../../src/validate/MapSchema';
import { TypeCode } from '../../src/convert/TypeCode';

suite('SchemasTest', ()=> {

    test('Test empty schema', () => {
        let schema = new ObjectSchema();
        let results = schema.validate(null);
        assert.equal(results.length, 0);
    });    

    test('Test required', () => {
        let schema = new Schema().makeRequired();
        let results = schema.validate(null);
        assert.equal(results.length, 1);
    });    

    test('Test unexpected', () => {
        let schema = new ObjectSchema();
        let obj = new TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 10);
    });    

    test('Test optional properties', () => {
        let schema = new ObjectSchema()
            .withOptionalProperty("intField")
            .withOptionalProperty("stringProperty")
            .withOptionalProperty("nullProperty")
            .withOptionalProperty("intArrayProperty")
            .withOptionalProperty("stringListProperty")
            .withOptionalProperty("mapProperty")
            .withOptionalProperty("subObjectProperty")
            .withOptionalProperty("subArrayProperty");

        let obj = new TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 2);
    });    

    test('Test required properties', () => {
        let schema = new ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField")
            .withRequiredProperty("stringProperty")
            .withRequiredProperty("nullProperty")
            .withRequiredProperty("intArrayProperty")
            .withRequiredProperty("stringListProperty")
            .withRequiredProperty("mapProperty")
            .withRequiredProperty("subObjectProperty")
            .withRequiredProperty("subArrayProperty");

        let obj = new TestObject();
        obj.subArrayProperty = null;

        var results = schema.validate(obj);
        assert.equal(results.length, 2);
    });    

    test('Test types', () => {
        let schema = new ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode.Object)
            .withRequiredProperty("intArrayProperty", TypeCode.Array)
            .withRequiredProperty("stringListProperty", TypeCode.Array)
            .withRequiredProperty("mapProperty", TypeCode.Map)
            .withRequiredProperty("subObjectProperty", TypeCode.Map)
            .withRequiredProperty("subArrayProperty", TypeCode.Array);

        let obj = new TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });    

    test('Test sub schema', () => {
        let sunSchema = new ObjectSchema()
            .withRequiredProperty("id", TypeCode.String)
            .withRequiredProperty("floatField", TypeCode.Double)
            .withOptionalProperty("nullProperty", TypeCode.Map)

        let schema = new ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode.Object)
            .withRequiredProperty("intArrayProperty", TypeCode.Array)
            .withRequiredProperty("stringListProperty", TypeCode.Array)
            .withRequiredProperty("mapProperty", TypeCode.Map)
            .withRequiredProperty("subObjectProperty", sunSchema)
            .withRequiredProperty("subArrayProperty", TypeCode.Array);

        let obj = new TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });    

    test('Test array and map schemas', () => {
        let sunSchema = new ObjectSchema()
            .withRequiredProperty("id", TypeCode.String)
            .withRequiredProperty("floatField", TypeCode.Double)
            .withOptionalProperty("nullProperty", TypeCode.Map)

        let schema = new ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode.Object)
            .withRequiredProperty("intArrayProperty", new ArraySchema(TypeCode.Long))
            .withRequiredProperty("stringListProperty", new ArraySchema(TypeCode.String))
            .withRequiredProperty("mapProperty", new MapSchema(TypeCode.String, TypeCode.Long))
            .withRequiredProperty("subObjectProperty", sunSchema)
            .withRequiredProperty("subArrayProperty", TypeCode.Array);

        let obj = new TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });    

});
