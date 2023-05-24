"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStateStoreFactory = exports.MemoryStateStore = exports.NullStateStore = exports.StateEntry = void 0;
/**
 * @module state
 *
 * Todo: Rewrite the description
 *
 * @preferred
 * Abstract implementation of various distributed states. We can save an object
 * to state and retrieve it object by its key, using various implementations.
 */
var StateEntry_1 = require("./StateEntry");
Object.defineProperty(exports, "StateEntry", { enumerable: true, get: function () { return StateEntry_1.StateEntry; } });
var NullStateStore_1 = require("./NullStateStore");
Object.defineProperty(exports, "NullStateStore", { enumerable: true, get: function () { return NullStateStore_1.NullStateStore; } });
var MemoryStateStore_1 = require("./MemoryStateStore");
Object.defineProperty(exports, "MemoryStateStore", { enumerable: true, get: function () { return MemoryStateStore_1.MemoryStateStore; } });
var DefaultStateStoreFactory_1 = require("./DefaultStateStoreFactory");
Object.defineProperty(exports, "DefaultStateStoreFactory", { enumerable: true, get: function () { return DefaultStateStoreFactory_1.DefaultStateStoreFactory; } });
//# sourceMappingURL=index.js.map