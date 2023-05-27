/** @module core */
import { IContext } from 'pip-services4-components-node';
import { AnyValueMap } from 'pip-services4-commons-node';

/**
 * Interface for data processing components to update data items partially.
 */
export interface IPartialUpdater<T, K> {
    /**
     * Updates only few selected fields in a data item.
     * 
     * @param context    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @returns                 the updated data item.
     */
    updatePartially(context: IContext, id: K, data: AnyValueMap): Promise<T>;
}
