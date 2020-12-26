const { Op } = require('sequelize');
const { DownloaderHelper } = require('node-downloader-helper');
const moveFile = require('move-file');

const {
  FloatplaneChannelSetting,
} = require('./models/FloatplaneChannelSetting');
const { FloatplaneCredential } = require('./models/FloatplaneCredential');
const {
  getVideoDownloads,
  buildVideoDownloadLink,
  getChannels,
} = require('./floatplaneApi');
const { getCurrentTimestamp, checkDirs } = require('./common');
const { getChannelVideos, syncVideos } = require('./services/floatplaneVideo');
const { updateFloatplaneChannelSetting } = require('./services/floatplaneChannelSetting');
const { getOrCreateFloatplaneCredential } = require('./services/floatplaneCredential');

const syncAllChannelsAndVideos = async () => {
  // Sync all channels and videos
  const floatplaneCredentials = await FloatplaneCredential.findAll();
  await Promise.all(
    floatplaneCredentials.map(({ userId, cookie }) =>
      syncChannelsAndVideos(userId, cookie)
    )
  );
};

module.exports.syncDownloadVideos = async () => {
  try {
    console.log('[syncDownloadVideos]: start');

    // Sync all of the channels and videos
    await syncAllChannelsAndVideos();

    // Get all channels with automaticallyDownload enabled
    const floatplaneChannels = await FloatplaneChannelSetting.findAll({
      where: {
        automaticallyDownload: true,
        isSubscribed: true,
        directoryName: {
          [Op.ne]: null,
        },
      },
    });

    await Promise.all(
      floatplaneChannels.map(
        async ({
          channelId,
          automaticallyDownloadTimestamp,
          userId,
          downloadQuality,
          directoryName,
        }) => {
          const floatplaneCredential = await FloatplaneCredential.findOne({
            where: {
              userId,
              cookieExpires: {
                [Op.gt]: getCurrentTimestamp(),
              },
            },
          });
          if (!floatplaneCredential) return null;
          const channelVideos = await getChannelVideos(
            channelId,
            automaticallyDownloadTimestamp
          );
          return Promise.all(
            channelVideos.map(async (channelVideo) =>
              downloadAndUpdateStatus(
                channelVideo,
                downloadQuality,
                directoryName,
                floatplaneCredential,
              ),
            ),
          );
        },
      ),
    );
    console.log('[syncDownloadVideos]: end');
  } catch (error) {
    console.error('ERROR - syncDownloadVideos():', error);
  }
};

const downloadAndUpdateStatus = async (
  channelVideo,
  downloadQuality,
  directoryName,
  floatplaneCredential,
) => {
  const { videoId, title } = channelVideo;
  const videoDownload = await getVideoDownloads(
    videoId,
    floatplaneCredential.cookie,
  );
  const videoDownloadLink = buildVideoDownloadLink(
    videoDownload,
    downloadQuality,
  );

  const fileName = `${title}.mp4`;
  const videosDir = `${__dirname}/videos`;
  const videosIncompleteDir = `${__dirname}/videos_incomplete`;
  const videosChannelDir = `${videosDir}/${directoryName}`;
  const videosChannelIncompleteDir = `${videosIncompleteDir}/${directoryName}`;
  const videoDir = `${videosChannelDir}/${fileName}`;
  const videoIncompleteDir = `${videosChannelIncompleteDir}/${fileName}`;

  checkDirs([
    videosDir,
    videosIncompleteDir,
    videosChannelDir,
    videosChannelIncompleteDir,
  ]);

  const dl = new DownloaderHelper(
    videoDownloadLink,
    videosChannelIncompleteDir,
    { fileName }
  );

  dl.on('download', async ({ totalSize }) => {
    await channelVideo.update({
      status: 'downloading',
      downloadSize: totalSize,
    });
  });
  dl.on('progress.throttled', async ({ progress, downloaded, speed }) => {
    await channelVideo.update({
      downloadProgress: Math.round(progress),
      status: 'downloading',
      downloadedAmount: downloaded,
      downloadSpeed: speed,
    });
  });
  dl.on('error', async (error) => {
    await channelVideo.update({ downloadProgress: 0, status: 'failed', downloadSpeed: 0 });
    console.log('ERROR - Download', error);
  });
  dl.on('end', async () => {
    await channelVideo.update({ downloadProgress: 100, status: 'moving', downloadSpeed: 0 });
    await moveFile(videoIncompleteDir, videoDir);
    await channelVideo.update({ downloadProgress: 100, status: 'downloaded' });
  });
  dl.start();
};

module.exports.updateChannels = async (userId) => {
  try {
    const floatplaneCredential = await getOrCreateFloatplaneCredential(userId);
    const channels = await getChannels(floatplaneCredential.cookie);
    if (channels) {
      // Updated channels
      await Promise.all(
        channels.map((channel) => {
          return updateFloatplaneChannelSetting(
            userId,
            channel.creator,
            true
          );
        })
      );
      // Unsubscribe from any channels we aren't subscribed to
      const channelsSettings = await FloatplaneChannelSetting.findAll({
        where: { userId },
      });
      const unsubscribedChannels = channelsSettings.filter(
        (channelSettings) => {
          return !channels.find(
            ({ creator }) => creator === channelSettings.channelId
          );
        }
      );
      if (unsubscribedChannels) {
        await Promise.all(
          unsubscribedChannels.map((unsubscribedChannel) => {
            return updateFloatplaneChannelSetting(
              userId,
              unsubscribedChannel.channelId,
              false
            );
          })
        );
      }
    }
    // Return updated channels settings
    return FloatplaneChannelSetting.findAll({ where: { userId } });
  } catch (error) {
    console.error('ERROR - updateChannels():', error);
    return null;
  }
};

const syncChannelsAndVideos = async (userId, cookie) => {
  if (cookie) {
    const floatplaneChannels = await this.updateChannels(userId);
    await Promise.all(
      floatplaneChannels.map(({ channelId }) =>
        syncVideos(userId, channelId, cookie)
      )
    );
  }
};
