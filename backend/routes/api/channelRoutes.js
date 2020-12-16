const router = require('express').Router();

const { DateTime } = require('luxon');
const { v4 } = require('uuid');
const { respondSuccess, getCurrentTimestamp } = require('../../common');
const { getChannels } = require('../../floatplaneApi');
const { authCheck } = require('../../middleware/authCheck');
const { connectionCheck } = require('../../middleware/connectionCheck');
const { FloatplaneChannelSetting } = require('../../models/FloatplaneChannelSetting');

router.get('/', authCheck, connectionCheck, async (req, res) => {
  const userId = req.user.id;

  const channels = await getChannels(req.cookie);

  // Create / Update channel settings
  for (const channel of channels) {
    const floatplaneChannelSetting = await getOrCreateFloatplaneChannelSetting(userId, channel.creator);
    if (!floatplaneChannelSetting.isSubscribed) {
      await floatplaneChannelSetting.update({
        channelId: channel.creator,
        userId,
        isSubscribed: true,
        createdAt: getCurrentTimestamp(),
      });
    }
  }

  // Update isSubscribed
  const channelsSettings = await FloatplaneChannelSetting.findAll({ where: { userId } });

  const unsubscibedChannels = channelsSettings.filter(channelSettings => {
    return !channels.find(({ creator }) => creator === channelSettings.channelId);
  });

  for (const unsubscibedChannel of unsubscibedChannels) {
    if (unsubscibedChannel.isSubscribed) {
      await unsubscibedChannel.update({ isSubscribed: false });
    }
  }
  
  return res.json(respondSuccess(channels));
});

const getOrCreateFloatplaneChannelSetting = async (userId, channelId) => {
  const floatplaneChannelSetting = await FloatplaneChannelSetting.findOne({ where: { userId, channelId } });
  if (floatplaneChannelSetting) return floatplaneChannelSetting;
  return FloatplaneChannelSetting.create({
    id: v4(),
    userId,
    channelId,
    isSubscribed: true,
    createdAt: getCurrentTimestamp(),
  });
}

module.exports = router;
