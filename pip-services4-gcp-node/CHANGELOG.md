# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200">
<br/> Google Cloud Platform specific components for Node.js / ES2017 Changelog

## <a name="1.1.0"></a> 1.1.0 (2023-03-01)

### Breaking changes
* Renamed descriptors for services:
    - "\*:service:gcp-function\*:1.0" -> "\*:service:cloudfunc\*:1.0"
    - "\*:service:commandable-gcp-function\*:1.0" -> "\*:service:commandable-cloudfunc\*:1.0"

### Features
- Updated dependencies

## <a name="1.0.5"></a> 1.0.5 (2022-09-07)

### Features
* Added interceptors by command name and regex
* Added more config parameters for clients

### Bug Fixes
* Fixed error responses

## <a name="1.0.1-1.0.4"></a> 1.0.1-1.0.4 (2022-03-09)

### Bug Fixes
- Fixed imports 
- Fixed schemas validation
- Fixed error processing
- Fixed docs


## <a name="1.0.0"></a> 1.0.0 (2022-02-15)

### Features
- **clients** - client components for working with Google Cloud Platform
- **connect** - components of installation and connection settings
- **container** - components for creating containers for Google server-side functions
- **services** - contains interfaces and classes used to create Google services