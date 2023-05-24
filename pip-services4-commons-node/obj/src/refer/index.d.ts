/**
 * @module refer
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Inversion of control design pattern. There exist various implementations,
 * a popular one being "inversion of dependency". Requires introspection and
 * is implemented differently in different languages. In PipServices, the "location
 * design pattern” is used, which is much simpler than dependency injection and is
 * a simple implementation, that is portable between languages. Used for building
 * various containers, as well as testing objects.
 */
export { Descriptor } from './Descriptor';
export { DependencyResolver } from './DependencyResolver';
export { IReferences } from './IReferences';
export { IReferenceable } from './IReferenceable';
export { IUnreferenceable } from './IUnreferenceable';
export { Reference } from './Reference';
export { Referencer } from './Referencer';
export { References } from './References';
export { ReferenceException } from './ReferenceException';
