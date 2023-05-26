"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module core
 *
 * Todo: Rewrite the description.
 *
 * @preferred
 * Contains implementation of the inversion of control container, which creates objects
 * and controls their lifecycle(*) using various configurations.
 *
 * Using generic containers, we can create more specialized containers – one of which is the process
 * container. It represents a system process, receives its configuration file via the command line,
 * and creates a container, starts it, reads its configuration, recreates objects, runs them, and then,
 * after pressing ctrl-c, turns off and destroys the objects.
 *
 * Another example of containers are lambda functions, service fabric containers, and so on.
 *
 * ### (*) Compont lifecycle: ###
 *
 * External configurations (stored as YAML or JSON) are passed to the container
 * and define the structure of objects that need to be recreated in the container.
 * Objects can be defined in two ways:
 * - using descriptors (using which registered factories can recreate the object)
 * - using hard-coded types (objects are recreated directly, based on their type, bypassing
 * factories).
 *
 * In addition, various configurations are stored for each object. The container recreates the
 * objects and, if they implement the IConfigurable interface, passes them their configurations.
 *
 * Once the objects of a container are configured, if they implement the [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.ireferenceable.html IReferencable interface]],
 * they are passed a set of references for recreating links between objects in the container. If
 * objects implement the [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iopenable.html IOpenable interface]],
 * the <code>open()</code> method is called and they
 * start to work. Connections to various services are made, after which the objects start, the
 * container starts running, and the objects carry out their tasks. When the container
 * starts to close, the objects that implement the [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/run.iclosable.html ICloseable interface]]
 * are closed via their
 * <code>close()</code> method (which should make them stop working and disconnect from other services),
 * after which objects that implement the [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferencable interface]] delete various links between
 * objects, and, finally, the contains destroys all objects and turns off.
 */
__exportStar(require("./build"), exports);
__exportStar(require("./config"), exports);
__exportStar(require("./refer"), exports);
__exportStar(require("./containers"), exports);
__exportStar(require("./test"), exports);
//# sourceMappingURL=index.js.map