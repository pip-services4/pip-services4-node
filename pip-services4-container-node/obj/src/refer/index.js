"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedReferences = exports.RunReferencesDecorator = exports.LinkReferencesDecorator = exports.BuildReferencesDecorator = exports.ReferencesDecorator = exports.ContainerReferences = void 0;
/**
 * @module refer
 *
 * Todo: Rewrite the description.
 *
 * @preferred
 * Provides the inversion of control design pattern but does not contain the fully
 * functional container (we can just only create a class that will set various references).
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
 * after which objects that implement the [[https://pip-services4-node.github.io/pip-services4-commons-node/interfaces/refer.iunreferenceable.html IUnreferencable interface]]
 * delete various links between objects, and, finally, the contains destroys all objects and turns off.
 *
 * [[BuildReferencesDecorator Build]], [[LinkReferencesDecorator Link]], and
 * [[RunReferencesDecorator Run]] - ReferenceDecorators are used during the corresponding
 * building, linking, and running stages and are united in [[ManagedReferences]], which
 * are extended by [[ContainerReferences]].
*/
var ContainerReferences_1 = require("./ContainerReferences");
Object.defineProperty(exports, "ContainerReferences", { enumerable: true, get: function () { return ContainerReferences_1.ContainerReferences; } });
var ReferencesDecorator_1 = require("./ReferencesDecorator");
Object.defineProperty(exports, "ReferencesDecorator", { enumerable: true, get: function () { return ReferencesDecorator_1.ReferencesDecorator; } });
var BuildReferencesDecorator_1 = require("./BuildReferencesDecorator");
Object.defineProperty(exports, "BuildReferencesDecorator", { enumerable: true, get: function () { return BuildReferencesDecorator_1.BuildReferencesDecorator; } });
var LinkReferencesDecorator_1 = require("./LinkReferencesDecorator");
Object.defineProperty(exports, "LinkReferencesDecorator", { enumerable: true, get: function () { return LinkReferencesDecorator_1.LinkReferencesDecorator; } });
var RunReferencesDecorator_1 = require("./RunReferencesDecorator");
Object.defineProperty(exports, "RunReferencesDecorator", { enumerable: true, get: function () { return RunReferencesDecorator_1.RunReferencesDecorator; } });
var ManagedReferences_1 = require("./ManagedReferences");
Object.defineProperty(exports, "ManagedReferences", { enumerable: true, get: function () { return ManagedReferences_1.ManagedReferences; } });
//# sourceMappingURL=index.js.map