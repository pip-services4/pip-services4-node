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
const MemoryStateStore_1 = require("../../src/state/MemoryStateStore");
const StateStoreFixture_1 = require("./StateStoreFixture");
suite('MemoryStateStore', () => {
    let _cache;
    let _fixture;
    setup(() => {
        _cache = new MemoryStateStore_1.MemoryStateStore();
        _fixture = new StateStoreFixture_1.StateStoreFixture(_cache);
    });
    test('Save and Load', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testSaveAndLoad();
    }));
    test('Delete', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testDelete();
    }));
});
//# sourceMappingURL=MemoryStateStore.test.js.map