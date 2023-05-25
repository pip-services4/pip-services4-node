const assert = require('chai').assert;

import { IStateStore } from '../../src/state/IStateStore';

let KEY1: string = "key1";
let KEY2: string = "key2";

let VALUE1: string = "value1";
let VALUE2: string = "value2";

export class StateStoreFixture {
    private _state: IStateStore = null;

    public constructor(state: IStateStore) {
        this._state = state;
    }

    public async testSaveAndLoad(): Promise<void> {
        await this._state.save(null, KEY1, VALUE1);
        await this._state.save(null, KEY2, VALUE2);

        let val = await this._state.load(null, KEY1)
        assert.isNotNull(val);
        assert.equal(VALUE1, val);

        let values = await this._state.loadBulk(null, [KEY2]);
        assert.lengthOf(values, 1);
        assert.equal(KEY2, values[0].key);
        assert.equal(VALUE2, values[0].value);
    }

    public async testDelete(): Promise<void> {
        await this._state.save(null, KEY1, VALUE1);

        await this._state.delete(null, KEY1);

        let val = await this._state.load(null, KEY1);
        assert.isNull(val || null);
    }

}
