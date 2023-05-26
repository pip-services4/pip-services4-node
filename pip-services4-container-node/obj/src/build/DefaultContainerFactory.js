"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultContainerFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_logic_node_1 = require("pip-services4-logic-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const DefaultTestFactory_1 = require("../test/DefaultTestFactory");
const pip_services4_config_node_1 = require("pip-services4-config-node");
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
class DefaultContainerFactory extends pip_services4_components_node_1.CompositeFactory {
    /**
     * Create a new instance of the factory and sets nested factories.
     *
     * @param factories     a list of nested factories
     */
    constructor(...factories) {
        super(...factories);
        this.add(new pip_services4_components_node_2.DefaultContextFactory());
        this.add(new pip_services4_observability_node_1.DefaultObservabilityFactory());
        this.add(new pip_services4_logic_node_1.DefaultLogicFactory());
        this.add(new pip_services4_config_node_1.DefaultConfigFactory());
        this.add(new DefaultTestFactory_1.DefaultTestFactory());
    }
}
exports.DefaultContainerFactory = DefaultContainerFactory;
//# sourceMappingURL=DefaultContainerFactory.js.map