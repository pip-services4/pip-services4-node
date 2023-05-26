/** @module build */
import { IFactory } from 'pip-services4-components-node';
import { CompositeFactory } from 'pip-services4-components-node';
import { DefaultObservabilityFactory } from 'pip-services4-observability-node';
import { DefaultConfigFactory } from 'pip-services4-config-node';
import { DefaultLogicFactory } from 'pip-services4-logic-node';
import { DefaultContextFactory } from 'pip-services4-components-node';
import { DefaultTestFactory } from '../test/DefaultTestFactory';

/**
 * Creates default container components (loggers, counters, caches, locks, etc.) by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/info.defaultinfofactory.html DefaultInfoFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/log.defaultloggerfactory.html DefaultLoggerFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/count.defaultcountersfactory.html DefaultCountersFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/config.defaultconfigreaderfactory.html DefaultConfigReaderFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/cache.defaultcachefactory.html DefaultCacheFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/auth.defaultcredentialstorefactory.html DefaultCredentialStoreFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.defaultdiscoveryfactory.html DefaultDiscoveryFactory]] (in the PipServices "Components" package)
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/test.defaulttestfactory.html DefaultTestFactory]] (in the PipServices "Components" package)
 */
export class DefaultContainerFactory extends CompositeFactory {
    /**
	 * Create a new instance of the factory and sets nested factories.
     * 
     * @param factories     a list of nested factories
	 */
    public constructor(...factories: IFactory[]) {
        super(...factories);

        this.add(new DefaultContextFactory());
        this.add(new DefaultObservabilityFactory());
        this.add(new DefaultLogicFactory());
        this.add(new DefaultConfigFactory());
        this.add(new DefaultTestFactory());
    }

}
