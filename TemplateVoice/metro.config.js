const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  watchFolders: [__dirname], // Ensures the current directory is watched
  resetCache: true,          // Forces a clean cache on restart
};
