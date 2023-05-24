"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringScanner_1 = require("../../src/io/StringScanner");
const ScannerFixture_1 = require("./ScannerFixture");
suite('StringScanner', () => {
    let content;
    let scanner;
    let fixture;
    setup(() => {
        content = "Test String\nLine2\rLine3\r\n\r\nLine5";
        scanner = new StringScanner_1.StringScanner(content);
        fixture = new ScannerFixture_1.ScannerFixture(scanner, content);
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
//# sourceMappingURL=StringScanner.test.js.map