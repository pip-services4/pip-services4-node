/** @module count */
import { Descriptor } from 'pip-services4-components-node';
import { Factory } from 'pip-services4-components-node';

import { NullCounters } from '../count/NullCounters';
import { LogCounters } from '../count/LogCounters';
import { CompositeCounters } from '../count/CompositeCounters';
import { NullLogger } from '../log/NullLogger';
import { ConsoleLogger } from '../log/ConsoleLogger';
import { CompositeLogger } from '../log/CompositeLogger';
import { NullTracer } from '../trace/NullTracer';
import { LogTracer } from '../trace/LogTracer';
import { CompositeTracer } from '../trace/CompositeTracer';

/**
 * Creates observability components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
export class DefaultObservabilityFactory extends Factory {
    private static readonly NullCountersDescriptor = new Descriptor("pip-services", "counters", "null", "*", "1.0");
    private static readonly LogCountersDescriptor = new Descriptor("pip-services", "counters", "log", "*", "1.0");
    private static readonly CompositeCountersDescriptor = new Descriptor("pip-services", "counters", "composite", "*", "1.0");
    private static readonly NullLoggerDescriptor = new Descriptor("pip-services", "logger", "null", "*", "1.0");
    private static readonly ConsoleLoggerDescriptor = new Descriptor("pip-services", "logger", "console", "*", "1.0");
    private static readonly CompositeLoggerDescriptor = new Descriptor("pip-services", "logger", "composite", "*", "1.0");
    private static readonly NullTracerDescriptor = new Descriptor("pip-services", "tracer", "null", "*", "1.0");
    private static readonly LogTracerDescriptor = new Descriptor("pip-services", "tracer", "log", "*", "1.0");
    private static readonly CompositeTracerDescriptor = new Descriptor("pip-services", "tracer", "composite", "*", "1.0");

    /**
     * Create a new instance of the factory.
     */
    public constructor() {
        super();
        this.registerAsType(DefaultObservabilityFactory.NullCountersDescriptor, NullCounters);
        this.registerAsType(DefaultObservabilityFactory.LogCountersDescriptor, LogCounters);
        this.registerAsType(DefaultObservabilityFactory.CompositeCountersDescriptor, CompositeCounters);
        this.registerAsType(DefaultObservabilityFactory.NullLoggerDescriptor, NullLogger);
        this.registerAsType(DefaultObservabilityFactory.ConsoleLoggerDescriptor, ConsoleLogger);
        this.registerAsType(DefaultObservabilityFactory.CompositeLoggerDescriptor, CompositeLogger);
        this.registerAsType(DefaultObservabilityFactory.NullTracerDescriptor, NullTracer);
        this.registerAsType(DefaultObservabilityFactory.LogTracerDescriptor, LogTracer);
        this.registerAsType(DefaultObservabilityFactory.CompositeTracerDescriptor, CompositeTracer);
    }
}