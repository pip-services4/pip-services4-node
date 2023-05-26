"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const FixedRateTimer_1 = require("../../src/exec/FixedRateTimer");
suite('FixedRateTimer', () => {
    test('Run with task', (done) => {
        let counter = 0;
        let timer = new FixedRateTimer_1.FixedRateTimer({
            notify: (context) => {
                counter++;
            }
        }, 100, 0);
        timer.start();
        setTimeout(() => {
            timer.stop();
            assert.isTrue(counter > 3);
            done();
        }, 500);
    });
    test('Run with callback', (done) => {
        let counter = 0;
        let timer = new FixedRateTimer_1.FixedRateTimer(() => {
            counter++;
        }, 100, 0);
        timer.start();
        setTimeout(() => {
            timer.stop();
            assert.isTrue(counter > 3);
            done();
        }, 500);
    });
});
//# sourceMappingURL=FixedRateTimer.test.js.map