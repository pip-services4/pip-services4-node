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
const DummyCloudFunctionFixture_1 = require("./DummyCloudFunctionFixture");
suite('DummyFunctionService', () => {
    let fixture;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        fixture = new DummyCloudFunctionFixture_1.DummyCloudFunctionFixture('handler', 3000);
        yield fixture.startCloudServiceLocally();
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.stopCloudServiceLocally();
    }));
    test('CRUD Operations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield fixture.testCrudOperations();
    }));
});
//# sourceMappingURL=DummyCloudFunctionService.test.js.map