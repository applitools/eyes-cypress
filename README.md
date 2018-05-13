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
Add this to your `pluginsFile` (normally, this is `cypress/plugins/index.js`):
```
require '@applitools/eyes.cypress'
```

### Install custom commands
Add this to your `supportFile` (normally, this is `cypress/support/index.js`):
```
import '@applitools/eyes.cypress/commands
```

### API key
Run your cypress tests with the environment variable `APPLITOOLS_API_KEY` set to the API key you have from Applitools Eyes.

## Usage
After completing all of the above, you will be able to use the following commands to take screenshots during tests and use Applitools Eyes to manage them:

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

## Advanced configuration
### Plugin port
The `eyes.cypress` package uses a local server for communication between the browser and the node plugin. The port used is `7373` by default, but that may be altered.

##### Default port
The basic usage described above looks like this (this is done in the `pluginsFile`):
```
require('@applitools/eyes.cypress')
```

##### Custom port
In some cases, the `7373` port might be unavailable, so in order to use a different port, you may do the following:
```
require('@applitools/eyes.cypress')({ port: 8484 })
```
When doing so, it's also necessary to pass the port as a `Cypress` config variable to the browser, so in the `pluginsFile` add a property named `eyesPort` to your configuration:
```
module.exports = () => {
  ...
  return { eyesPort: 8484, ... };
}
```

##### Available port
If you want to be absolutely sure that `eyes` will use an available port, it's also possible to pass `0` as the port:
```
const { getEyesPort } = require('@applitools/eyes.cypress')({ port: 0 });
const eyesPort = await getEyesPort();
```
Now it is guaranteed that `eyesPort` is available. Don't forget to return it from `module.exports`, like in the case for custom port above.