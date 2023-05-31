"use strict";
/** @module util */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineRange = exports.getLinesUpToIndex = exports.getFileExtension = void 0;
const getFileExtension = (filename) => {
    const fileExtensionRegex = /(?:\.([^.]+))?$/;
    const fileExtension = fileExtensionRegex.exec(filename)[1];
    return fileExtension;
};
exports.getFileExtension = getFileExtension;
const getLinesUpToIndex = (file, index) => {
    if (!index)
        return 0;
    const fileUpToIndex = file.substring(0, index);
    return fileUpToIndex.split('\n').length - 1;
};
exports.getLinesUpToIndex = getLinesUpToIndex;
/*
Given a file and a string, find the line number of the string in the file.

Args:
    file: The file that we're searching in.
    searchingText: The text to search for.
    position: The position in the file to start searching from.
Returns:
    A LineRange object.
*/
const getLineRange = (file, searchingText, postition = 0) => {
    const charAtStart = file.indexOf(searchingText, postition);
    const fileUpToStart = file.substring(0, charAtStart);
    const fileUpToEnd = file.substring(0, charAtStart + searchingText.length);
    return {
        lineStart: fileUpToStart.split('\n').length - 1,
        lineEnd: fileUpToEnd.split('\n').length - 1,
    };
};
exports.getLineRange = getLineRange;
//# sourceMappingURL=Helpers.js.map