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
const CommandExec_1 = require("./CommandExec");
const Command_1 = require("../../src/commands/Command");
const Parameters_1 = require("../../src/run/Parameters");
suite('Command', () => {
    test('Get Name', () => {
        let command = new Command_1.Command("name", null, new CommandExec_1.CommandExec());
        // Check match by individual fields
        assert.isNotNull(command);
        assert.equal(command.getName(), 'name');
    });
    test('Execute', () => __awaiter(void 0, void 0, void 0, function* () {
        let command = new Command_1.Command("name", null, new CommandExec_1.CommandExec());
        let map = {};
        map[8] = "title 8";
        map[11] = "title 11";
        let param = new Parameters_1.Parameters(map);
        let result = yield command.execute("a", param);
        assert.equal(result, 0);
    }));
});
//# sourceMappingURL=Command.test.js.map