import { ErrorDescription } from './ErrorDescription';
/**
 * Factory to create serializeable [[ErrorDescription]] from [[ApplicationException]]
 * or from arbitrary errors.
 *
 * The ErrorDescriptions are used to pass errors through the wire between microservices
 * implemented in different languages. They allow to restore exceptions on the receiving side
 * close to the original type and preserve additional information.
 *
 * @see [[ErrorDescription]]
 * @see [[ApplicationException]]
 */
export declare class ErrorDescriptionFactory {
    /**
     * Creates a serializable ErrorDescription from error object.
     *
     * @param error  	an error object
     * @returns a serializeable ErrorDescription object that describes the error.
     */
    static create(error: any): ErrorDescription;
}
