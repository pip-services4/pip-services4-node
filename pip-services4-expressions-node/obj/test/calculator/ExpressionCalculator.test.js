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
const ExpressionCalculator_1 = require("../../src/calculator/ExpressionCalculator");
const VariantType_1 = require("../../src/variants/VariantType");
const Variant_1 = require("../../src/variants/Variant");
suite('ExpressionCalculator', () => {
    test('SimpleExpression', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "2 + 2";
        let result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.Integer, result.type);
        assert.equal(4, result.asInteger);
    }));
    test('FunctionExpression', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "A + b / (3 - Max(-123, 1)*2)";
        // calculator.expression = "Abs(1)";
        assert.equal("A", calculator.defaultVariables.findByName("a").name);
        assert.equal("b", calculator.defaultVariables.findByName("b").name);
        calculator.defaultVariables.findByName("a").value = new Variant_1.Variant("xyz");
        calculator.defaultVariables.findByName("b").value = new Variant_1.Variant(123);
        let result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.String, result.type);
        assert.equal("xyz123", result.asString);
    }));
    test('ArrayExpression', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "'abc'[1]";
        let result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.String, result.type);
        assert.equal("b", result.asString);
    }));
    test('BooleanExpression', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "1 > 2";
        let result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.Boolean, result.type);
        assert.isFalse(result.asBoolean);
    }));
    test('UnknownFunction', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "XXX(1)";
        try {
            yield calculator.evaluate();
            assert.fail("Expected exception on unknown function");
        }
        catch (_a) {
            // Expected exception
        }
    }));
    test('InExpression', () => __awaiter(void 0, void 0, void 0, function* () {
        let calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "2 IN ARRAY(1,2,3)";
        let result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.Boolean, result.type);
        assert.isTrue(result.asBoolean);
        calculator = new ExpressionCalculator_1.ExpressionCalculator();
        calculator.expression = "5 NOT IN ARRAY(1,2,3)";
        result = yield calculator.evaluate();
        assert.equal(VariantType_1.VariantType.Boolean, result.type);
        assert.isTrue(result.asBoolean);
    }));
});
//# sourceMappingURL=ExpressionCalculator.test.js.map