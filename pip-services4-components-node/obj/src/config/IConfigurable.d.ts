/** @module config */
import { ConfigParams } from './ConfigParams';
/**
 * An interface to set configuration parameters to an object.
 *
 * It can be added to any existing class by implementing a single <code>configure()</code> method.
 *
 * If you need to emphasis the fact that <code>configure()</code> method can be called multiple times
 * to change object configuration in runtime, use [[IReconfigurable]] interface instead.
 *
 * @see [[ConfigParams]]
 *
 * ### Example ###
 *
 *     export class MyClass implements IConfigurable {
 *         private _myParam: string = "default value";
 *
 *         public configure(config: ConfigParams): void  {
 *             this._myParam = config.getAsStringWithDefault("options.param", myParam);
 *             ...
 *         }
 *     }
 */
export interface IConfigurable {
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
}
