/** 
 * @module reflect 
 * 
 * Todo: Rewrite this descriptor
 * 
 * @preferred
 * Contains classes for data reflection. Reflects objects into parameters, methods. 
 * Most programming languages contain reflections, but they are all implemented 
 * differently. In the PipService framework, dynamic data types are often used. So as 
 * to not rewrite these dynamic data types differently for each language, 
 * this cross-language reflection package was written. All dynamic data types that are 
 * built on top of this package are portable from one language to another.  
 */
export { MethodReflector } from './MethodReflector';
export { ObjectReader } from './ObjectReader';
export { ObjectWriter } from './ObjectWriter';
export { PropertyReflector } from './PropertyReflector';
export { RecursiveObjectReader } from './RecursiveObjectReader';
export { RecursiveObjectWriter } from './RecursiveObjectWriter';
export { TypeDescriptor } from './TypeDescriptor';
export { TypeMatcher } from './TypeMatcher';
export { TypeReflector } from './TypeReflector';
