const router = require('express').Router();

const { DateTime } = require('luxon');
const { v4 } = require('uuid');
const { respondSuccess, getCurrentTimestamp } = require('../../common');
const { getChannels } = require('../../floatplaneApi');
const { authCheck } = require('../../middleware/authCheck');
const { connectionCheck } = require('../../middleware/connectionCheck');
const { FloatplaneChannelSetting } = require('../../models/FloatplaneChannelSetting');
const { updateChannels } = require('../../services/floatplaneChannelSetting');

router.get('/', authCheck, connectionCheck, async (req, res) => {
  const userId = req.user.id;
  try {
    const channels = await getChannels(req.cookie);
    
    await updateChannels(userId, channels, true);
    
    return res.json(respondSuccess(channels));
  } catch (error) {
    console.error('ERROR - /channels:', error);
  }
});

module.exports = router;
