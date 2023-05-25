/** @module auth */
import { ConfigParams } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ReferenceException } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { IContext } from 'pip-services4-components-node';

import { CredentialParams } from './CredentialParams';
import { ICredentialStore } from './ICredentialStore';

/**
 * Helper class to retrieve component credentials.
 * 
 * If credentials are configured to be retrieved from [[ICredentialStore]],
 * it automatically locates [[ICredentialStore]] in component references
 * and retrieve credentials from there using store_key parameter.
 * 
 * ### Configuration parameters ###
 * 
 * __credential:__ 
 * - store_key:                   (optional) a key to retrieve the credentials from [[ICredentialStore]]
 * - ...                          other credential parameters
 * 
 * __credentials:__                   alternative to credential
 * - [credential params 1]:       first credential parameters
 *     - ...                      credential parameters for key 1
 * - ...
 * - [credential params N]:       Nth credential parameters
 *     - ...                      credential parameters for key N
 * 
 * ### References ###
 * 
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 * 
 * @see [[CredentialParams]]
 * @see [[ICredentialStore]]
 * 
 * ### Example ###
 * 
 *     let config = ConfigParams.fromTuples(
 *         "credential.user", "jdoe",
 *         "credential.pass",  "pass123"
 *     );
 *     
 *     let credentialResolver = new CredentialResolver();
 *     credentialResolver.configure(config);
 *     credentialResolver.setReferences(references);
 *     
 *     let credential = credentialResolver.lookup("123");
 *     // Now use the credential...
 * 
 */
export class CredentialResolver {
    private readonly _credentials: CredentialParams[] = [];
    private _references: IReferences = null;

    /**
     * Creates a new instance of credentials resolver.
     * 
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    public constructor(config: ConfigParams = null, references: IReferences = null) {
        if (config != null) {
            this.configure(config);
        }
        if (references != null) {
            this.setReferences(references);
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        let credentials: CredentialParams[] = CredentialParams.manyFromConfig(config);
        this._credentials.push(...credentials);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._references = references;
    }

    /**
     * Gets all credentials configured in component configuration.
     * 
     * Redirect to CredentialStores is not done at this point.
     * If you need fully fleshed credential use [[lookup]] method instead.
     * 
     * @returns a list with credential parameters
     */
    public getAll(): CredentialParams[] {
        return this._credentials;
    }

    /**
     * Adds a new credential to component credentials
     * 
     * @param credential    new credential parameters to be added
     */
    public add(credential: CredentialParams): void {
        this._credentials.push(credential);
    }

    private async lookupInStores(context: IContext, credential: CredentialParams): Promise<CredentialParams> {
        if (!credential.useCredentialStore()) {
            return credential;
        }

        let key: string = credential.getStoreKey();
        if (this._references == null) {
            return null;
        }

        let storeDescriptor = new Descriptor("*", "credential-store", "*", "*", "*")
        let stores = this._references.getOptional<ICredentialStore>(storeDescriptor)
        if (stores.length == 0) {
            throw new ReferenceException(context, storeDescriptor);
        }

        for (let store of stores) {
            let result = await store.lookup(context, key);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    /**
     * Looks up component credential parameters. If credentials are configured to be retrieved
     * from Credential store it finds a [[ICredentialStore]] and lookups credentials there.
     * 
     * @param context     (optional) transaction id to trace execution through call chain.
     * @returns 			    a looked up credential.
     */
    public async lookup(context: IContext): Promise<CredentialParams> {
        if (this._credentials.length == 0) {
            return null;
        }

        let lookupCredentials: CredentialParams[] = [];

        for (let credential of this._credentials) {
            if (!credential.useCredentialStore()) {
                return credential;
            } else {
                lookupCredentials.push(credential);
            }
        }

        for (let credential of lookupCredentials) {
            let result = await this.lookupInStores(context, credential);
            if (result != null) {
                return result;
            }
        }

        return null;
    }
}