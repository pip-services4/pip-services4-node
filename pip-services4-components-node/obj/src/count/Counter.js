"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
/**
 * Data object to store measurement for a performance counter.
 * This object is used by [[CachedCounters]] to store counters.
 */
class Counter {
    /**
     * Creates a instance of the data obejct
     *
     * @param name      a counter name.
     * @param type      a counter type.
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
exports.Counter = Counter;
//# sourceMappingURL=Counter.js.map