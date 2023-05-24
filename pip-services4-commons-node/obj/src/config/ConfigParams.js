"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParams = void 0;
/** @module config */
const StringValueMap_1 = require("../data/StringValueMap");
const RecursiveObjectReader_1 = require("../reflect/RecursiveObjectReader");
/**
 * Contains a key-value map with configuration parameters.
 * All values stored as strings and can be serialized as JSON or string forms.
 * When retrieved the values can be automatically converted on read using GetAsXXX methods.
 *
 * The keys are case-sensitive, so it is recommended to use consistent C-style as: <code>"my_param"</code>
 *
 * Configuration parameters can be broken into sections and subsections using dot notation as:
 * <code>"section1.subsection1.param1"</code>. Using GetSection method all parameters from specified section
 * can be extracted from a ConfigMap.
 *
 * The ConfigParams supports serialization from/to plain strings as:
 * <code>"key1=123;key2=ABC;key3=2016-09-16T00:00:00.00Z"</code>
 *
 * ConfigParams are used to pass configurations to [[IConfigurable]] objects.
 * They also serve as a basis for more concrete configurations such as [[https://pip-services4-node.github.io/pip-services4-components-node/classes/connect.connectionparams.html ConnectionParams]]
 * or [[https://pip-services4-node.github.io/pip-services4-components-node/classes/auth.credentialparams.html CredentialParams]] (in the Pip.Services components package).
 *
 * @see [[IConfigurable]]
 * @see [[StringValueMap]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "section1.key1", "AAA",
 *         "section1.key2", 123,
 *         "section2.key1", true
 *     );
 *
 *     config.getAsString("section1.key1"); // Result: AAA
 *     config.getAsInteger("section1.key1"); // Result: 0
 *
 *     section1 = config.getSection("section1");
 *     section1.toString(); // Result: key1=AAA;key2=123
 *
 */
class ConfigParams extends StringValueMap_1.StringValueMap {
    /**
     * Creates a new ConfigParams and fills it with values.
     *
     * @param values 	(optional) an object to be converted into key-value pairs to initialize this config map.
     *
     * @see [[StringValueMap.constructor]]
     */
    constructor(values = null) {
        super(values);
    }
    /**
     * Gets a list with all 1st level section names.
     *
     * @returns a list of section names stored in this ConfigMap.
     */
    getSectionNames() {
        let sections = [];
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                let pos = key.indexOf('.');
                let section = key;
                if (pos > 0) {
                    section = key.substring(0, pos);
                }
                // Perform case sensitive search
                let found = false;
                for (let index = 0; index < sections.length; index++) {
                    if (section == sections[index]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sections.push(section);
                }
            }
        }
        return sections;
    }
    /**
     * Gets parameters from specific section stored in this ConfigMap.
     * The section name is removed from parameter keys.
     *
     * @param section	name of the section to retrieve configuration parameters from.
     * @returns 		all configuration parameters that belong to the section named 'section'.
     */
    getSection(section) {
        let result = new ConfigParams();
        let prefix = section + ".";
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                // Prevents exception on the next line
                if (key.length < prefix.length) {
                    continue;
                }
                // Perform case sensitive match
                let keyPrefix = key.substring(0, prefix.length);
                if (keyPrefix == prefix) {
                    let name = key.substring(prefix.length);
                    result.put(name, this[key]);
                }
            }
        }
        return result;
    }
    /**
     * Adds parameters into this ConfigParams under specified section.
     * Keys for the new parameters are appended with section dot prefix.
     *
     * @param section 			name of the section where add new parameters
     * @param sectionParams 	new parameters to be added.
     */
    addSection(section, sectionParams) {
        if (section == null) {
            throw new Error("Section name cannot be null");
        }
        if (sectionParams != null) {
            for (let key in sectionParams) {
                if (sectionParams.hasOwnProperty(key)) {
                    let name = key;
                    if (name.length > 0 && section.length > 0) {
                        name = section + "." + name;
                    }
                    else if (name.length == 0) {
                        name = section;
                    }
                    let value = sectionParams[key];
                    this.put(name, value);
                }
            }
        }
    }
    /**
     * Overrides parameters with new values from specified ConfigParams
     * and returns a new ConfigParams object.
     *
     * @param configParams		ConfigMap with parameters to override the current values.
     * @returns					a new ConfigParams object.
     *
     * @see [[setDefaults]]
     */
    override(configParams) {
        let map = StringValueMap_1.StringValueMap.fromMaps(this, configParams);
        return new ConfigParams(map);
    }
    /**
     * Set default values from specified ConfigParams and returns a new ConfigParams object.
     *
     * @param defaultConfigParams	ConfigMap with default parameter values.
     * @returns						a new ConfigParams object.
     *
     * @see [[override]]
     */
    setDefaults(defaultConfigParams) {
        let map = StringValueMap_1.StringValueMap.fromMaps(defaultConfigParams, this);
        return new ConfigParams(map);
    }
    /**
     * Creates a new ConfigParams object filled with key-value pairs from specified object.
     *
     * @param value		an object with key-value pairs used to initialize a new ConfigParams.
     * @returns			a new ConfigParams object.
     */
    static fromValue(value) {
        let map = RecursiveObjectReader_1.RecursiveObjectReader.getProperties(value);
        return new ConfigParams(map);
    }
    /**
     * Creates a new ConfigParams object filled with provided key-value pairs called tuples.
     * Tuples parameters contain a sequence of key1, value1, key2, value2, ... pairs.
     *
     * @param tuples	the tuples to fill a new ConfigParams object.
     * @returns			a new ConfigParams object.
     *
     * @see [[StringValueMap.fromTuplesArray]]
     */
    static fromTuples(...tuples) {
        let map = StringValueMap_1.StringValueMap.fromTuplesArray(tuples);
        return new ConfigParams(map);
    }
    /**
     * Creates a new ConfigParams object filled with key-value pairs serialized as a string.
     *
     * @param line 		a string with serialized key-value pairs as "key1=value1;key2=value2;..."
     * 					Example: "Key1=123;Key2=ABC;Key3=2016-09-16T00:00:00.00Z"
     * @returns			a new ConfigParams object.
     *
     * @see [[StringValueMap.fromString]]
     */
    static fromString(line) {
        let map = StringValueMap_1.StringValueMap.fromString(line);
        return new ConfigParams(map);
    }
    /**
     * Merges two or more ConfigParams into one. The following ConfigParams override
     * previously defined parameters.
     *
     * @param configs 	a list of ConfigParams objects to be merged.
     * @returns			a new ConfigParams object.
     *
     * @see [[StringValueMap.fromMaps]]
     */
    static mergeConfigs(...configs) {
        let map = StringValueMap_1.StringValueMap.fromMaps(...configs);
        return new ConfigParams(map);
    }
}
exports.ConfigParams = ConfigParams;
//# sourceMappingURL=ConfigParams.js.map