import { IStringIdentifiable } from 'pip-services4-commons-node';

export class Dummy implements IStringIdentifiable {
    public id: string;
    public key: string;
    public content: string;
}