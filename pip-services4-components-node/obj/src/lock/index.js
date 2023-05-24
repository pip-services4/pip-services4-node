"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLockFactory = exports.MemoryLock = exports.NullLock = exports.Lock = void 0;
var Lock_1 = require("./Lock");
Object.defineProperty(exports, "Lock", { enumerable: true, get: function () { return Lock_1.Lock; } });
var NullLock_1 = require("./NullLock");
Object.defineProperty(exports, "NullLock", { enumerable: true, get: function () { return NullLock_1.NullLock; } });
var MemoryLock_1 = require("./MemoryLock");
Object.defineProperty(exports, "MemoryLock", { enumerable: true, get: function () { return MemoryLock_1.MemoryLock; } });
var DefaultLockFactory_1 = require("./DefaultLockFactory");
Object.defineProperty(exports, "DefaultLockFactory", { enumerable: true, get: function () { return DefaultLockFactory_1.DefaultLockFactory; } });
//# sourceMappingURL=index.js.map