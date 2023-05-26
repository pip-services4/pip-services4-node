import { IReferences } from 'pip-services4-components-node';
import { RestOperations } from './RestOperations';
export declare class AboutOperations extends RestOperations {
    private _contextInfo;
    setReferences(references: IReferences): void;
    getAboutOperation(): (req: any, res: any) => void;
    private getNetworkAddresses;
    about(req: any, res: any): void;
}
