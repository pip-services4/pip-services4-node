/** @module auth */
import { ConfigParams } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IContext } from 'pip-services4-components-node';
import { CredentialParams } from './CredentialParams';
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
export declare class CredentialResolver {
    private readonly _credentials;
    private _references;
    /**
     * Creates a new instance of credentials resolver.
     *
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    constructor(config?: ConfigParams, references?: IReferences);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Gets all credentials configured in component configuration.
     *
     * Redirect to CredentialStores is not done at this point.
     * If you need fully fleshed credential use [[lookup]] method instead.
     *
     * @returns a list with credential parameters
     */
    getAll(): CredentialParams[];
    /**
     * Adds a new credential to component credentials
     *
     * @param credential    new credential parameters to be added
     */
    add(credential: CredentialParams): void;
    private lookupInStores;
    /**
     * Looks up component credential parameters. If credentials are configured to be retrieved
     * from Credential store it finds a [[ICredentialStore]] and lookups credentials there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a looked up credential.
     */
    lookup(context: IContext): Promise<CredentialParams>;
}
