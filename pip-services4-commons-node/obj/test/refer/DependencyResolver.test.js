"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const References_1 = require("../../src/refer/References");
const DependencyResolver_1 = require("../../src/refer/DependencyResolver");
const Descriptor_1 = require("../../src/refer/Descriptor");
const ConfigParams_1 = require("../../src/config/ConfigParams");
suite('DependencyResolver', () => {
    test('Resolve depedencies', () => {
        let ref1 = {};
        let ref2 = {};
        let refs = References_1.References.fromTuples("Reference1", ref1, new Descriptor_1.Descriptor("pip-services-commons", "reference", "object", "ref2", "1.0"), ref2);
        let resolver = DependencyResolver_1.DependencyResolver.fromTuples("ref1", "Reference1", "ref2", new Descriptor_1.Descriptor("pip-services-commons", "reference", "*", "*", "*"));
        resolver.setReferences(refs);
        assert.equal(ref1, resolver.getOneRequired("ref1"));
        assert.equal(ref2, resolver.getOneRequired("ref2"));
        assert.isNull(resolver.getOneOptional("ref3"));
    });
    test('Configure depedencies', () => {
        let ref1 = {};
        let ref2 = {};
        let refs = References_1.References.fromTuples("Reference1", ref1, new Descriptor_1.Descriptor("pip-services-commons", "reference", "object", "ref2", "1.0"), ref2);
        let config = ConfigParams_1.ConfigParams.fromTuples("dependencies.ref1", "Reference1", "dependencies.ref2", "pip-services-commons:reference:*:*:*", "dependencies.ref3", null);
        let resolver = new DependencyResolver_1.DependencyResolver(config);
        resolver.setReferences(refs);
        assert.equal(ref1, resolver.getOneRequired("ref1"));
        assert.equal(ref2, resolver.getOneRequired("ref2"));
        assert.isNull(resolver.getOneOptional("ref3"));
    });
});
//# sourceMappingURL=DependencyResolver.test.js.map