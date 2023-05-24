"use strict";
/** @module reflect */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodReflector = void 0;
/**
 * Helper class to perform method introspection and dynamic invocation.
 *
 * This class has symmetric implementation across all languages supported
 * by Pip.Services toolkit and used to support dynamic data processing.
 *
 * Because all languages have different casing and case sensitivity rules,
 * this MethodReflector treats all method names as case insensitive.
 *
 * ### Example ###
 *
 *     let myObj = new MyObject();
 *
 *     let methods = MethodReflector.getMethodNames();
 *     MethodReflector.hasMethod(myObj, "myMethod");
 *     MethodReflector.invokeMethod(myObj, "myMethod", 123);
 */
class MethodReflector {
    static matchMethod(methodName, methodValue, expectedName) {
        if (typeof methodValue !== "function")
            return false;
        if (methodName == "constructor")
            return false;
        if (methodName.startsWith('_'))
            return false;
        if (expectedName == null)
            return true;
        return methodName.toLowerCase() == expectedName;
    }
    /**
     * Checks if object has a method with specified name..
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the method to check.
     * @returns true if the object has the method and false if it doesn't.
     */
    static hasMethod(obj, name) {
        if (obj == null) {
            throw new Error("Object cannot be null");
        }
        if (name == null) {
            throw new Error("Method name cannot be null");
        }
        name = name.toLowerCase();
        while (obj != null && Object.getPrototypeOf(obj) != null) {
            let properties = Object.getOwnPropertyNames(obj);
            for (let method of properties) {
                let methodValue = obj[method];
                if (MethodReflector.matchMethod(method, methodValue, name)) {
                    return true;
                }
            }
            obj = Object.getPrototypeOf(obj);
        }
        return false;
    }
    /**
     * Invokes an object method by its name with specified parameters.
     *
     * @param obj 	an object to invoke.
     * @param name 	a name of the method to invoke.
     * @param args 	a list of method arguments.
     * @returns the result of the method invocation or null if method returns void.
     */
    static invokeMethod(obj, name, ...args) {
        if (obj == null) {
            throw new Error("Object cannot be null");
        }
        if (name == null) {
            throw new Error("Method name cannot be null");
        }
        name = name.toLowerCase();
        while (obj != null && Object.getPrototypeOf(obj) != null) {
            let properties = Object.getOwnPropertyNames(obj);
            for (let method of properties) {
                let methodValue = obj[method];
                try {
                    if (MethodReflector.matchMethod(method, methodValue, name)) {
                        return methodValue.apply(obj, args);
                    }
                }
                catch (ex) {
                    // Ignore exceptions
                }
            }
            obj = Object.getPrototypeOf(obj);
        }
        return null;
    }
    /**
     * Gets names of all methods implemented in specified object.
     *
     * @param obj   an objec to introspect.
     * @returns a list with method names.
     */
    static getMethodNames(obj) {
        let methods = [];
        while (obj != null && Object.getPrototypeOf(obj) != null) {
            let properties = Object.getOwnPropertyNames(obj);
            for (let method of properties) {
                let methodValue = obj[method];
                if (MethodReflector.matchMethod(method, methodValue, null)) {
                    methods.push(method);
                }
            }
            obj = Object.getPrototypeOf(obj);
        }
        return methods;
    }
}
exports.MethodReflector = MethodReflector;
//# sourceMappingURL=MethodReflector.js.map