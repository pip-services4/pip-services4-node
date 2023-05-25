"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionResolver = exports.NameResolver = exports.ConfigParams = void 0;
/**
 * @module config
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains the implementation of the config design pattern. The [[IConfigurable configurable interface]]
 * contains just one method - "configure", which takes [[ConfigParams]] as a parameter (extends
 * [[StringValueMap]] class). If any object needs to be configurable, we implement this interface
 * and parse the ConfigParams that the method received.
 */
var ConfigParams_1 = require("./ConfigParams");
Object.defineProperty(exports, "ConfigParams", { enumerable: true, get: function () { return ConfigParams_1.ConfigParams; } });
var NameResolver_1 = require("./NameResolver");
Object.defineProperty(exports, "NameResolver", { enumerable: true, get: function () { return NameResolver_1.NameResolver; } });
var OptionResolver_1 = require("./OptionResolver");
Object.defineProperty(exports, "OptionResolver", { enumerable: true, get: function () { return OptionResolver_1.OptionResolver; } });
//# sourceMappingURL=index.js.map