import { IScanner } from '../../src/io/IScanner';
export declare class ScannerFixture {
    private _scanner;
    private _content;
    constructor(scanner: IScanner, content: string);
    testRead(): void;
    testUnread(): void;
    testLineColumn(position: number, charAt: number, line: number, column: number): void;
}
