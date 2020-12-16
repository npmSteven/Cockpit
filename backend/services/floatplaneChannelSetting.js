const { v4 } = require("uuid");
const { getCurrentTimestamp } = require("../common");
const { FloatplaneChannelSetting } = require("../models/FloatplaneChannelSetting");

module.exports.getOrCreateFloatplaneChannelSetting = async (userId, channelId, isSubscribed) => {
  try {
    const floatplaneChannelSetting = await FloatplaneChannelSetting.findOne({ where: { userId, channelId } });
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
}

module.exports.updateFloatplaneChannelSetting = async (userId, channelId, isSubscribed) => {
  try {
    const floatplaneChannelSetting = await this.getOrCreateFloatplaneChannelSetting(userId, channelId, isSubscribed);
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
}

module.exports.updateChannels = async (userId, channels, isSubscribed) => {
  try {
    // Updated channels
    await Promise.all(channels.map((channel) => {
      return this.updateFloatplaneChannelSetting(userId, channel.creator, isSubscribed);
    }));
    // Unsubscribe from any channels we aren't subscribed to
    const channelsSettings = await FloatplaneChannelSetting.findAll({ where: { userId } });
    const unsubscibedChannels = channelsSettings.filter(channelSettings => {
      return !channels.find(({ creator }) => creator === channelSettings.channelId);
    });
    await Promise.all(unsubscibedChannels.map((unsubscibedChannel) => {
      return this.updateFloatplaneChannelSetting(userId, unsubscibedChannel.channelId, false);
    }));
  } catch (error) {
    console.error('ERROR - updateChannels():', error);
    return null;
  }
}
