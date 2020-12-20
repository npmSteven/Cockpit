const { Op } = require('sequelize');
const {
  FloatplaneChannelSetting,
} = require('./models/FloatplaneChannelSetting');
const { FloatplaneCredential } = require('./models/FloatplaneCredential');
const { FloatplaneVideo } = require('./models/FloatplaneVideo');
const { syncVideos } = require('./services/floatplaneVideo');
const { updateChannels } = require('./services/floatplaneChannelSetting');

module.exports.syncDownloadVideos = async () => {
  // Sync all channels and videos
  const floatplaneCredentials = await FloatplaneCredential.findAll();
  Promise.all(
    floatplaneCredentials.map(({ userId, cookie }) =>
      syncChannelsAndVideos(userId, cookie)
    )
  );

  // Get all channels with automaticallyDownload enabled
  const floatplaneChannels = await FloatplaneChannelSetting.findAll({
    where: { automaticallyDownload: true },
  });

  // Get all of the relevant videos
  const [videos] = await Promise.all(
    floatplaneChannels.map(({ automaticallyDownloadTimestamp }) => {
      return FloatplaneVideo.findAll({
        where: {
          releaseDate: {
            [Op.gte]: automaticallyDownloadTimestamp,
          },
          downloadStatus: 'download',
        },
      });
    })
  );
  console.log(videos.map((v) => v.title));
};

const syncChannelsAndVideos = async (userId, cookie) => {
  if (cookie) {
    const floatplaneChannels = await updateChannels(userId);
    await Promise.all(
      floatplaneChannels.map(({ channelId }) =>
        syncVideos(userId, channelId, cookie)
      )
    );
  }
};
