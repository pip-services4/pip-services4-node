const assert = require('chai').assert;

import { IContext } from "../../src/context/IContext";
import { INotifiable } from '../../src/exec/INotifiable';
import { FixedRateTimer } from '../../src/run/FixedRateTimer';

suite('FixedRateTimer', ()=> {
    
    test('Run with task', (done) => {
        let counter = 0;

        let timer = new FixedRateTimer({
            notify: (context: IContext) => {
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

        let timer = new FixedRateTimer(() => {
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