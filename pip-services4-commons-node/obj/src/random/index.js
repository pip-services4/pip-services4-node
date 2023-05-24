"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomText = exports.RandomString = exports.RandomDateTime = exports.RandomArray = exports.RandomBoolean = exports.RandomDouble = exports.RandomFloat = exports.RandomInteger = void 0;
/**
 * @module random
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains implementation of random value generators that are used for
 * functional as well as non-functional testing. Used to generate random
 * objects and fill databases with unique objects.
 */
var RandomInteger_1 = require("./RandomInteger");
Object.defineProperty(exports, "RandomInteger", { enumerable: true, get: function () { return RandomInteger_1.RandomInteger; } });
var RandomFloat_1 = require("./RandomFloat");
Object.defineProperty(exports, "RandomFloat", { enumerable: true, get: function () { return RandomFloat_1.RandomFloat; } });
var RandomDouble_1 = require("./RandomDouble");
Object.defineProperty(exports, "RandomDouble", { enumerable: true, get: function () { return RandomDouble_1.RandomDouble; } });
var RandomBoolean_1 = require("./RandomBoolean");
Object.defineProperty(exports, "RandomBoolean", { enumerable: true, get: function () { return RandomBoolean_1.RandomBoolean; } });
var RandomArray_1 = require("./RandomArray");
Object.defineProperty(exports, "RandomArray", { enumerable: true, get: function () { return RandomArray_1.RandomArray; } });
var RandomDateTime_1 = require("./RandomDateTime");
Object.defineProperty(exports, "RandomDateTime", { enumerable: true, get: function () { return RandomDateTime_1.RandomDateTime; } });
var RandomString_1 = require("./RandomString");
Object.defineProperty(exports, "RandomString", { enumerable: true, get: function () { return RandomString_1.RandomString; } });
var RandomText_1 = require("./RandomText");
Object.defineProperty(exports, "RandomText", { enumerable: true, get: function () { return RandomText_1.RandomText; } });
//# sourceMappingURL=index.js.map