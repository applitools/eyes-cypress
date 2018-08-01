# Eyes.Cypress

Applitoos Eyes SDK for [Cypress](https://www.cypress.io/).

## Installation

### Install npm package

Install Eyes.Cypress as a local dev dependency in your tested project:

```bash
npm install --save-dev @applitools/eyes.cypress
```

### Configure plugin and commands

#### Automatic configuration

Run the following command in your terminal:

```bash
npx eyes-setup
```

The above command will add the necessary imports to your cypress `pluginsFile` and `supportFile`, as described in the manual configuration below.

#### Manual configuration

##### Configure Eyes.Cypress plugin

Eyes.Cypress acts as a [Cypress plugin](https://docs.cypress.io/guides/tooling/plugins-guide.html), so it should be configured as such.
Unfortunately there's no easy way to do this automatically, so you need to manually add the following code to your `pluginsFile`:

**Important**: add this code **after** the definition of `module.exports`:

```js
require('@applitools/eyes.cypress')(module)
```

Normally, this is `cypress/plugins/index.js`. You can read more about it in Cypress' docs [here](https://docs.cypress.io/guides/references/configuration.html#Folders-Files).

##### Configure custom commands

Eyes.Cypress exposes new commands to your tests. This means that more methods will be available on the `cy` object. To enable this, it's required to configure these custom commands.
As with the plugin, there's no automatic way to configure this in cypress, so you need to manually add the following code to your `supportFile`:

```js
import '@applitools/eyes.cypress/commands'
```

Normally, this is `cypress/support/index.js`. You can read more about it in Cypress' docs [here](https://docs.cypress.io/guides/references/configuration.html#Folders-Files).

### Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes.Cypress SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To to this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npx cypress open
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx cypress open
```

## Usage

After completing the configuation (either automatic or manual) and defining the API key, you will be able to use commands from Eyes.Cypress in your cypress tests to take screenshots and use Applitools Eyes to manage them:

### Example

```js
describe('Hello world', () => {
  it('works', () => {
    cy.visit('https://applitools.com/helloworld');
    cy.eyesOpen({
      appName: 'Hello World!',
      testName: 'My first JavaScript test!',
      browser: { width: 800, height: 600 },
    });
    cy.eyesCheckWindow('Main Page');
    cy.get('button').click();
    cy.eyesCheckWindow('Click!');
    cy.eyesClose();
  });
});
```

### Commands

In addition to the built-in commands provided by Cypress, like `cy.visit` and `cy.get`, Eyes.Cypress defines new custom commands, which enable the visual testing with Applitools Eyes. These commands are:

#### Open

Create an Applitools test.
This will start a session with the Applitools server.

```js
cy.eyesOpen({
  appName: '',
  testName: ''
});
```

It's possible to pass a config object to `eyesOpen` with all the possible configuration properties. Read the [Advanced configuration] section for a detailed description.

#### Check window

Generate a screenshot of the current page and add it to the Applitools Test.

```js
cy.eyesCheckWindow(tag)

OR

cy.eyesCheckWindow({ tag: 'your tag', sizeMode: 'your size mode' })
```

##### Arguments to `cy.eyesCheckWindow`

- `tag` (optional): A logical name for this check.
- `sizeMode` (optional): Possible values are `viewport` or `full-page`. The default is `full-page`, which means a screenshot of everything that exists in the DOM at the point of calling `eyesCheckWindow` will be rendered. If set to `viewport`, only a screenshot the size of the browser will be rendered (the size of the browser can be set in the call to `cy.eyesOpen` - see advanced configuration below).

#### Close

close the applitools test and check that all screenshots are valid.

It is important to call this at the end (or `after()`) each test, symmetrically to `eyesOpen`.

```js
cy.eyesClose({ timeout });
```

##### Arguments to `cy.eyesClose`

- `timeout` (optional): Depending on various factors such as the website's size and number of screenshots (i.e. the number of calls to `cy.eyesCheckWindow()`), the elapsed time it takes for `cy.eyesClose` to complete may vary. The default timeout is `120000` (2 minutes), and it's possible to pass a different value for cases where this need to be larger (e.g. `180000` for setting the timeout to 3 minutes).

## Advanced configuration

It's possible to define the following configuration for tests:

| Property name             | Default value               | Description   |
| -------------             |:-------------:              |:-----------   |
| `testName`                | ''                          | Test name     |
| `browser`                 | { width: 800, height: 600 } | The size of the generated screenshots. This doesn't need to be the same as the size of the browser that Cypress is running.  It's also possible to send an array of sizes:<br/><br/>It's also possible to send an array of sizes, e.g. `[{width: 800, height: 600}, { width: 1024, height: 768 }]`|
| `showLogs`                | false                       | Whether or not you want to see logs of the Eyes.Cypress plugin. Logs are written to the same output of the Cypress process. |
| `saveDebugData`           | false                       | Whether to save troubleshooting data. See the troubleshooting section of this doc for more info. |
| `batchId`                 | random                      | Provides ability to group tests into batches. Read more about batches [here](https://applitools.com/docs/topics/working-with-test-batches/how-to-group-tests-into-batches.html). |
| `batchName`               | undefined                   | Provides a name to the batch. |
| `baselineEnvName`         | undefined                   | The name of the environment of the baseline. |
| `envName`                 | undefined                   | A name for the environment in which the application under test is running. |
| `ignoreCaret`             | false                       | Whether to ignore or the blinking caret or not when comparing images. |
| `isDisabled`              | false                       | If true, all calls to Eyes.Cypress commandswill be silently ignored. |
| `matchLevel`              | undefined                   | The test-wide match level to use when checking application screenshot with the expected output. Possible values are `Strict`, `Exact`, `Layout` and `Content`. Read more about match levels [here](http://support.applitools.com/customer/portal/articles/2088359). |
| `matchTimeout`            | undefined                   | Sets the maximum time (in ms) a match operation tries to perform a match. |
| `branchName`              | undefined                   | The name of the branch. |
| `baselineBranchName`      | undefined                   | The name of the baseline branch. |
| `parentBranchName`        | undefined                   | Sets the branch under which new branches are created. |
| `proxy`                   | undefined                   | Sets the proxy settings to be used in network requests to Eyes server. |
| `saveFailedTests`         | false                       | Set whether or not failed tests are saved by default. |
| `saveNewTests`            | false                       | Set whether or not new tests are saved by default. |
| `serverUrl`               | Default Eyes server URL     | The URL of Eyes server |
| `compareWithParentBranch` | false                       |  |
| `ignoreBaseline`          | false                       |  |

There are 3 ways to specify test configuration:
1) Arguments to `cy.eyesOpen()`
2) Environment variables
3) The `eyes.json` file

The list above is also the order of precedence, which means that if you pass a property to `cy.eyesOpen` it will override the environment variable, and the environment variable will override the value defined in the `eyes.json` file.

### Method 1: Arguments for `cy.eyesOpen`

Pass a config object as the only argument. For example:

```js
cy.eyesOpen({
  appName: 'My app',
  showLogs: true,
  batchName: 'My batch',
  ...
  // all other configuration variables apply
})
```

### Method 2: Environment variables

The name of the corresponding environment variable is in uppercase, with the `APPLITOOLS_` prefix, and separating underscores instead of camel case:

```js
APPLITOOLS_APP_NAME
APPLITOOLS_SHOW_LOGS
APPLITOOLS_BATCH_NAME
...
// all other configuration variables apply
```

### Method 3: The `eyes.json` file

It's possible to have a file called `eyes.json` at the same folder location as `cypress.json`. In this file specify the desired configuration, in a valid JSON format. For example:

```js
{
  "appName": "My app",
  "showLogs": true,
  "batchName": "My batch"
  ...
  // all other configuration variables apply
}
```

### Plugin port

The Eyes.Cypress SDK has 2 parts: (1) a cypress plugin, and (2) custom commands that run in the browser. The SDK uses a local server for communication between those 2 parts. The plugin is responsible for starting the server, and the custom commands send requests to this server operate the SDK.

By default, the server listens at port `7373` , but that may be altered for cases where this port is already taken.

#### Option 1: Default port

When configuring the plugin as described in the section 'Configure Eyes.Cypress plugin' above, the port that will be used is `7373`:

```js
require('@applitools/eyes.cypress')(module)
```

#### Option 2: Custom port

In some cases, the `7373` port might be unavailable, so in order to use a different port, you may do the following:

```js
require('@applitools/eyes.cypress')(module, { port: 8484 })
```

#### Option 3: Available port

If you want to be absolutely sure that Eyes.Cypress will use an available port, it's also possible to pass `0` as the port:

```js
require('@applitools/eyes.cypress')({ port: 0 });
```

Now it is guaranteed that `eyesPort` is available.

## Troubleshooting

If issues occur, the `saveDebugData` config property can be set to true in order to save helpful information. The information will be saved under a folder named `.applitools` in the current working directory. This could be then used for getting support on your issue.
