/** @module convert */

/**
 * Codes for the data types that can be
 * converted using [[TypeConverter]].
 * 
 * @see [[TypeConverter]]
 */
export enum TypeCode {
	Unknown,
	String,
	Boolean,
	Integer,
	Long,
	Float,
	Double,
	DateTime,
	Duration,
	Object,
	Enum,
	Array,
	Map,
}
