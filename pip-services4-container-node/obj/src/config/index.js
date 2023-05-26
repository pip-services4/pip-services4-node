"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerConfigReader = exports.ContainerConfig = exports.ComponentConfig = void 0;
/**
 * @module config
 *
 * Todo: Rewrite the description.
 *
 * @preferred
 * Container configuration serves as a recipe for instantiating and
 * configuring components inside the container.
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
 */
var ComponentConfig_1 = require("./ComponentConfig");
Object.defineProperty(exports, "ComponentConfig", { enumerable: true, get: function () { return ComponentConfig_1.ComponentConfig; } });
var ContainerConfig_1 = require("./ContainerConfig");
Object.defineProperty(exports, "ContainerConfig", { enumerable: true, get: function () { return ContainerConfig_1.ContainerConfig; } });
var ContainerConfigReader_1 = require("./ContainerConfigReader");
Object.defineProperty(exports, "ContainerConfigReader", { enumerable: true, get: function () { return ContainerConfigReader_1.ContainerConfigReader; } });
//# sourceMappingURL=index.js.map