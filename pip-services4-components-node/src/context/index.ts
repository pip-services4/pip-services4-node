/** 
 * @module context 
 * 
 * Todo: Rewrite the description
 * 
 * @preferred
 * Contains a simple object that defines the context of execution. For various 
 * logging functions we need to know what source we are logging from – what is 
 * the processes name, what the process is/does. 
 */
export { IContext } from './IContext';
export { Context } from './Context';
export { ContextResolver } from './ContextResolver';
export { ContextInfo } from './ContextInfo';
export { DefaultContextFactory } from './DefaultContextFactory';