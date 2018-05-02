const {RenderStatus} = require('@applitools/eyes.sdk.core');

const GET_STATUS_INTERVAL = 500; // TODO take from SDK?
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

async function getRenderStatus(renderId, doGetRenderStatus) {
  try {
    const renderStatus = await doGetRenderStatus(renderId);
    const status = renderStatus.getStatus();
    if (status === RenderStatus.RENDERING) {
      await sleep(GET_STATUS_INTERVAL);
      return await getRenderStatus(renderId, doGetRenderStatus);
    } else if (status === RenderStatus.ERROR) {
      throw renderStatus.getError();
    }
    return renderStatus.getImageLocation();
  } catch (ex) {
    // TODO number of retries?
    await sleep(GET_STATUS_INTERVAL); // TODO use GeneralUtils from SDK?
    return await getRenderStatus(renderId, doGetRenderStatus);
  }
}

module.exports = getRenderStatus;

/*****
 * TODO: when this is rewritten to be optimized, it should query status for multiple renderIds

  async function getRenderStatus(renderIds) {
    // TODO send POST to /render-status (_serverConnector.getRenderStatusByIds)
    // TODO remove completed renderIds from array
    // TODO call matchWindow on completed renderIds
  }

 */
