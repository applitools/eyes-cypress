const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const EyesCypressImpl = require('../../src/EyesCypressImpl');
const createRGridDom = require('../../src/createRGridDom');
const {URL} = require('url');
const eyes = new EyesCypressImpl({
  apiKey: 'lScDOEqp3FfyO9wjESeSdLlIzeN109PBHYNSGZICfEUPU110', // TODO env var
});

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use('/example', express.static('/Users/amit/clients/applitools/eyes.cypress/example'));

app.post('/eyes/:command', express.json(), async (req, res) => {
  eyes._logger.verbose(`eyes api: ${req.params.command}, ${Object.keys(req.body)}`);
  try {
    await eyesCommands[req.params.command](req.body);
    res.sendStatus(200);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

const eyesCommands = {
  open: async ({baseUrl, appName, testName, viewportSize}) => {
    console.log('111 _isOpen', eyes._isOpen);
    await eyes.open(baseUrl, appName, testName, viewportSize);
    await eyes.getRenderInfo();
    console.log('222 _isOpen', eyes._isOpen);
  },

  checkWindow: async ({resourceUrls, cdt}) => {
    console.log('333 _isOpen', eyes._isOpen);
    const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, eyes.baseUrl).href);
    console.log('555 _isOpen', eyes._isOpen);
    const rGridDom = await createRGridDom(absoluteUrls, cdt);
    console.log('666 _isOpen', eyes._isOpen);
    const url = eyes.baseUrl; // TODO
    const imgLocation = await eyes.renderWindow(url, rGridDom, 1024);
    console.log('777 _isOpen', eyes._isOpen);
    eyes._logger.verbose(`img location ${imgLocation}`);
    const result = await eyes.checkWindow(imgLocation);
    eyes._logger.verbose(`result ${result}`);
  },

  close: async () => {
    await eyes.close();
  },
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = app.listen(3456, () => {
      const port = server.address().port;
      console.log(`server running at port: ${port}`);
      resolve({port});
    });
  });
};
