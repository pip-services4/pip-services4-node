import { IStringIdentifiable } from "pip-services4-data-node";

export class Dummy implements IStringIdentifiable {
    public id: string;
    public key: string;
    public content: string;
}