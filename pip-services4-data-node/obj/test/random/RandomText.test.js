"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const RandomText_1 = require("../../src/random/RandomText");
suite('RandomText', () => {
    test('Phrase', () => {
        assert.isTrue(RandomText_1.RandomText.phrase(-1) == "");
        assert.isTrue(RandomText_1.RandomText.phrase(-1, -2) == "");
        assert.isTrue(RandomText_1.RandomText.phrase(-1, 0) == "");
        assert.isTrue(RandomText_1.RandomText.phrase(-2, -1) == "");
        let text = RandomText_1.RandomText.phrase(4);
        assert.isTrue(text.length >= 4 && text.length <= 10);
        text = RandomText_1.RandomText.phrase(4, 10);
        assert.isTrue(text.length >= 4);
    });
    test('FullName', () => {
        let text = RandomText_1.RandomText.fullName();
        assert.isTrue(text.indexOf(" ") != -1);
    });
    test('Phone', () => {
        let text = RandomText_1.RandomText.phone();
        assert.isTrue(text.indexOf("(") != -1);
        assert.isTrue(text.indexOf(")") != -1);
        assert.isTrue(text.indexOf("-") != -1);
    });
    test('Email', () => {
        let text = RandomText_1.RandomText.email();
        assert.isTrue(text.indexOf("@") != -1);
        assert.isTrue(text.indexOf(".com") != -1);
    });
});
//# sourceMappingURL=RandomText.test.js.map