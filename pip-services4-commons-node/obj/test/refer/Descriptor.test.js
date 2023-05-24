"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Descriptor_1 = require("../../src/refer/Descriptor");
suite('Descriptor', () => {
    test('Match', () => {
        let descriptor = new Descriptor_1.Descriptor("pip-dummies", "controller", "default", "default", "1.0");
        // Check match by individual fields
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor(null, null, null, null, null)));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("pip-dummies", "controller", null, null, null)));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor(null, null, "default", null, null)));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor(null, null, null, null, "1.0")));
        // Check match by individual "*" fields
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("pip-dummies", "*", "*", "*", "*")));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("*", "controller", "*", "*", "*")));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("*", "*", "default", "*", "*")));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("*", "*", "*", "*", "1.0")));
        // Check match by all values
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("pip-dummies", "controller", "default", "default", null)));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor(null, "controller", "default", "default", "1.0")));
        assert.isTrue(descriptor.match(new Descriptor_1.Descriptor("pip-dummies", "controller", "default", "default", "1.0")));
        // Check mismatch by individual fields
        assert.isFalse(descriptor.match(new Descriptor_1.Descriptor(null, "cache", null, null, null)));
        assert.isFalse(descriptor.match(new Descriptor_1.Descriptor("pip-commons", "controller", null, null, null)));
        assert.isFalse(descriptor.match(new Descriptor_1.Descriptor(null, null, "special", null, null)));
        assert.isFalse(descriptor.match(new Descriptor_1.Descriptor(null, null, null, null, "2.0")));
    });
    test('To String', () => {
        let descriptor1 = new Descriptor_1.Descriptor("pip-dummies", "controller", "default", "default", "1.0");
        assert.equal("pip-dummies:controller:default:default:1.0", descriptor1.toString());
        let descriptor2 = new Descriptor_1.Descriptor(null, "controller", null, null, null);
        assert.equal("*:controller:*:*:*", descriptor2.toString());
    });
    test('From String', () => {
        let descriptor = Descriptor_1.Descriptor.fromString(null);
        assert.isNull(descriptor);
        descriptor = Descriptor_1.Descriptor.fromString("pip-dummies:controller:default:default:1.0");
        assert.isTrue(descriptor.exactMatch(new Descriptor_1.Descriptor("pip-dummies", "controller", "default", "default", "1.0")));
        try {
            Descriptor_1.Descriptor.fromString("xxx");
            assert.fail("Descriptor.fromString shall throw an exception");
        }
        catch (ex) {
            // Ok...
        }
    });
    test('Equals', () => {
        let descriptor1 = Descriptor_1.Descriptor.fromString("pip-dummies:controller:default:default:1.0");
        let descriptor2 = Descriptor_1.Descriptor.fromString("pip-dummies:controller:default:default:1.0");
        assert.isTrue(descriptor1.equals(descriptor2));
    });
});
//# sourceMappingURL=Descriptor.test.js.map