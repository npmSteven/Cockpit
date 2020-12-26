const { v4 } = require('uuid');

const { getCurrentTimestamp } = require('../common');
const {
  FloatplaneChannelSetting,
} = require('../models/FloatplaneChannelSetting');

module.exports.getOrCreateFloatplaneChannelSetting = async (
  userId,
  channelId,
  isSubscribed,
) => {
  try {
    const floatplaneChannelSetting = await FloatplaneChannelSetting.findOne({
      where: { userId, channelId },
    });
    if (floatplaneChannelSetting) return floatplaneChannelSetting;
    return FloatplaneChannelSetting.create({
      id: v4(),
      userId,
      channelId,
      isSubscribed,
      createdAt: getCurrentTimestamp(),
    });
  } catch (error) {
    console.error('ERROR - getOrCreateFloatplaneChannelSetting():', error);
    return null;
  }
};

module.exports.updateFloatplaneChannelSetting = async (
  userId,
  channelId,
  isSubscribed,
) => {
  try {
    const floatplaneChannelSetting = await this.getOrCreateFloatplaneChannelSetting(
      userId,
      channelId,
      isSubscribed,
    );
    return floatplaneChannelSetting.update({
      channelId,
      userId,
      isSubscribed,
      createdAt: getCurrentTimestamp(),
    });
  } catch (error) {
    console.error('ERROR - updateFloatplaneChannelSetting():', error);
    return null;
  }
};
