"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedRateTimer = exports.Notifier = exports.Executor = exports.Cleaner = exports.Closer = exports.Opener = exports.Parameters = void 0;
/**
 * @module run
 *
 * Todo: Rewrite this description.
 *
 * @preferred
 * Contains design patterns for the standard lifecycle of objects (opened,
 * closed, openable, closable, runnable). Helper classes for lifecycle provisioning.
 */
var Parameters_1 = require("./Parameters");
Object.defineProperty(exports, "Parameters", { enumerable: true, get: function () { return Parameters_1.Parameters; } });
var Opener_1 = require("./Opener");
Object.defineProperty(exports, "Opener", { enumerable: true, get: function () { return Opener_1.Opener; } });
var Closer_1 = require("./Closer");
Object.defineProperty(exports, "Closer", { enumerable: true, get: function () { return Closer_1.Closer; } });
var Cleaner_1 = require("./Cleaner");
Object.defineProperty(exports, "Cleaner", { enumerable: true, get: function () { return Cleaner_1.Cleaner; } });
var Executor_1 = require("./Executor");
Object.defineProperty(exports, "Executor", { enumerable: true, get: function () { return Executor_1.Executor; } });
var Notifier_1 = require("./Notifier");
Object.defineProperty(exports, "Notifier", { enumerable: true, get: function () { return Notifier_1.Notifier; } });
var FixedRateTimer_1 = require("./FixedRateTimer");
Object.defineProperty(exports, "FixedRateTimer", { enumerable: true, get: function () { return FixedRateTimer_1.FixedRateTimer; } });
//# sourceMappingURL=index.js.map