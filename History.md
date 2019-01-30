
v3.4.1 / 2019-01-30
===================

  * 3.4.1 
  * 3.4.0 - added failCypressOnDiff to README

v3.3.26 / 2019-01-30
====================

  * 3.3.26
  * Converting env variables of false and 0 to booleans (once eyes-common major is published we can use that).
  * Renamed flag to not fail Cypress to ^CilCypressOnDiff
  * changelog 3.3.25

v3.3.25 / 2019-01-29
====================

  * 3.3.25
  * removed dont fail on diff flag from readme - we might want to change the name
  * changelog 3.3.24

v3.3.24 / 2019-01-29
====================

  * 3.3.24
  * lint test files fix
  * Added tap file config, use tapFilePath to set a path for eyes.tap file to be saved in.
  * Added dontFailOnDiff flag for not failing Cypress tests once a visual test fails.
  * changelog 3.3.23

v3.3.23 / 2019-01-28
====================

  * 3.3.23
  * Renamed git repo from eyes.cypress to eyes-cypress
  * returned eslint to babylon
  * updated changelog and vhangelog command
  * updated changelog (and doing changelog cmd without jq)

v3.3.22 / 2019-01-20
====================

  * 3.3.22
  * Upadated dom-capture to dom-snapshot 1.0.2: Downloading all reasources in browser, if failing on CORS then returning as resourceUrl.

v3.3.21 / 2019-01-20
====================

  * 3.3.21
  * Changed the browser requests going to node to use fetch() and not cy.request().
  * 3.3.20
  * update vgc to get isomorphic version 10
  * add matchLevel arg to checkWindow to readme

v3.3.19 / 2019-01-13
====================

  * 3.3.19
  * returned version nuber to 3.3.18 and removed post version script

v3.4.0 / 2019-01-13
===================

  * 3.4.0
  * adding tag and pushing repo automatically after npm version cmd
  * change isDisabled conflict message, slight refactor, fix eslint issue
  * Passing config to makePlugin now instead of getConfig. Also added it and e2e tests.
  * First commit whoo - WIP - disabling all cmds in the browser if .

v3.3.18 / 2018-12-27
====================

  * 3.3.18
  * bundle only processPage

v3.3.17 / 2018-12-20
====================

  * 3.3.17

v3.3.16 / 2018-12-20
====================

  * 3.3.16
  * update vgc to 9.0.5, dc: 6.1.1 and fix empty content-type issue

v3.3.15 / 2018-12-16
====================

  * 3.3.15
  * package json

v3.3.14 / 2018-12-16
====================

  * 3.3.14
  * update vgc to get lazy apiKey validation
  * changelog
  * Merge pull request #15 from corevo/patch-1
  * docs: examples for css/xpath selectors in checkWindow
  * Added docs about selector types

v3.3.13 / 2018-12-16
====================

  * 3.3.13
  * update dc and vgc to fetch css deps from the browser

v3.3.12 / 2018-12-11
====================

  * 3.3.12
  * update vgc to 8.0.6 to handle null render status

v3.3.11 / 2018-12-11
====================

  * 3.3.11
  * update vgc to 8.0.4 to fix statuser

v3.3.10 / 2018-12-11
====================

  * 3.3.10
  * update vgc to 8.0.2 to get statuser
  * play stuff
  * update readme to reflect config exceptions and add sendDom

v3.3.9 / 2018-12-02
===================

  * 3.3.9
  * update vgc to 7.2.8 and use the correct agentId

v3.3.8 / 2018-12-02
===================

  * 3.3.8
  * update vgc to 7.2.7 to fix unopened transactions

v3.3.7 / 2018-12-02
===================

  * 3.3.7
  * bring the floating region feature to life

v3.3.6 / 2018-11-29
===================

  * 3.3.6
  * fix filtering of failed tests

v3.3.5 / 2018-11-29
===================

  * 3.3.5
  * abort failed tests and add test info for failures in error digest
  * changelog

v3.3.4 / 2018-11-28
===================

  * 3.3.4
  * remove polling from openEyes
  * update vgc to 7.2.4
  * play around
  * add testApp screenshots and videos to gitignore
  * add reference link to concurrency message

v3.3.3 / 2018-11-27
===================

  * 3.3.3
  * update vgc to 7.2.3 to fix render concurrency with failures

v3.3.2 / 2018-11-26
===================

  * 3.3.2
  * update vgc to 7.2.2 to fix hangs in failed renders

v3.3.1 / 2018-11-26
===================

  * 3.3.1

v3.3.0 / 2018-11-26
===================

  * 3.3.0
  * update visual-grid-client to 7.2.1 to get proxy user/pass and perf optimization
  * changelog

v3.2.26 / 2018-11-25
====================

  * 3.2.26
  * work directly with dom-capture

v3.2.25 / 2018-11-25
====================

  * 3.2.25
  * avoid sending blob content twice (no more allBlobs)
  * changelog

v3.2.24 / 2018-11-20
====================

  * 3.2.24
  * update visual-grid-client to 6.0.1 to fix deviceInfo
  * add scriptHooks to readme
  * license
  * play script
  * changelog

v3.2.23 / 2018-11-14
====================

  * 3.2.23
  * update visual-grid-client to 5.5.3 to get sdk-core major version
  * add a changelog
  * add play spec

v3.2.22 / 2018-11-13
====================

  * 3.2.22
  * update visual-grid-client to 5.5.1 to get srcset
  * 3.2.21
  * fix issue with error in close
  * Merge pull request #11 from jennifer-shehane/patch-1
  * Applitoos -> Applitools

v3.2.21 / 2018-11-08
====================

  * 3.2.21
  * fix issue with error in close

v3.2.20 / 2018-11-07
====================

  * 3.2.20
  * update visual-grid-client to 5.4.2 to better validate input

v3.2.19 / 2018-11-06
====================

  * 3.2.19
  * update visual-grid-client to 5.4.1 to get TestResultsStatus

v3.2.18 / 2018-11-06
====================

  * 3.2.18
  * improve error digest to not be daunting

v3.2.17 / 2018-11-05
====================

  * 3.2.17
  * update visual-grid-client to 5.3.11 to fix waitForRenderStatus issue

v3.2.16 / 2018-11-04
====================

  * 3.2.16
  * readme update: add browser name to device name in device emulation

v3.2.15 / 2018-11-03
====================

  * 3.2.15
  * update visual-grid-client to 3.2.15 to fix self reference in cache

v3.2.14 / 2018-10-28
====================

  * 3.2.14
  * show concurrency msg also when specified as a string (env var)

v3.2.13 / 2018-10-28
====================

  * 3.2.13
  * add concurrency message to readme and test output
  * refactor getUrls in play task

v3.2.12 / 2018-10-24
====================

  * 3.2.12
  * update visual-grid-client to 5.3.8 to support recursive resources

v3.2.11 / 2018-10-23
====================

  * 3.2.11
  * update visual-grid-client to 5.3.7 to fix issue with missing resource content
  * sitemap play test
  * bigger timeout for checkWindow in the browser

v3.2.10 / 2018-10-22
====================

  * 3.2.10
  * use beforeEach and afterEach in test.js
  * use polling for openEyes
  * ability to pass args to polling handler's worker

v3.2.9 / 2018-10-22
===================

  * 3.2.9
  * adding logs

v3.2.8 / 2018-10-21
===================

  * 3.2.8
  * update readme with concurrency and note about exceptions

v3.2.7 / 2018-10-16
===================

  * 3.2.7

v3.2.6 / 2018-10-16
===================

  * 3.2.6
  * add default concurrency
  * remove domCapture argument

v3.2.5 / 2018-10-16
===================

  * 3.2.5
  * remove dom-capture dependency

v3.2.4 / 2018-10-16
===================

  * 3.2.4
  * update packages to fix eyes.sdk.core to 2.0.1

v3.2.3 / 2018-10-15
===================

  * 3.2.3
  * update packages to fix eyes.sdk.core on 2.0
  * refactor server for testability
  * support sendDom, refactor eyesCheckWindow, and add tests

v3.2.2 / 2018-10-14
===================

  * 3.2.2
  * update packages to get a fix for resource missing content bug

v3.2.1 / 2018-10-10
===================

  * 3.2.1

v3.2.0 / 2018-10-10
===================

  * 3.2.0
  * iframe support
  * Merge remote-tracking branch 'amir/master'
  * add allBlobs support
  * add iframe integration play
  * add iframe support

v3.1.1 / 2018-10-02
===================

  * 3.1.1

v3.1.0 / 2018-10-02
===================

  * 3.1.0
  * update visual-grid-client to support floating regions

v3.0.25 / 2018-10-02
====================

  * 3.0.25
  * update visual-grid-client to not fail on fetchResource

v3.0.24 / 2018-09-30
====================

  * 3.0.24
  * update packages

v3.0.23 / 2018-09-25
====================

  * 3.0.23
  * update readme to use applitools.config.js instead of eyes.json
  * update npm packages

v3.0.22 / 2018-09-25
====================

  * 3.0.22
  * update visual-grid-client to v5 to simplify config

v3.0.21 / 2018-09-20
====================

  * 3.0.21
  * update readme with custom props

v3.0.20 / 2018-09-20
====================

  * 3.0.20
  * update visual-grid-client to get fetch improvements

v3.0.19 / 2018-09-17
====================

  * 3.0.19
  * update visual-grid-client to 4.3.7 to support dom snapshot in server

v3.0.18 / 2018-09-16
====================

  * 3.0.18
  * update visual-grid-client to bring back dom

v3.0.17 / 2018-09-16
====================

  * 3.0.17
  * update visual-grid-client to fix isDisabled and write some tests
  * skip failed play test

v3.0.16 / 2018-09-08
====================

  * 3.0.16
  * update readme

v3.0.15 / 2018-09-08
====================

  * 3.0.15
  * better error handling
  * update visual-grid-client to 4.3.2
  * run usual tests on cypress:run script
  * reset running tests on batchStart
  * move timeout msg out of polling handler
  * add timeout for extracting dom data
  * move files from src/cypress to src/

v3.0.14 / 2018-09-04
====================

  * 3.0.14
  * fix dom capture
  * add device emulation to readme

v3.0.13 / 2018-08-29
====================

  * 3.0.13
  * refactor server and pluginExport

v3.0.12 / 2018-08-27
====================

  * 3.0.12
  * update visual-grid-client to log errors

v3.0.11 / 2018-08-27
====================

  * 3.0.11
  * fix tests

v3.0.10 / 2018-08-27
====================

  * 3.0.10
  * fix error in putResource and add tests for app

v3.0.9 / 2018-08-27
===================

  * 3.0.9
  * update visual-grid-client to fix node object spread issue

v3.0.8 / 2018-08-22
===================

  * 3.0.8
  * update visual-grid-client to 4.1.3

v3.0.7 / 2018-08-22
===================

  * 3.0.7
  * change rendering-grid-client to visual-grid-client v4.1.2
  * npm version patch on prepublishOnly
  * update workspace
  * 3.0.6
  * update readme
  * 3.0.5
  * fix tests
  * update readme with best practice and remove plugin port
  * 3.0.4
  * abort unclosed tests
  * where did this timeout come from?
  * 3.0.3
  * npm run cypress:run
  * use waitForTestResults inside batchEnd handler
  * 3.0.2
  * batchEnd support now stable
  * error in openEyes should cause close to do nothing

v3.0.1 / 2018-08-09
===================

  * 3.0.1
  * 3.0.0
  * add batchStart and batchEnd and move config to rendering-grid-client

v2.1.6 / 2018-08-08
===================

  * 2.1.6
  * update rendering-grid-client to 2.0.6

v2.1.5 / 2018-08-08
===================

  * 2.1.5
  * playing with tests
  * eslint config

v2.1.4 / 2018-08-07
===================

  * 2.1.4
  * update rendering-grid-client to 2.0.5

v2.1.3 / 2018-08-07
===================

  * 2.1.3
  * update rendering-grid-client to 2.0.4

v2.1.2 / 2018-08-07
===================

  * 2.1.2
  * add testName and browser name to readme
  * before hook
  * eslint warning
  * add ignore, region and selector to readme
  * add ignore to checkWindow
  * add simple script
  * automatically provide testName
  * fix audit issues
  * relative paths in workspace
  * remove console logs
  * start a new batch before all tests run

v2.1.1 / 2018-08-06
===================

  * 2.1.1
  * update rendering-grid-client to 2.0.2

v2.1.0 / 2018-08-06
===================

  * 2.1.0
  * fix test
  * Merge branch 'scripthooks'
  * Merge branch 'region'
  * update rendering-grid-client to 1.1.13 to support authenticated resources
  * fix isCommands defined
  * support region and selector in checkWindow
  * add support for scriptHooks

v2.0.0 / 2018-08-01
===================

  * 2.0.0
  * automatically set eyesPort in cypress config
  * add branchName to readme
  * add serverUrl and testName to configParams
  * get new batch on browser launch (public API break)

v1.5.25 / 2018-08-06
====================

  * 1.5.25
  * fix putResource

v1.5.24 / 2018-07-31
====================

  * 1.5.24
  * update rendering grid client to 1.1.11
  * add resources page to playground

v1.5.23 / 2018-07-29
====================

  * 1.5.23
  * update rendering-grid-client to 1.1.10

v1.5.22 / 2018-07-29
====================

  * 1.5.22
  * nullify close and checkWindow after close has ended

v1.5.21 / 2018-07-26
====================

  * 1.5.21
  * pack test leaves no tracks
  * split express app from server, and add server error log
  * fix eslint
  * split interactive cypress tests to files

v1.5.20 / 2018-07-22
====================

  * 1.5.20
  * update rendering grid version to support branchName
  * add meta tag to html fixture

v1.5.19 / 2018-07-19
====================

  * 1.5.19
  * update rendering-grid-client to fix empty resource issue

v1.5.18 / 2018-07-19
====================

  * 1.5.18
  * update rendering-grid-client with render status error handling
  * add big website test

v1.5.17 / 2018-07-18
====================

  * 1.5.17
  * add serverUrl to readme

v1.5.16 / 2018-07-18
====================

  * 1.5.16
  * update rendering-grid-client to 1.1.5
  * npm dedupe

v1.5.15 / 2018-07-16
====================

  * 1.5.15
  * pass url in checkWindow instead of openEyes

v1.5.14 / 2018-07-16
====================

  * 1.5.14
  * update rendering grid client to handle unauthorized access
  * add info on match levels in readme
  * fixed version for body-parser to be the same as in express
  * npm update
  * add configuration for wrappers
  * send dom capture in checkWindow

v1.5.13 / 2018-07-12
====================

  * 1.5.13
  * bring back missing css for tests
  * update @applitools/rendering-grid-client to 1.0.5
  * remove unnecessary dependencies
  * remove lodash from dependencies
  * create workspace with rendering-grid-client

v1.5.12 / 2018-07-11
====================

  * 1.5.12
  * remove unused files
  * use @applitools/rendering-grid-client
  * change internal api's to "make..."
  * fix tests and eslint

v1.5.11 / 2018-07-10
====================

  * 1.5.11
  * remove unused file
  * remove .only

v1.5.10 / 2018-07-10
====================

  * 1.5.10
  * extract css resources from style attributes
  * handle some TODOs
  * support multiple urls per css rule

v1.5.9 / 2018-07-09
===================

  * 1.5.9
  * add description of setup script

v1.5.8 / 2018-07-09
===================

  * 1.5.8
  * support missing content-type on resources
  * remove .only from tests

v1.5.7 / 2018-07-09
===================

  * 1.5.7
  * eyes-setup script adds also commands import
  * eyes setup script adds code to plugins file

v1.5.6 / 2018-07-09
===================

  * 1.5.6
  * extract resources from @media rules

v1.5.5 / 2018-07-09
===================

  * 1.5.5
  * readme update
  * fixed another log hole

v1.5.4 / 2018-07-08
===================

  * 1.5.4
  * avoid logs entirely when not in dev mode

v1.5.3 / 2018-07-08
===================

  * 1.5.3
  * avoid logs when showLogs is falsy

v1.5.2 / 2018-07-08
===================

  * 1.5.2
  * typo

v1.5.1 / 2018-07-08
===================

  * 1.5.1
  * readme feedback
  * handle uppercase urls
  * add git repo to package.json
  * handle crash errors
  * rearrange tests
  * getAllResources should not keep global cache
  * assert that second render request doesn't return need-more-resources
  * update eyes.sdk.core to 1.7.0
  * small fixes

v1.5.0 / 2018-07-05
===================

  * 1.5.0
  * support blob urls!!!
  * small change to handlers
  * extract inner css resources in node instead of browser
  * log runtime config
  * env var to show logs in tests
  * add support for @supports rule
  * better log

v1.4.2 / 2018-07-02
===================

  * 1.4.2
  * config params

v1.4.1 / 2018-07-02
===================

  * 1.4.1
  * add 'use strict' to all files
  * handle batch name and id
  * small update
  * shuffle tasks
  * expose sizeMode in commands

v1.4.0 / 2018-07-02
===================

  * 1.4.0
  * optimize - call checkWindow before eyesClose
  * don't crash on unsupported protocols
  * switch to npm

v1.3.7 / 2018-06-28
===================

  * 1.3.7
  * support browser name in openEyes
  * extract absolute urls from css, and handle parse exception
  * change request implementation from 'fetch' to 'cy.request'
  * fix
  * support sizeMode argument in checkWindow
  * markdown lint

v1.3.6 / 2018-06-27
===================

  * 1.3.6
  * change close implementation to polling
  * fix path
  * split plugin into modules
  * move plugin files

v1.3.5 / 2018-06-25
===================

  * 1.3.5
  * change isVerbose to showLogs
  * proper error messages
  * improve readme
  * pad minutes and hours in debug folder name

v1.3.4 / 2018-06-19
===================

  * 1.3.4
  * move timeout to cy.eyesClose and document

v1.3.3 / 2018-06-19
===================

  * 1.3.3
  * slight change in readme

v1.3.2 / 2018-06-19
===================

  * 1.3.2
  * remove clause from readme

v1.3.1 / 2018-06-19
===================

  * 1.3.1
  * fix e2e test syntax
  * fix tests with new fakes
  * shuffle tasks
  * fix: send resources when need more resources
  * send 2 viewport sizes in e2e tests
  * add example to readme
  * support videos and fix tests

v1.3.0 / 2018-06-18
===================

  * 1.3.0
  * pass all user args to openEyes and support config file and env variables
  * save debug data to folder name with date
  * handle doctype when creating cdt
  * format test.cdt.json
  * handle render status timeout
  * update package version in fixture test app
  * fix async errors in plugin test
  * fix optimization

v1.2.5 / 2018-06-18
===================

  * 1.2.5
  * slight optimization to get render info earlier
  * ignore occasional test generated node_modules folder in eslint
  * integration tests for batch and multiple viewport sizes
  * support multiple viewport sizes
  * save more resources data when debugging

v1.2.4 / 2018-06-17
===================

  * 1.2.4
  * Merge branch 'extract_style_resources'
  * add .private to .gitignore
  * yarn lock
  * rename getRenderStatus to waitForRenderedStatus
  * handle empty renderStatus (fix 400 error)
  * fix test
  * ugly but working solution to fetching inner css resources with cache
  * fix lint issues
  * Merge remote-tracking branch 'origin/master' into extract_style_resources
  * support extracting inner css resources from style tags
  * extract resources from style element + more stuff
  * add .private to .gitignore
  * yarn lock
  * rename getRenderStatus to waitForRenderedStatus
  * 1.2.3
  * 1.2.2
  * made parallism better
  * 1.2.1
  * fixed bug whereby checkWindows were in incorrect order
  * 1.2.0
  * checkWindow now runs in the background
  * 1.1.3
  * added 'tag' support to checkWindow
  * 1.1.2
  * upgraded to eyes.sdk.core@1.6

v1.1.1 / 2018-05-24
===================

  * 1.1.1
  * fetch inner css resources
  * troubleshoot data WIP

v1.1.0 / 2018-05-21
===================

  * 1.1.0
  * stop sending script resources
  * individual and configurable timeout for checkWindow command
  * better cypress command logs
  * fix readme
  * support unhandled node types (like comments)
  * add API key to readme
  * readme with advanced port config
  * cypress plugin with fixed/custom port
  * remove buff
  * e2e test for package and install
  * add readme
  * get ready for publish
  * move cypress folder
  * refactor getAllResources and add scripts to extractResources
  * timeout on render-status
  * cleanup cypress folder and add e2e tests
  * cypress e2e test
  * after code review
  * remove unnecessary file
  * cypress plugin with tests
  * update tasks
  * more tests
  * rearrange tests
  * rearrange tests
  * reorder folders
  * tasks readme format
  * tasks  doc
  * fix eslint issues
  * fix fixture
  * refactor out getRenderStatus
  * move file
  * fix link
  * don't save buffer in local resource cache AND work RGridResource
  * remove 'only'
  * don't save buffer in local resource cache
  * getAllResources with tests
  * change fetchResources test to work with server
  * take control over render status polling
  * caching for fetch resources
  * debug configuration
  * tests against real applitools server
  * add tests, add test server and rename EyesRunner  to openEyes
  * fix renderWidth exception
  * rename tests folder, refactor a bit
  * make it work in cypress
  * separate to folders, runner file, tests passing
  * rename wrapper
  * clean up sdk wrapper
  * working cypress example
  * full flow with jsdom
  * lint
  * extract and fetch resources, use sdk.core render grid API
  * initial commit: layout of top-most functionality
