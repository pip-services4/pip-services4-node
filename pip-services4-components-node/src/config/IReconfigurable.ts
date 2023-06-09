/** @module config */
import { IConfigurable } from './IConfigurable';

/**
 * An interface to set configuration parameters to an object.
 * 
 * It is similar to [[IConfigurable]] interface, but emphasises the fact
 * that <code>configure()</code> method can be called more than once to change object configuration
 * in runtime.
 * 
 * @see [[IConfigurable]]
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IReconfigurable extends IConfigurable {
}