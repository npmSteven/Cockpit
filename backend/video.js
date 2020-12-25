const { Op } = require('sequelize');
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs');
const moveFile = require('move-file');

const {
  FloatplaneChannelSetting,
} = require('./models/FloatplaneChannelSetting');
const { FloatplaneCredential } = require('./models/FloatplaneCredential');
const { FloatplaneVideo } = require('./models/FloatplaneVideo');
const { syncVideos } = require('./services/floatplaneVideo');
const { updateChannels } = require('./services/floatplaneChannelSetting');
const { getVideoDownloads } = require('./floatplaneApi');
const { throttle, getCurrentTimestamp } = require('./common');

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
  
    await Promise.all(floatplaneChannels.map(async ({ channelId, automaticallyDownloadTimestamp, userId, downloadQuality, directoryName }) => {
      const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId, cookieExpires: {
        [Op.gt]: getCurrentTimestamp(),
      } } });
      if (!floatplaneCredential) return null;
      const channelVideos = await getChannelVideos(channelId, automaticallyDownloadTimestamp);
      return Promise.all(channelVideos.map(async (channelVideo) => {
        const { videoId, title } = channelVideo;
        const videoDownload = await getVideoDownloads(videoId, floatplaneCredential.cookie);
        const videoDownloadLink = buildVideoDownloadLink(videoDownload, downloadQuality);

        const fileName = `${title}.mp4`;
        const videosDir = `${__dirname}/videos`; 
        const videosIncompleteDir = `${__dirname}/videos_incomplete`;
        const videosChannelDir = `${videosDir}/${directoryName}`;
        const videosChannelIncompleteDir = `${videosIncompleteDir}/${directoryName}`;
        const videoDir = `${videosChannelDir}/${fileName}`;
        const videoIncompleteDir = `${videosChannelIncompleteDir}/${fileName}`;

        checkDir(videosDir);
        checkDir(videosIncompleteDir);
        checkDir(videosChannelDir);
        checkDir(videosChannelIncompleteDir);

        const dl = new DownloaderHelper(videoDownloadLink, videosChannelIncompleteDir, { fileName });

        dl.on('progress', throttle((async ({ progress }) => {
          await channelVideo.update({
            downloadProgress: Math.round(progress),
            downloadStatus: 'downloading',
          });
        }), 2000));
        dl.on('error', async (error) => {
          await channelVideo.update({
            downloadProgress: 0,
            downloadStatus: 'failed',
          });
          console.log('ERROR - Download', error);
        });
        dl.on('end', async () => {
          await moveFile(videoIncompleteDir, videoDir)
          await channelVideo.update({
            downloadProgress: 100,
            downloadStatus: 'downloaded',
          });
        });
        dl.start();
      }));
    }));
    console.log('[syncDownloadVideos]: end');
  } catch (error) {
    console.error('ERROR - syncDownloadVideos():', error);
  }
};



const buildVideoDownloadLink = (videoDownload, downloadQuality) => {
  const edge = videoDownload.edges.find(edge => edge.allowDownload);
  const uriWithQuality = videoDownload.resource.uri.replace('{qualityLevels}', downloadQuality);
  const uriWithToken = uriWithQuality.replace('{token}', videoDownload.resource.data.token);
  return `https://${edge.hostname}${uriWithToken}`;
}

const getChannelVideos = async (channelId, automaticallyDownloadTimestamp) => {
  // Get all of the relevant videos
  const channelVideos = await FloatplaneVideo.findAll({
    where: {
      releaseDate: {
        [Op.gte]: automaticallyDownloadTimestamp,
      },
      downloadStatus: 'download',
      channelId,
    },
  });
  return channelVideos;
};

const syncAllChannelsAndVideos = async () => {
  // Sync all channels and videos
  const floatplaneCredentials = await FloatplaneCredential.findAll();
  await Promise.all(
    floatplaneCredentials.map(({ userId, cookie }) =>
      syncChannelsAndVideos(userId, cookie)
    )
  );
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

const checkDir = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}
