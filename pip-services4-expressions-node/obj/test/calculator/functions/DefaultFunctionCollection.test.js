"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DefaultFunctionCollection_1 = require("../../../src/calculator/functions/DefaultFunctionCollection");
const Variant_1 = require("../../../src/variants/Variant");
const VariantType_1 = require("../../../src/variants/VariantType");
const TypeUnsafeVariantOperations_1 = require("../../../src/variants/TypeUnsafeVariantOperations");
suite('DefaultFunctionCollection', () => {
    let testFunc = (params, operations, callback) => {
        callback(null, new Variant_1.Variant("ABC"));
    };
    test('CalculateFunctions', () => __awaiter(void 0, void 0, void 0, function* () {
        let collection = new DefaultFunctionCollection_1.DefaultFunctionCollection();
        let params = [
            new Variant_1.Variant(1),
            new Variant_1.Variant(2),
            new Variant_1.Variant(3)
        ];
        let operations = new TypeUnsafeVariantOperations_1.TypeUnsafeVariantOperations();
        let func = collection.findByName("sum");
        assert.isNotNull(func);
        let result = yield func.calculate(params, operations);
        assert.equal(VariantType_1.VariantType.Integer, result.type);
        assert.equal(6, result.asInteger);
    }));
    test('DateFunctions', () => __awaiter(void 0, void 0, void 0, function* () {
        let collection = new DefaultFunctionCollection_1.DefaultFunctionCollection();
        let params = [];
        let operations = new TypeUnsafeVariantOperations_1.TypeUnsafeVariantOperations();
        let func = collection.findByName("now");
        assert.isNotNull(func);
        let result = yield func.calculate(params, operations);
        assert.equal(VariantType_1.VariantType.DateTime, result.type);
        collection = new DefaultFunctionCollection_1.DefaultFunctionCollection();
        params = [
            new Variant_1.Variant(1975),
            new Variant_1.Variant(4),
            new Variant_1.Variant(8)
        ];
        func = collection.findByName("date");
        assert.isNotNull(func);
        result = yield func.calculate(params, operations);
        assert.equal(VariantType_1.VariantType.DateTime, result.type);
        assert.equal(pip_services3_commons_node_1.StringConverter.toString(new Date(1975, 3, 8)), pip_services3_commons_node_1.StringConverter.toString(result.asDateTime));
    }));
});
//# sourceMappingURL=DefaultFunctionCollection.test.js.map