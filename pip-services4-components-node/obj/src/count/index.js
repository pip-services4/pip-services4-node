"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCountersFactory = exports.Counter = exports.CounterType = exports.CompositeCounters = exports.LogCounters = exports.NullCounters = exports.CachedCounters = exports.CounterTiming = void 0;
/**
 * @module count
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Performance counters. They show non-functional characteristics about how the code works,
 * like: times called, response time, objects saved/processed. Using these numbers, we can
 * show how the code works in the system – how stable, fast, expandable it is.
 */
var CounterTiming_1 = require("./CounterTiming");
Object.defineProperty(exports, "CounterTiming", { enumerable: true, get: function () { return CounterTiming_1.CounterTiming; } });
var CachedCounters_1 = require("./CachedCounters");
Object.defineProperty(exports, "CachedCounters", { enumerable: true, get: function () { return CachedCounters_1.CachedCounters; } });
var NullCounters_1 = require("./NullCounters");
Object.defineProperty(exports, "NullCounters", { enumerable: true, get: function () { return NullCounters_1.NullCounters; } });
var LogCounters_1 = require("./LogCounters");
Object.defineProperty(exports, "LogCounters", { enumerable: true, get: function () { return LogCounters_1.LogCounters; } });
var CompositeCounters_1 = require("./CompositeCounters");
Object.defineProperty(exports, "CompositeCounters", { enumerable: true, get: function () { return CompositeCounters_1.CompositeCounters; } });
var CounterType_1 = require("./CounterType");
Object.defineProperty(exports, "CounterType", { enumerable: true, get: function () { return CounterType_1.CounterType; } });
var Counter_1 = require("./Counter");
Object.defineProperty(exports, "Counter", { enumerable: true, get: function () { return Counter_1.Counter; } });
var DefaultCountersFactory_1 = require("./DefaultCountersFactory");
Object.defineProperty(exports, "DefaultCountersFactory", { enumerable: true, get: function () { return DefaultCountersFactory_1.DefaultCountersFactory; } });
//# sourceMappingURL=index.js.map