/** 
 * @module config
 * 
 * Todo: Rewrite this description
 * 
 * @preferred
 * Contains the implementation of the config design pattern. The [[IConfigurable configurable interface]] 
 * contains just one method - "configure", which takes [[ConfigParams]] as a parameter (extends 
 * [[StringValueMap]] class). If any object needs to be configurable, we implement this interface 
 * and parse the ConfigParams that the method received.  
 */
export { ConfigParams } from './ConfigParams';
export { IConfigurable } from './IConfigurable';
export { IReconfigurable } from './IReconfigurable';
export { NameResolver } from './NameResolver';
export { OptionResolver } from './OptionResolver';
