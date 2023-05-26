const assert = require('chai').assert;

import { Parameters } from 'pip-services4-components-node';

import { CommandExec } from './CommandExec';
import { Command } from '../../src/commands/Command';

suite('Command', ()=> {

    test('Get Name', () => {
        let command = new Command("name", null, new CommandExec());

		// Check match by individual fields
        assert.isNotNull(command);
        assert.equal(command.getName(), 'name');
    });    

    test('Execute', async () => {
        let command = new Command("name", null, new CommandExec());

        let map: { [id: number] : any } = {};
        map[8] = "title 8";
        map[11] = "title 11";
        let param = new Parameters(map);

        let result = await command.execute("a", param)
        assert.equal(result, 0);
    });    

});
