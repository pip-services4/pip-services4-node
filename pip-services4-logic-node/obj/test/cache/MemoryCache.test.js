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
const MemoryCache_1 = require("../../src/cache/MemoryCache");
const CacheFixture_1 = require("./CacheFixture");
suite('MemoryCache', () => {
    let _cache;
    let _fixture;
    setup(() => {
        _cache = new MemoryCache_1.MemoryCache();
        _fixture = new CacheFixture_1.CacheFixture(_cache);
    });
    test('Store and Retrieve', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testStoreAndRetrieve();
    }));
    test('Retrieve Expired', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testRetrieveExpired();
    }));
    test('Remove', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testRemove();
    }));
});
//# sourceMappingURL=MemoryCache.test.js.map