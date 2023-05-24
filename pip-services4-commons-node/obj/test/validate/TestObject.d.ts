import { TestSubObject } from './TestSubObject';
export declare class TestObject {
    constructor();
    private privateField;
    private privateProperty;
    intField: number;
    stringProperty: string;
    nullProperty: any;
    intArrayProperty: number[];
    stringListProperty: string[];
    mapProperty: {
        [key: string]: number;
    };
    subObjectProperty: TestSubObject;
    subArrayProperty: TestSubObject[];
}
