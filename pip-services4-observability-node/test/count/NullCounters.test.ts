import { NullCounters } from '../../src/count/NullCounters';
import { CounterTiming } from '../../src/count/CounterTiming';

suite('NullCounters', ()=> {

    test('Simple Counters', () => {
        let  counters: NullCounters = new NullCounters();

        counters.last("Test.LastValue", 123);
        counters.increment("Test.Increment", 3);
        counters.stats("Test.Statistics", 123);
    });    

    test('Measure Elapsed Time', () => {
        let  counters: NullCounters = new NullCounters();
        
        let timer: CounterTiming = counters.beginTiming("Test.Elapsed");
        timer.endTiming();
    });    

});
