"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceException = exports.References = exports.Referencer = exports.Reference = exports.DependencyResolver = exports.Descriptor = void 0;
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
var Descriptor_1 = require("./Descriptor");
Object.defineProperty(exports, "Descriptor", { enumerable: true, get: function () { return Descriptor_1.Descriptor; } });
var DependencyResolver_1 = require("./DependencyResolver");
Object.defineProperty(exports, "DependencyResolver", { enumerable: true, get: function () { return DependencyResolver_1.DependencyResolver; } });
var Reference_1 = require("./Reference");
Object.defineProperty(exports, "Reference", { enumerable: true, get: function () { return Reference_1.Reference; } });
var Referencer_1 = require("./Referencer");
Object.defineProperty(exports, "Referencer", { enumerable: true, get: function () { return Referencer_1.Referencer; } });
var References_1 = require("./References");
Object.defineProperty(exports, "References", { enumerable: true, get: function () { return References_1.References; } });
var ReferenceException_1 = require("./ReferenceException");
Object.defineProperty(exports, "ReferenceException", { enumerable: true, get: function () { return ReferenceException_1.ReferenceException; } });
//# sourceMappingURL=index.js.map