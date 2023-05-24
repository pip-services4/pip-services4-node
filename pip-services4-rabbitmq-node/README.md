# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> RabbitMQ specific components for Node.js / ES2017

This library is a part of [Pip.Services](https://github.com/pip-services/pip-services) project.
The RabbitMQ module contains a set of components for working with the message queue in RabbitMQ through the AMQP protocol.

The module contains the following packages:
- **Build** - Factory for constructing module components
- **Connect** - Components for creating and configuring a connection with RabbitMQ
- **Queues** - Message Queuing components that implement the standard [Messaging](https://github.com/pip-services4-gox/pip-services4-messaging-gox) module interface

<a name="links"></a> Quick links:

* [Configuration](http://docs.pipservices.org/conceptual/configuration/component_configuration/)
* [API Reference](https://pip-services4-node.github.io/pip-services4-rabbitmq-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](http://docs.pipservices.org/get_help/)
* [Contribute](http://docs.pipservices.org/contribute/)

## Use

Install the NPM package as
```bash
npm install pip-services4-rabbitmq-node --save
```

## Develop

For development you shall install the following prerequisites:
* Node.js 14+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The Node.js version of Pip.Services is created and maintained by **Sergey Seroukhov**
