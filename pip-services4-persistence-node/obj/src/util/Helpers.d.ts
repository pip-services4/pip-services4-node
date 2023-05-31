/** @module util */
import { LineRange } from "./LineRange";
export declare const getFileExtension: (filename: string) => string;
export declare const getLinesUpToIndex: (file: string, index: number | null) => number;
export declare const getLineRange: (file: string, searchingText: string, postition?: number) => LineRange;
