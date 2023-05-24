"use strict";
/** @module run */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifier = void 0;
/**
 * Helper class that notifies components.
 *
 * [[INotifiable]]
 */
class Notifier {
    /**
     * Notifies specific component.
     *
     * To be notiied components must implement [[INotifiable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param component 		the component that is to be notified.
     * @param args              notifiation arguments.
     *
     * @see [[INotifiable]]
     */
    static notifyOne(correlationId, component, args) {
        if (typeof component.notify === "function") {
            component.notify(correlationId, args);
        }
    }
    /**
     * Notifies multiple components.
     *
     * To be notified components must implement [[INotifiable]] interface.
     * If they don't the call to this method has no effect.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param components 		a list of components that are to be notified.
     * @param args              notification arguments.
     *
     * @see [[notifyOne]]
     * @see [[INotifiable]]
     */
    static notify(correlationId, components, args) {
        if (components == null)
            return;
        for (let component of components) {
            Notifier.notifyOne(correlationId, component, args);
        }
    }
}
exports.Notifier = Notifier;
//# sourceMappingURL=Notifier.js.map