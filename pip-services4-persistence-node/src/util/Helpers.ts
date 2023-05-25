export const getFileExtension = (filename: string): string => {
    const fileExtensionRegex = /(?:\.([^.]+))?$/;
    const fileExtension = fileExtensionRegex.exec(filename)[1];
    return fileExtension;
}

export const getLinesUpToIndex = (file: string, index: number | null): number => {
    if (!index) return 0;

    const fileUpToIndex = file.substring(0, index);
    return fileUpToIndex.split('\n').length - 1;
}

/*
Given a file and a string, find the line number of the string in the file.

Args:
    file: The file that we're searching in.
    searchingText: The text to search for.
    position: The position in the file to start searching from.
Returns:
    A LineRange object.
*/
const getLineRange = (file: string, searchingText: string, postition = 0): LineRange => {
    const charAtStart = file.indexOf(searchingText, postition);
    const fileUpToStart = file.substring(0, charAtStart);

    const fileUpToEnd = file.substring(0, charAtStart + searchingText.length);
    return {
        lineStart: fileUpToStart.split('\n').length - 1,
        lineEnd: fileUpToEnd.split('\n').length - 1,
    }
}


