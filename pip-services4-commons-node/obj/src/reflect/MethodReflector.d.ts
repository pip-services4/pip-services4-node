/** @module reflect */
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
export declare class MethodReflector {
    private static matchMethod;
    /**
     * Checks if object has a method with specified name..
     *
     * @param obj 	an object to introspect.
     * @param name 	a name of the method to check.
     * @returns true if the object has the method and false if it doesn't.
     */
    static hasMethod(obj: any, name: string): boolean;
    /**
     * Invokes an object method by its name with specified parameters.
     *
     * @param obj 	an object to invoke.
     * @param name 	a name of the method to invoke.
     * @param args 	a list of method arguments.
     * @returns the result of the method invocation or null if method returns void.
     */
    static invokeMethod(obj: any, name: string, ...args: any[]): any;
    /**
     * Gets names of all methods implemented in specified object.
     *
     * @param obj   an objec to introspect.
     * @returns a list with method names.
     */
    static getMethodNames(obj: any): string[];
}
