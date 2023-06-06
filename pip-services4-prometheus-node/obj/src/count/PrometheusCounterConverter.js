"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusCounterConverter = void 0;
/** @module count */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const CounterType_1 = require("pip-services4-observability-node/obj/src/count/CounterType");
/**
 * Helper class that converts performance counter values into
 * a response from Prometheus metrics controller.
 */
class PrometheusCounterConverter {
    /**
     * Converts the given counters to a string that is returned by Prometheus metrics controller.
     *
     * @param counters  a list of counters to convert.
     * @param source    a source (context) name.
     * @param instance  a unique instance name (usually a host name).
     */
    static toString(counters, source, instance) {
        if (counters == null || counters.length == 0)
            return "";
        let builder = "";
        for (let counter of counters) {
            let counterName = this.parseCounterName(counter);
            let labels = this.generateCounterLabel(counter, source, instance);
            switch (counter.type) {
                case CounterType_1.CounterType.Increment:
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                case CounterType_1.CounterType.Interval:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                case CounterType_1.CounterType.LastValue:
                    builder += "# TYPE " + counterName + " gauge\n";
                    builder += counterName + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.last) + "\n";
                    break;
                case CounterType_1.CounterType.Statistics:
                    builder += "# TYPE " + counterName + "_max gauge\n";
                    builder += counterName + "_max" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.max) + "\n";
                    builder += "# TYPE " + counterName + "_min gauge\n";
                    builder += counterName + "_min" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.min) + "\n";
                    builder += "# TYPE " + counterName + "_average gauge\n";
                    builder += counterName + "_average" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.average) + "\n";
                    builder += "# TYPE " + counterName + "_count gauge\n";
                    builder += counterName + "_count" + labels + " " + pip_services4_commons_node_1.StringConverter.toString(counter.count) + "\n";
                    break;
                //case CounterType.Timestamp: // Prometheus doesn't support non-numeric metrics
                //builder += "# TYPE " + counterName + " untyped\n";
                //builder += counterName + labels + " " + StringConverter.toString(counter.time) + "\n";
                //break;
            }
        }
        return builder;
    }
    static generateCounterLabel(counter, source, instance) {
        let labels = {};
        if (source && source != "")
            labels["source"] = source;
        if (instance && instance != "")
            labels["instance"] = instance;
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        if ((nameParts.length >= 3 && nameParts[2] == "exec_count")
            || (nameParts.length >= 3 && nameParts[2] == "exec_time")
            || (nameParts.length >= 3 && nameParts[2] == "exec_errors")) {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }
        if ((nameParts.length >= 4 && nameParts[3] == "call_count")
            || (nameParts.length >= 4 && nameParts[3] == "call_time")
            || (nameParts.length >= 4 && nameParts[3] == "call_errors")) {
            labels["service"] = nameParts[1];
            labels["command"] = nameParts[2];
            labels["target"] = nameParts[0];
        }
        if ((nameParts.length >= 3 && nameParts[2] == "sent_messages")
            || (nameParts.length >= 3 && nameParts[2] == "received_messages")
            || (nameParts.length >= 3 && nameParts[2] == "dead_messages")) {
            labels["queue"] = nameParts[1];
        }
        if (labels == null || Object.keys(labels).length == 0)
            return "";
        let builder = "{";
        for (let key in labels) {
            if (builder.length > 1)
                builder += ",";
            builder += key + '="' + labels[key] + '"';
        }
        builder += "}";
        return builder;
    }
    static parseCounterName(counter) {
        let replaceAll = (cunterName) => {
            return cunterName.replace(new RegExp('[\.+\/]', 'g'), '_');
        };
        if (counter == null && counter.name == null && counter.name == "")
            return "";
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        // Rest Controller Labels
        if (nameParts.length >= 3 && nameParts[2] == "exec_count") {
            return nameParts[2];
        }
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            return nameParts[2];
        }
        if (nameParts.length >= 3 && nameParts[2] == "exec_errors") {
            return nameParts[2];
        }
        // Rest & Direct Client Labels
        if (nameParts.length >= 4 && nameParts[3] == "call_count") {
            return nameParts[3];
        }
        if (nameParts.length >= 4 && nameParts[3] == "call_time") {
            return nameParts[3];
        }
        if (nameParts.length >= 4 && nameParts[3] == "call_errors") {
            return nameParts[3];
        }
        // Queue Labels
        if ((nameParts.length >= 3 && nameParts[2] == "sent_messages")
            || (nameParts.length >= 3 && nameParts[2] == "received_messages")
            || (nameParts.length >= 3 && nameParts[2] == "dead_messages")) {
            let name = `${nameParts[0]}.${nameParts[2]}`;
            return replaceAll(name.toLowerCase());
        }
        // TODO: are there other assumptions we can make?
        // Or just return as a single, valid name
        return replaceAll(counter.name.toLowerCase());
    }
    static parseCounterLabels(counter, source, instance) {
        let labels = {};
        if (source && source != "")
            labels["source"] = source;
        if (instance && instance != "")
            labels["instance"] = instance;
        let nameParts = counter.name.split('.');
        // If there are other predictable names from which we can parse labels, we can add them below
        if (nameParts.length >= 3 && nameParts[2] == "exec_time") {
            labels["service"] = nameParts[0];
            labels["command"] = nameParts[1];
        }
        return labels;
    }
}
exports.PrometheusCounterConverter = PrometheusCounterConverter;
//# sourceMappingURL=PrometheusCounterConverter.js.map