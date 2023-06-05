const assert = require('chai').assert;

import { FilterParams, PagingParams } from 'pip-services4-data-node';
import { IDummyClient } from './IDummyClient';

export class DummyClientFixture {
    private _client: IDummyClient;

    public constructor(client: IDummyClient) {
        this._client = client;
    }

    public async testCrudOperations() {
        let dummy1 = { id: null, key: "Key 1", content: "Content 1" };
        let dummy2 = { id: null, key: "Key 2", content: "Content 2" };

        // Create one dummy
        let dummy = await this._client.createDummy(null, dummy1);
        assert.isObject(dummy);
        assert.equal(dummy.content, dummy1.content);
        assert.equal(dummy.key, dummy1.key);

        dummy1 = dummy;

        // Create another dummy
        dummy = await this._client.createDummy(null, dummy2);
        assert.isObject(dummy);
        assert.equal(dummy.content, dummy2.content);
        assert.equal(dummy.key, dummy2.key);

        dummy2 = dummy;

        // Get all dummies
        let dummies = await this._client.getDummies(
            null,
            new FilterParams(),
            new PagingParams(0, 5, false)
        );
        assert.isObject(dummies);
        assert.isTrue(dummies.data.length >= 2);

        // Update the dummy
        dummy1.content = 'Updated Content 1';
        dummy = await this._client.updateDummy(null, dummy1);
        assert.isObject(dummy);
        assert.equal(dummy.content, 'Updated Content 1');
        assert.equal(dummy.key, dummy1.key);

        dummy1 = dummy;

        // Delete dummy
        await this._client.deleteDummy(null, dummy1.id);

        // Try to get delete dummy
        dummy = await this._client.getDummyById(null, dummy1.id);
        assert.isNull(dummy || null);
    }

}
