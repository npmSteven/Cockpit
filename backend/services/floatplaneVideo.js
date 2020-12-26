const { v4 } = require('uuid');
const { Op } = require('sequelize');

const { getCurrentTimestamp } = require('../common');
const { getVideos } = require('../floatplaneApi');
const { FloatplaneVideo } = require('../models/FloatplaneVideo');

module.exports.getOrCreateFloatplaneVideo = async (userId, video) => {
  const { channelId, videoId, title, thumbnail, releaseDate } = video;
  try {
    const floatplaneVideo = await FloatplaneVideo.findOne({
      where: { userId, channelId, videoId },
    });
    if (floatplaneVideo) return floatplaneVideo;
    const currentDateTime = getCurrentTimestamp();
    return FloatplaneVideo.create({
      id: v4(),
      userId,
      channelId,
      videoId,
      title,
      thumbnail,
      releaseDate,
      createdAt: currentDateTime,
    });
  } catch (error) {
    console.error('ERROR - getOrCreateFloatplaneVideo():', error);
    return null;
  }
};

module.exports.syncVideos = async (userId, channelId, cookie) => {
  try {
    const videos = await getVideos(channelId, cookie);
    await Promise.all(
      videos.map((video) => this.getOrCreateFloatplaneVideo(userId, video))
    );
    return true;
  } catch (error) {
    console.error('ERROR - syncVideos():', error);
    return null;
  }
};

module.exports.getChannelVideos = async (channelId, automaticallyDownloadTimestamp) => {
  // Get all of the relevant videos
  const channelVideos = await FloatplaneVideo.findAll({
    where: {
      releaseDate: {
        [Op.gte]: automaticallyDownloadTimestamp,
      },
      status: 'download',
      channelId,
    },
  });
  return channelVideos;
};
