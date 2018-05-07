## tasks
- [x] reorder folders
- [x] write more tests for (rg-client, rg-server)
- [x] code review
- [x] cypress plugin (inc. tests)
- [x] cypress commands (inc. tests?)
- [x] move cypress to tests folder (change something in cypress.json)
- [x] e2e tests
- [ ] npm publish and let's talk productization
- [ ] handle logging
- [ ] readme
- [ ] extract resources from html (scripts, videos, iframes, etc.)
- [ ] look inside css/svg/? (imports, fonts, bg images)
- [ ] support multiple viewport sizes in one render
- [ ] support renderInfo instead of renderWidth (with sizeMode)
- [x] getRenderStatus - pass wrapper and timeout of 2 minutes
- [ ] optimize: background renders, matchWindow loop, queues
- [ ] add 'use strict'
- [ ] await cypress commands correctly and remove "defaultCommandTimeout"
- [x] getAllResources should receive absolute urls
- [ ] getAllResources should not keep global cache

## publish tasks
- [ ] change `src` to `lib` ?
- [x] expose `@applitools/eyes.cypress/commands`
- [ ] merge PR with `renderStatusById` in eyes.sdk.core

## user actions on install
### plugins file
- [ ] add `const {startServer} = require '@applitools/eyes.cypress'` to pluginsFile
- [ ] add `async` to module.exports in plugins file
- [ ] add `const {eyesPort} = await startServer()`
- [ ] add `return {eyesPort}`
### support file
- [ ] add `import '@applitools/eyes.cypress/commands` to support file
### cypress.json file
- [ ] add `"defaultCommandTimeout": 60000` to config file
### other
- [ ] add `APPLITOOLS_API_KEY` to env vars
