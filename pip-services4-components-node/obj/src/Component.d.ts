/**
 * @module component
 * @preferred
 * The root package of pip-services-components.
 */
import { ConfigParams } from 'pip-services4-commons-node';
import { IConfigurable } from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { IReferenceable } from 'pip-services4-commons-node';
import { DependencyResolver } from 'pip-services4-commons-node';
import { CompositeLogger } from './log/CompositeLogger';
import { CompositeCounters } from './count/CompositeCounters';
import { CompositeTracer } from './trace/CompositeTracer';
/**
 * Abstract component that supportes configurable dependencies, logging
 * and performance counters.
 *
 * ### Configuration parameters ###
 *
 * - __dependencies:__
 *     - [dependency name 1]: Dependency 1 locator (descriptor)
 *     - ...
 *     - [dependency name N]: Dependency N locator (descriptor)
 *
 * ### References ###
 *
 * - <code>\*:counters:\*:\*:1.0</code>     (optional) [[ICounters]] components to pass collected measurements
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[ILogger]] components to pass log messages
 * - <code>\*:tracer:\*:\*:1.0</code>       (optional) [[ITracer]] components to trace executed operations
 * - ...                                    References must match configured dependencies.
 */
export declare class Component implements IConfigurable, IReferenceable {
    protected _dependencyResolver: DependencyResolver;
    protected _logger: CompositeLogger;
    protected _counters: CompositeCounters;
    protected _tracer: CompositeTracer;
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
}
