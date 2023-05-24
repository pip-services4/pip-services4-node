# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> MQTT Messaging for Pip/Services in Node.js Changelog / ES2017

## <a name="3.1.0"></a> 3.1.0 (2021-03-24)

Migrated to a new messaging model

### Features
* **build** - Added MqttMessageQueueFactory component
* **connect** - Added MqttConnection component
* **queues** - Reimplemented the queue to work with shared connection
* **queues** - Added serialize_envelope option to queue to send JSON messages
* **queues** - Added autosubscribe option

## <a name="3.0.0"></a> 3.0.0 (2018-11-03)

Initial public release

### Features
* **build** - factory default implementation
* **connect** - components for setting up the connection to the MQTT broker
* **queues** - components of working with a message queue via the MQTT protocol

### Bug Fixes
No fixes in this version

