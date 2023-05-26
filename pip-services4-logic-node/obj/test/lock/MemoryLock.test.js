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
const MemoryLock_1 = require("../../src/lock/MemoryLock");
const LockFixture_1 = require("./LockFixture");
suite('MemoryLock', () => {
    var _lock;
    var _fixture;
    setup(() => {
        _lock = new MemoryLock_1.MemoryLock();
        _fixture = new LockFixture_1.LockFixture(_lock);
    });
    test('Try Acquire Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testTryAcquireLock();
    }));
    test('Acquire Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testAcquireLock();
    }));
    test('Release Lock', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testReleaseLock();
    }));
});
//# sourceMappingURL=MemoryLock.test.js.map