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
const NullCache_1 = require("../../src/cache/NullCache");
suite('NullCache', () => {
    let cache = null;
    setup(() => {
        cache = new NullCache_1.NullCache();
    });
    test('Retrieve Returns Null', () => __awaiter(void 0, void 0, void 0, function* () {
        let val = yield cache.retrieve(null, "key1");
        assert.isNull(val);
    }));
    test('Store Returns Same Value', () => __awaiter(void 0, void 0, void 0, function* () {
        let key = "key1";
        let initVal = "value1";
        let val = yield cache.store(null, key, initVal, 0);
        assert.equal(initVal, val);
    }));
});
//# sourceMappingURL=NullCache.test.js.map