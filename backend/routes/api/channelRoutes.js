const router = require('express').Router();

const { respondSuccess, respondError } = require('../../common');
const { authCheck } = require('../../middleware/authCheck');
const { connectionCheck } = require('../../middleware/connectionCheck');
const { validateChannelIdRequest, validateChannelSettingsUpdateRequest } = require('../../middleware/validateRequest');
const { FloatplaneChannelSetting } = require('../../models/FloatplaneChannelSetting');
const { FloatplaneVideo } = require('../../models/FloatplaneVideo');
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

router.get('/:channelId/settings', authCheck, connectionCheck, validateChannelIdRequest, async (req, res) => {
  const userId = req.user.id;
  const { channelId } = req.value;
  try {
    await updateChannels(userId, true);
    const floatplaneChannelSettings = await FloatplaneChannelSetting.findOne({ where: { userId, channelId } });
    return res.json(respondSuccess(floatplaneChannelSettings));
  } catch (error) {
    console.error('ERROR - /:channelId/settings:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

router.put('/:channelId/settings', authCheck, connectionCheck, validateChannelSettingsUpdateRequest, async (req, res) => {
  const userId = req.user.id;
  const { channelId, directoryName, automaticallyDownload, downloadQuality } = req.value;
  try {
    await updateChannels(userId, true);
    const floatplaneChannelSettings = await FloatplaneChannelSetting.findOne({ where: { userId, channelId } });
    if (!floatplaneChannelSettings) return res.status(404).json(respondError('No floatplaneChannel settings found'));
    const updatedFloatplaneChannelSettings = await floatplaneChannelSettings.update({
      directoryName,
      automaticallyDownload,
      downloadQuality,
    });
    return res.json(respondSuccess(updatedFloatplaneChannelSettings));
  } catch (error) {
    console.error('ERROR - /:channelId/settings:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

router.get('/:channelId/videos', authCheck, connectionCheck, validateChannelIdRequest, async (req, res) => {
  const userId = req.user.id;
  const { channelId } = req.value;

  const floatplaneChannelSettings = await FloatplaneChannelSetting.findOne({ where: { userId, channelId } });
  if (!floatplaneChannelSettings) return res.status(403).json(respondError('You are not subscribed to this channel cannot get videos'));

  const videos = await FloatplaneVideo.findAll({ where: { userId, channelId } });
  return res.json(respondSuccess(videos || []));
});

module.exports = router;
