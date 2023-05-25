/** @module auth */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { StringValueMap } from 'pip-services4-commons-node';
import { IReconfigurable } from 'pip-services4-commons-node';

import { CredentialParams } from './CredentialParams';
import { ICredentialStore } from './ICredentialStore';

/**
 * Credential store that keeps credentials in memory.
 * 
 * ### Configuration parameters ###
 * 
 * - [credential key 1]:            
 *     - ...                          credential parameters for key 1
 * - [credential key 2]:            
 *     - ...                          credential parameters for key N
 * - ...
 *  
 * @see [[ICredentialStore]]
 * @see [[CredentialParams]]
 * 
 * ### Example ###
 * 
 *     let config = ConfigParams.fromTuples(
 *         "key1.user", "jdoe",
 *         "key1.pass", "pass123",
 *         "key2.user", "bsmith",
 *         "key2.pass", "mypass"
 *     );
 *     
 *     let credentialStore = new MemoryCredentialStore();
 *     credentialStore.readCredentials(config);
 *     
 *     let credential = await credentialStore.lookup("123", "key1");
 *     // Result: user=jdoe;pass=pass123
 */
export class MemoryCredentialStore implements ICredentialStore, IReconfigurable {
    private _items: StringValueMap = new StringValueMap();

    /**
     * Creates a new instance of the credential store.
     * 
     * @param config    (optional) configuration with credential parameters.
     */
    public constructor(config: ConfigParams = null) {
        if (config != null) {
            this.configure(config);
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this.readCredentials(config);
    }

    /**
     * Reads credentials from configuration parameters.
     * Each section represents an individual CredentialParams
     * 
     * @param config   configuration parameters to be read
     */
    public readCredentials(config: ConfigParams) {
        this._items.clear();
        let sections = config.getSectionNames();
        for (let index = 0; index < sections.length; index++) {
            let section = sections[index];
            let value = config.getSection(section);
            this._items.append(CredentialParams.fromTuples(section, value));
        }
    }

    /**
     * Stores credential parameters into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param credential        a credential parameters to be stored.
     */
    public async store(context: IContext, key: string, credential: CredentialParams): Promise<void> {
        if (credential != null) {
            this._items[key] = credential;
        } else {
            delete this._items[key];
        }
    }

    /**
     * Lookups credential parameters by its key.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param callback          callback function that receives found credential parameters or error.
     */
    public async lookup(context: IContext, key: string): Promise<CredentialParams> {
        if (typeof this._items[key] === 'string' || this._items[key] instanceof String) {
            return CredentialParams.fromString(this._items[key]);
        }

        return this._items[key]

    }
}