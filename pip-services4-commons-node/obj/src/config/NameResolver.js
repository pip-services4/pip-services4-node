"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameResolver = void 0;
const Descriptor_1 = require("../refer/Descriptor");
/**
 * A helper class that allows to extract component name from configuration parameters.
 * The name can be defined in "id", "name" parameters or inside a component descriptor.
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "descriptor", "myservice:connector:aws:connector1:1.0",
 *         "param1", "ABC",
 *         "param2", 123
 *     );
 *
 *     let name = NameResolver.resolve(config); // Result: connector1
 */
class NameResolver {
    /**
     * Resolves a component name from configuration parameters.
     * The name can be stored in "id", "name" fields or inside a component descriptor.
     * If name cannot be determined it returns a defaultName.
     *
     * @param config        configuration parameters that may contain a component name.
     * @param defaultName   (optional) a default component name.
     * @returns             resolved name or default name if the name cannot be determined.
     */
    static resolve(config, defaultName = null) {
        let name = config.getAsNullableString("name") || config.getAsNullableString("id");
        if (name == null) {
            let descriptorStr = config.getAsNullableString("descriptor");
            let descriptor = Descriptor_1.Descriptor.fromString(descriptorStr);
            if (descriptor != null) {
                name = descriptor.getName();
            }
        }
        return name || defaultName;
    }
}
exports.NameResolver = NameResolver;
//# sourceMappingURL=NameResolver.js.map