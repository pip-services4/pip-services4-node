/** @module auth */
import { IContext } from 'pip-services4-components-node';
import { CredentialParams } from './CredentialParams';

/**
 * Interface for credential stores which are used to store and lookup credentials
 * to authenticate against external services.
 * 
 * @see [[CredentialParams]]
 * @see [[ConnectionParams]]
 */
export interface ICredentialStore {
    /**
     * Stores credential parameters into the store.
     *
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential.
     * @param credential        a credential to be stored.
     */
    store(context: IContext, key: String, credential: CredentialParams): Promise<void>;

    /**
     * Lookups credential parameters by its key.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential.
     * @returns                 a found credential.
     */
    lookup(context: IContext, key: string): Promise<CredentialParams>;
}