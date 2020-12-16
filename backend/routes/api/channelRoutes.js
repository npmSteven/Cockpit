const router = require('express').Router();

const { respondSuccess } = require('../../common');
const { authCheck } = require('../../middleware/authCheck');
const { connectionCheck } = require('../../middleware/connectionCheck');
const { updateChannels } = require('../../services/floatplaneChannelSetting');

router.get('/', authCheck, connectionCheck, async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedChannelsSetting = await updateChannels(userId, true);
    
    return res.json(respondSuccess(updatedChannelsSetting));
  } catch (error) {
    console.error('ERROR - /channels:', error);
  }
});

module.exports = router;
