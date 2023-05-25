/** @module auth */
import { ConfigParams, IContext, IReconfigurable } from 'pip-services4-components-node';
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
export declare class MemoryCredentialStore implements ICredentialStore, IReconfigurable {
    private _items;
    /**
     * Creates a new instance of the credential store.
     *
     * @param config    (optional) configuration with credential parameters.
     */
    constructor(config?: ConfigParams);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Reads credentials from configuration parameters.
     * Each section represents an individual CredentialParams
     *
     * @param config   configuration parameters to be read
     */
    readCredentials(config: ConfigParams): void;
    /**
     * Stores credential parameters into the store.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param credential        a credential parameters to be stored.
     */
    store(context: IContext, key: string, credential: CredentialParams): Promise<void>;
    /**
     * Lookups credential parameters by its key.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param callback          callback function that receives found credential parameters or error.
     */
    lookup(context: IContext, key: string): Promise<CredentialParams>;
}
