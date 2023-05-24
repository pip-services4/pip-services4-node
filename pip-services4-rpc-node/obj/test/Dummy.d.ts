import { IStringIdentifiable } from 'pip-services4-commons-node';
import { SubDummy } from './SubDummy';
export declare class Dummy implements IStringIdentifiable {
    constructor(id: string, key: string, content: string, array: Array<SubDummy>);
    id: string;
    key: string;
    content: string;
    array: Array<SubDummy>;
}
