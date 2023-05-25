const assert = require('chai').assert;

import { ConfigParams } from 'pip-services4-components-node';

import { CredentialParams } from '../../src/auth/CredentialParams';
import { MemoryCredentialStore } from '../../src/auth/MemoryCredentialStore';

suite('MemoryCredentialStore', ()=> {

    test('Lookup and store test', async () => {
		let config = ConfigParams.fromTuples(
			'key1.user', 'user1',
			'key1.pass', 'pass1',
			'key2.user', 'user2',
			'key2.pass', 'pass2'
		);

		let credentialStore = new MemoryCredentialStore();
		credentialStore.readCredentials(config);

		let cred1 = await credentialStore.lookup('123', 'key1');
		let cred2 = await credentialStore.lookup('123', 'key2');

		assert.equal(cred1.getUsername(), "user1");
		assert.equal(cred1.getPassword(), "pass1");
		assert.equal(cred2.getUsername(), "user2");
		assert.equal(cred2.getPassword(), "pass2");

		let credConfig = CredentialParams.fromTuples(
			'user', 'user3',
			'pass', 'pass3',
			'access_id', '123'
		);

		await credentialStore.store(null, 'key3', credConfig);

		let cred3 = await credentialStore.lookup('123', 'key3');

		assert.equal(cred3.getUsername(), "user3");
		assert.equal(cred3.getPassword(), "pass3");
		assert.equal(cred3.getAccessId(), "123");
    });    

});