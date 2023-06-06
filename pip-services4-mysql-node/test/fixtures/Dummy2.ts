import { IIdentifiable } from "pip-services4-data-node";

export class Dummy2 implements IIdentifiable<number> {
    public id: number;
    public key: string;
    public content: string;
}