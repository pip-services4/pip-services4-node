# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Observability Components for Node.js / ES2017 Changelog

## <a name="0.0.1"></a> 0.0.1 (2023-05-24) 
Extracted the code from components module in Pip.Services 3

### New Features:
* **log** package with Logger components
* **count** package with Performance Counter components
* **trace** package with Tracer components

### Breaking changes:
* Replaced **correlationId** with **context**
* Merged default factories under **DefaultObservabilityFactory**
