## tasks
- [x] reorder folders
- [x] write more tests for (rg-client, rg-server)
- [x] code review
- [x] cypress plugin (inc. tests)
- [x] cypress commands (inc. tests?)
- [x] move cypress to tests folder (change something in cypress.json)
- [x] e2e tests
- [x] npm publish and let's talk productization
- [x] startServer with fixed port (next tick trick)
- [x] avoid global command timeout in cypress.json
- [x] handle logging
- [x] readme
- [x] extract resources from html (scripts, videos, iframes, etc.)
- [x] look inside css/svg/? (imports, fonts, bg images)
- [x] support renderInfo instead of renderWidth (with sizeMode)
- [x] waitForRenderedStatus - pass wrapper and timeout of 2 minutes
- [ ] optimize: background renders, matchWindow loop, queues
- [ ] add 'use strict'
- [x] getAllResources should receive absolute urls
- [ ] getAllResources should not keep global cache
- [ ] error handling: close/checkWindow without open
- [x] proper command logging
- [ ] docs: troubleshooting section
- [x] stop sending scripts
- [x] extract doctype into cdt
- [ ] troubleshoot flag + readme + production path
- [x] check `UnhandledPromiseRejectionWarning: Error: Not running` in test `starts at a custom port`
- [x] check `Error: Could not parse CSS @import URL imported2.css relative to base URL "about:blank"` in test `works for test.html`

## Discussion w/ Gil
- [ ] test coverage for actual test creation in eyes server (need metadata from Adam)
- [ ] improve readme with examples
- [ ] fail test with proper link to eyes in the `close` command
- [x] support multiple viewport sizes in one render

## publish tasks
- [ ] change `src` to `lib` ?
- [x] expose `@applitools/eyes.cypress/commands`
- [x] merge PR with `renderStatusById` in eyes.sdk.core
