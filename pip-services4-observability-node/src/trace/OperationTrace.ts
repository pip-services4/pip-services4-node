/** @module trace */
import { ErrorDescription } from 'pip-services4-commons-node';

/**
 * Data object to store captured operation traces.
 * This object is used by [[CachedTracer]].
 */
export class OperationTrace {	
	/** The time when operation was executed */
	public time: Date;
	/** The source (context name) */
	public source: string;
	/** The name of component */
	public component: string;
	/** The name of the executed operation */
	public operation: string;
	/** The transaction id to trace execution through call chain. */
	public trace_id: string;
	/** The duration of the operation in milliseconds */
	public duration: number;
	/** 
	 * The description of the captured error
	 * 
	 * [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/errors.errordescription.html ErrorDescription]] 
	 * [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/errors.applicationexception.html ApplicationException]] 
	 */
	public error: ErrorDescription;
}
