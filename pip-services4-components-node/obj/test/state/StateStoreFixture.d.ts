import { IStateStore } from '../../src/state/IStateStore';
export declare class StateStoreFixture {
    private _state;
    constructor(state: IStateStore);
    testSaveAndLoad(): Promise<void>;
    testDelete(): Promise<void>;
}
