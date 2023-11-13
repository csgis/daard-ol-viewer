import pluginsConfig from './plugins.json';

const loadPlugins = (map, view) => {
  const initializationPromises = [];

  for (const pluginConfig of pluginsConfig.plugins) {
    if (!pluginConfig.enabled) continue;

    const initializationPromise = import(pluginConfig.path).then((module) => {
      if (module.initialize) {
        return module.initialize(map, view);
      }
    });

    initializationPromises.push(initializationPromise);
  }

  return initializationPromises;
};

export { loadPlugins };
