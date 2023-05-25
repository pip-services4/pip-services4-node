"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReflector = exports.TypeMatcher = exports.TypeDescriptor = exports.RecursiveObjectWriter = exports.RecursiveObjectReader = exports.PropertyReflector = exports.ObjectWriter = exports.ObjectReader = exports.MethodReflector = void 0;
/**
 * @module reflect
 *
 * Todo: Rewrite this descriptor
 *
 * @preferred
 * Contains classes for data reflection. Reflects objects into parameters, methods.
 * Most programming languages contain reflections, but they are all implemented
 * differently. In the PipService framework, dynamic data types are often used. So as
 * to not rewrite these dynamic data types differently for each language,
 * this cross-language reflection package was written. All dynamic data types that are
 * built on top of this package are portable from one language to another.
 */
var MethodReflector_1 = require("./MethodReflector");
Object.defineProperty(exports, "MethodReflector", { enumerable: true, get: function () { return MethodReflector_1.MethodReflector; } });
var ObjectReader_1 = require("./ObjectReader");
Object.defineProperty(exports, "ObjectReader", { enumerable: true, get: function () { return ObjectReader_1.ObjectReader; } });
var ObjectWriter_1 = require("./ObjectWriter");
Object.defineProperty(exports, "ObjectWriter", { enumerable: true, get: function () { return ObjectWriter_1.ObjectWriter; } });
var PropertyReflector_1 = require("./PropertyReflector");
Object.defineProperty(exports, "PropertyReflector", { enumerable: true, get: function () { return PropertyReflector_1.PropertyReflector; } });
var RecursiveObjectReader_1 = require("./RecursiveObjectReader");
Object.defineProperty(exports, "RecursiveObjectReader", { enumerable: true, get: function () { return RecursiveObjectReader_1.RecursiveObjectReader; } });
var RecursiveObjectWriter_1 = require("./RecursiveObjectWriter");
Object.defineProperty(exports, "RecursiveObjectWriter", { enumerable: true, get: function () { return RecursiveObjectWriter_1.RecursiveObjectWriter; } });
var TypeDescriptor_1 = require("./TypeDescriptor");
Object.defineProperty(exports, "TypeDescriptor", { enumerable: true, get: function () { return TypeDescriptor_1.TypeDescriptor; } });
var TypeMatcher_1 = require("./TypeMatcher");
Object.defineProperty(exports, "TypeMatcher", { enumerable: true, get: function () { return TypeMatcher_1.TypeMatcher; } });
var TypeReflector_1 = require("./TypeReflector");
Object.defineProperty(exports, "TypeReflector", { enumerable: true, get: function () { return TypeReflector_1.TypeReflector; } });
//# sourceMappingURL=index.js.map