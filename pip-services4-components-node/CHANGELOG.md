# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Component definitions for Node.js / ES2017 Changelog

## <a name="1.4.3"></a> 1.4.3 (2023-05-23) 

- Updated API for **MemoryDiscovery**

## <a name="1.4.2"></a> 1.4.2 (2023-02-07) 

### Features
* Updated dependencies

## <a name="1.4.1"></a> 1.4.1 (2022-02-23) 

### Bug fixes
* Fixed MemoryCredentialStore
* Fixed CredentialParams.manyFromConfig
* Fixed MemoryDiscovery class
* Fixed MemoryCredentialStore.lookup

## <a name="1.4.0"></a> 1.4.0 (2021-10-24) 

Added state management components

### Features
* **state** Added IStateStore interface and StateValue class
* **state** Added NullStateStore class
* **trace** Added MemoryStateStore class
* **trace** Added DefaultStateStoreFactory class

## <a name="1.2.0"></a> 1.2.0 (2021-04-09) 

Added tracing components, that offer a combination of logging and counters for called operations.

### Features
* **trace** Added NullTracer class
* **trace** Added LogTracer class
* **trace** Added CachedTracer class
* **trace** Added CompositeTracer class
* Added tracer to Component class

## <a name="1.1.0"></a> 1.1.0 (2021-03-26) 

### Features
* **connect** Added CompositeConnectionResolver class
* **connect** Added ConnectionUtils class

## <a name="1.0.0"></a> 1.0.0 (2021-03-21) 

Migrated from pip-services4-components-node and converted to ES2017 with async/await

### Features
* No new features

### Breaking changes
* Replaced callbacks with promises
