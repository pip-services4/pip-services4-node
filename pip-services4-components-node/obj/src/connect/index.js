"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionUtils = exports.CompositeConnectionResolver = exports.DefaultDiscoveryFactory = exports.MemoryDiscovery = exports.ConnectionResolver = exports.ConnectionParams = void 0;
/**
 * @module connect
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains implementation of connection parameters, using various connection strings,
 * which are stripped of all credentials. If we need to configure a service, the port,
 * ip address, protocol, and other parameters – we use the ConnectionParams object, and
 * relevant helper classes (like [[ConnectionResolver]]), for acquiring these parameters,
 * and for discovery of objects, components (which store and retrieve connection parameters).
 *
 * ### Discovery ###
 *
 * Service that store a registry of various end-points (what services are where, and how to
 * connect to them). It knows the end-points, but doesn't have the credentials to connect to them.
 * Separated for security reasons.
 *
 * [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] – interface for creating registries.
 *
 * [[MemoryDiscovery]] – registry that is stored in memory.
 *
 * There exist 2 types of discovery:
 * - Static discovery: all services have static IP addresses (like DNS, which also works using static
 * discovery) that are configured from the start and don't change along the way. As of lately, used
 * more often than dynamic, because it is simpler to use and more reliable.
 *     - Proxy (or reverse proxy) is created with a dns name, and all the dynamics of
 *     starting/restarting/switching from one host to another – everything is nice and clear
 *     for the clients. Infrastructure does all the hard work out of the box.
 *     - Configure sets the static registry.
 *
 * - Dynamic discovery: every time a service starts, it registers its address in the discovery
 * service ("Service name" at the following address "IP"). Clients then ask to resolve the address
 * by which the requested service can be reached. The service has a general name, by which other
 * services can resolve it.
 *     - If a service stops working, you need to refresh its address, clean stale addresses,
 *     heartbeats must be used – lots of problems and challenges.
 *
 * One service can have more than one address.
 */
var ConnectionParams_1 = require("./ConnectionParams");
Object.defineProperty(exports, "ConnectionParams", { enumerable: true, get: function () { return ConnectionParams_1.ConnectionParams; } });
var ConnectionResolver_1 = require("./ConnectionResolver");
Object.defineProperty(exports, "ConnectionResolver", { enumerable: true, get: function () { return ConnectionResolver_1.ConnectionResolver; } });
var MemoryDiscovery_1 = require("./MemoryDiscovery");
Object.defineProperty(exports, "MemoryDiscovery", { enumerable: true, get: function () { return MemoryDiscovery_1.MemoryDiscovery; } });
var DefaultDiscoveryFactory_1 = require("./DefaultDiscoveryFactory");
Object.defineProperty(exports, "DefaultDiscoveryFactory", { enumerable: true, get: function () { return DefaultDiscoveryFactory_1.DefaultDiscoveryFactory; } });
var CompositeConnectionResolver_1 = require("./CompositeConnectionResolver");
Object.defineProperty(exports, "CompositeConnectionResolver", { enumerable: true, get: function () { return CompositeConnectionResolver_1.CompositeConnectionResolver; } });
var ConnectionUtils_1 = require("./ConnectionUtils");
Object.defineProperty(exports, "ConnectionUtils", { enumerable: true, get: function () { return ConnectionUtils_1.ConnectionUtils; } });
//# sourceMappingURL=index.js.map