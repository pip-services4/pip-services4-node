"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomString_1 = require("../../src/random/RandomString");
suite('RandomString', () => {
    let symbols = "_,.:-/.[].{},#-!,$=%.+^.&*-() ";
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let digits = "01234956789";
    test('Pick', () => {
        assert.isTrue(RandomString_1.RandomString.pickChar("") == '');
        let charVariable = RandomString_1.RandomString.pickChar(chars);
        assert.isTrue(chars.indexOf(charVariable) != -1);
        let valuesEmpty = [];
        assert.isTrue(RandomString_1.RandomString.pick(valuesEmpty) == "");
        let values = ["ab", "cd"];
        let result = RandomString_1.RandomString.pick(values);
        assert.isTrue(result == "ab" || result == "cd");
    });
    test('Distort', () => {
        let value = RandomString_1.RandomString.distort("abc");
        assert.isTrue(value.length == 3 || value.length == 4);
        assert.isTrue(value.substring(0, 3) == "Abc"
            || value.substring(0, 3) == "abc");
        if (value.length == 4)
            assert.isTrue(symbols.indexOf(value.substring(3)) != -1);
    });
    test('Next Alpha Char', () => {
        assert.isTrue(chars.indexOf(RandomString_1.RandomString.nextAlphaChar()) != -1);
    });
    test('Next String', () => {
        let value = RandomString_1.RandomString.nextString(3, 5);
        assert.isTrue(value.length <= 5 && value.length >= 3);
        for (let i = 0; i < value.length; i++) {
            assert.isTrue(chars.indexOf(value.charAt(i)) != -1
                || symbols.indexOf(value.charAt(i)) != -1
                || digits.indexOf(value.charAt(i)) != -1);
        }
    });
});
//# sourceMappingURL=RandomString.test.js.map