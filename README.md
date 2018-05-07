# Eyes.Cypress
Applitoos Eyes SDK for [Cypress](https://www.cypress.io/).

## Installation
### Set environment variable
Add your Applitools API key to your environment variables as `APPLITOOLS_API_KEY`.

### Install npm package
Install eyes.cypress as a local dev dependency in your tested project:
```
npm install --save-dev @applitools/eyes.cypress
```

### Install eyes.cypress plugin
In your cypress `pluginsFile` (normally, this is `cypress/plugins/index.js`) add the following:
1) Import the eyes.cypress plugin at the top of the file:
```
const {startServer} = require '@applitools/eyes.cypress'
```
2) If `module.exports` is not yet an async function, change it to be one. For example:
```
modules.exports = async () => {...}
```
3) Add the following to the exported function:
```
const {eyesPort} = await startServer()
```
4) Return `eyesPort` from the exported function. For example:
```
return {eyesPort};
```

### Install custom commands
Add this to your `supportFile` (normally, this is `cypress/support/index.js`):
```
import '@applitools/eyes.cypress/commands
```

## Usage
After completing all of the above, it is possible to use the following commands to take screenshots during tests and use Applitools Eyes to manage them:

### Open
This will start a session with the Applitools server. It should be called for each test, so that all screenshots for each test are grouped together.
```
cy.eyesOpen(appName, testName, { width, height })
```

### Check window
This will take a screenshot of your application at the moment of calling, and upload it to Applitools Eyes for matcing against the baseline.
```
cy.eyesCheckWindow()
```

### Close
This will close the session that was started with the `eyesOpen` call. It is important to call this at the end (or `after()`) each test, symmetrically to `eyesOpen`.
```
cy.eyesClose()
```