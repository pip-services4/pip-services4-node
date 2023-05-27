import { ConfigParams } from 'pip-services4-components-node';

import { JsonFilePersister } from '../../src/persistence/JsonFilePersister';
import { DummyMemoryPersistence } from './DummyMemoryPersistence';
import { Dummy } from '../sample/Dummy';

export class DummyFilePersistence extends DummyMemoryPersistence {
	protected _persister: JsonFilePersister<Dummy>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<Dummy>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}