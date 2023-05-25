"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeFactory = exports.CreateException = exports.Factory = void 0;
/**
 * @module build
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains the "factory design pattern". There are various factory types,
 * which are also implemented in a portable manner.
 */
var Factory_1 = require("./Factory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return Factory_1.Factory; } });
var CreateException_1 = require("./CreateException");
Object.defineProperty(exports, "CreateException", { enumerable: true, get: function () { return CreateException_1.CreateException; } });
var CompositeFactory_1 = require("./CompositeFactory");
Object.defineProperty(exports, "CompositeFactory", { enumerable: true, get: function () { return CompositeFactory_1.CompositeFactory; } });
//# sourceMappingURL=index.js.map