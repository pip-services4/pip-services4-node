"use strict";
/** @module count */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterType = void 0;
/**
 * Types of counters that measure different types of metrics
 */
var CounterType;
(function (CounterType) {
    /** Counters that measure execution time intervals */
    CounterType[CounterType["Interval"] = 0] = "Interval";
    /** Counters that keeps the latest measured value */
    CounterType[CounterType["LastValue"] = 1] = "LastValue";
    /** Counters that measure min/average/max statistics */
    CounterType[CounterType["Statistics"] = 2] = "Statistics";
    /** Counter that record timestamps */
    CounterType[CounterType["Timestamp"] = 3] = "Timestamp";
    /** Counter that increment counters */
    CounterType[CounterType["Increment"] = 4] = "Increment";
})(CounterType = exports.CounterType || (exports.CounterType = {}));
//# sourceMappingURL=CounterType.js.map