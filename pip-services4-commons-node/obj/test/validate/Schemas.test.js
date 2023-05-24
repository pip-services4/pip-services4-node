"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const TestObject_1 = require("./TestObject");
const Schema_1 = require("../../src/validate/Schema");
const ObjectSchema_1 = require("../../src/validate/ObjectSchema");
const ArraySchema_1 = require("../../src/validate/ArraySchema");
const MapSchema_1 = require("../../src/validate/MapSchema");
const TypeCode_1 = require("../../src/convert/TypeCode");
suite('SchemasTest', () => {
    test('Test empty schema', () => {
        let schema = new ObjectSchema_1.ObjectSchema();
        let results = schema.validate(null);
        assert.equal(results.length, 0);
    });
    test('Test required', () => {
        let schema = new Schema_1.Schema().makeRequired();
        let results = schema.validate(null);
        assert.equal(results.length, 1);
    });
    test('Test unexpected', () => {
        let schema = new ObjectSchema_1.ObjectSchema();
        let obj = new TestObject_1.TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 10);
    });
    test('Test optional properties', () => {
        let schema = new ObjectSchema_1.ObjectSchema()
            .withOptionalProperty("intField")
            .withOptionalProperty("stringProperty")
            .withOptionalProperty("nullProperty")
            .withOptionalProperty("intArrayProperty")
            .withOptionalProperty("stringListProperty")
            .withOptionalProperty("mapProperty")
            .withOptionalProperty("subObjectProperty")
            .withOptionalProperty("subArrayProperty");
        let obj = new TestObject_1.TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 2);
    });
    test('Test required properties', () => {
        let schema = new ObjectSchema_1.ObjectSchema()
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
        let obj = new TestObject_1.TestObject();
        obj.subArrayProperty = null;
        var results = schema.validate(obj);
        assert.equal(results.length, 2);
    });
    test('Test types', () => {
        let schema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode_1.TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode_1.TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode_1.TypeCode.Object)
            .withRequiredProperty("intArrayProperty", TypeCode_1.TypeCode.Array)
            .withRequiredProperty("stringListProperty", TypeCode_1.TypeCode.Array)
            .withRequiredProperty("mapProperty", TypeCode_1.TypeCode.Map)
            .withRequiredProperty("subObjectProperty", TypeCode_1.TypeCode.Map)
            .withRequiredProperty("subArrayProperty", TypeCode_1.TypeCode.Array);
        let obj = new TestObject_1.TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });
    test('Test sub schema', () => {
        let sunSchema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("id", TypeCode_1.TypeCode.String)
            .withRequiredProperty("floatField", TypeCode_1.TypeCode.Double)
            .withOptionalProperty("nullProperty", TypeCode_1.TypeCode.Map);
        let schema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode_1.TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode_1.TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode_1.TypeCode.Object)
            .withRequiredProperty("intArrayProperty", TypeCode_1.TypeCode.Array)
            .withRequiredProperty("stringListProperty", TypeCode_1.TypeCode.Array)
            .withRequiredProperty("mapProperty", TypeCode_1.TypeCode.Map)
            .withRequiredProperty("subObjectProperty", sunSchema)
            .withRequiredProperty("subArrayProperty", TypeCode_1.TypeCode.Array);
        let obj = new TestObject_1.TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });
    test('Test array and map schemas', () => {
        let sunSchema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("id", TypeCode_1.TypeCode.String)
            .withRequiredProperty("floatField", TypeCode_1.TypeCode.Double)
            .withOptionalProperty("nullProperty", TypeCode_1.TypeCode.Map);
        let schema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("privateField")
            .withRequiredProperty("privateProperty")
            .withRequiredProperty("intField", TypeCode_1.TypeCode.Long)
            .withRequiredProperty("stringProperty", TypeCode_1.TypeCode.String)
            .withOptionalProperty("nullProperty", TypeCode_1.TypeCode.Object)
            .withRequiredProperty("intArrayProperty", new ArraySchema_1.ArraySchema(TypeCode_1.TypeCode.Long))
            .withRequiredProperty("stringListProperty", new ArraySchema_1.ArraySchema(TypeCode_1.TypeCode.String))
            .withRequiredProperty("mapProperty", new MapSchema_1.MapSchema(TypeCode_1.TypeCode.String, TypeCode_1.TypeCode.Long))
            .withRequiredProperty("subObjectProperty", sunSchema)
            .withRequiredProperty("subArrayProperty", TypeCode_1.TypeCode.Array);
        let obj = new TestObject_1.TestObject();
        let results = schema.validate(obj);
        assert.equal(results.length, 0);
    });
});
//# sourceMappingURL=Schemas.test.js.map