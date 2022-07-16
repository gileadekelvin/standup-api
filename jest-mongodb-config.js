export const mongodbMemoryServerOptions = {
  binary: {
    version: '5.0.6',
    skipMD5: true,
  },
  autoStart: false,
  instance: {},
  debug: '1',
};
export const useSharedDBForAllJestWorkers = false;