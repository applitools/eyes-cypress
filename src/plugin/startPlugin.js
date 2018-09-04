'use strict';

const {startServer} = require('./server');
const makePluginExport = require('./pluginExport');

module.exports = makePluginExport(startServer);
