/** @module log */
import { ErrorDescription } from 'pip-services4-commons-node';

/**
 * Data object to store captured log messages.
 * This object is used by [[CachedLogger]].
 */
export class LogMessage {	
	/** The time then message was generated */
	public time: Date;
	/** The source (context name) */
	public source: string;
	/** This log level */
	public level: string;
	/** The transaction id to trace execution through call chain. */
	public trace_id: string;
	/** 
	 * The description of the captured error
	 * 
	 * [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/errors.errordescription.html ErrorDescription]] 
	 * [[https://pip-services4-node.github.io/pip-services4-commons-node/classes/errors.applicationexception.html ApplicationException]] 
	 */
	public error: ErrorDescription;
	/** The human-readable message */
	public message: string;
}