"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const TypeDescriptor_1 = require("../../src/reflect/TypeDescriptor");
suite('TypeDescriptor', () => {
    test('From String', () => {
        let descriptor = TypeDescriptor_1.TypeDescriptor.fromString(null);
        assert.isNull(descriptor);
        descriptor = TypeDescriptor_1.TypeDescriptor.fromString("xxx,yyy");
        assert.equal("xxx", descriptor.getName());
        assert.equal("yyy", descriptor.getLibrary());
        descriptor = TypeDescriptor_1.TypeDescriptor.fromString("xxx");
        assert.equal("xxx", descriptor.getName());
        assert.isNull(descriptor.getLibrary());
        try {
            descriptor = TypeDescriptor_1.TypeDescriptor.fromString("xxx,yyy,zzz");
            assert.fail("Wrong descriptor shall raise an exception");
        }
        catch (ex) {
            // Ok...
        }
    });
    test('Equals', () => {
        const descriptor1 = TypeDescriptor_1.TypeDescriptor.fromString("xxx,yyy");
        const descriptor2 = TypeDescriptor_1.TypeDescriptor.fromString("xxx,yyy");
        assert.isTrue(descriptor1.equals(descriptor2));
    });
});
//# sourceMappingURL=TypeDescriptor.test.js.map