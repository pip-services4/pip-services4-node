/** @module auth */
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
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential.
     * @param credential        a credential to be stored.
     */
    store(correlationId: string, key: String, credential: CredentialParams): Promise<void>;
    /**
     * Lookups credential parameters by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential.
     * @returns                 a found credential.
     */
    lookup(correlationId: string, key: string): Promise<CredentialParams>;
}
