import { StringScanner } from '../../src/io/StringScanner';
import { ScannerFixture } from './ScannerFixture';

suite('StringScanner', ()=> {
    let content: string;
    let scanner: StringScanner;
    let fixture: ScannerFixture;

    setup(() => {
        content = "Test String\nLine2\rLine3\r\n\r\nLine5";
        scanner = new StringScanner(content);
        fixture = new ScannerFixture(scanner, content);
    });

    test('Read', () => {
        fixture.testRead();
    });    

    test('Unread', () => {
        fixture.testUnread();
    });    

    test('LineColumn', () => {
        fixture.testLineColumn(3, 's'.charCodeAt(0), 1, 3);
        fixture.testLineColumn(12, '\n'.charCodeAt(0), 2, 0);
        fixture.testLineColumn(15, 'n'.charCodeAt(0), 2, 3);
        fixture.testLineColumn(21, 'n'.charCodeAt(0), 3, 3);
        fixture.testLineColumn(26, '\r'.charCodeAt(0), 4, 0);
        fixture.testLineColumn(30, 'n'.charCodeAt(0), 5, 3);
    });    

});