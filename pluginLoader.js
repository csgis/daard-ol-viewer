import Alpine from 'alpinejs';
import pluginsConfig from './plugins.json';

const loadPlugins = (map, view, parentsOnly = false) => {
  const initializationPromises = [];

  for (const pluginConfig of pluginsConfig.plugins) {
    if (!pluginConfig.enabled) continue;

    // Check condition based on parentsOnly flag
    if ((parentsOnly && pluginConfig.createsParentDOM) || (!parentsOnly && !pluginConfig.createsParentDOM)) {
      const initializationPromise = import(pluginConfig.path).then((module) => {
        if (module.initialize) {
          return module.initialize(pluginConfig.buttonDomOrder);
        }
      });

      initializationPromises.push(initializationPromise);
    }
  }

  return initializationPromises;
};
// Function to count the number of enabled plugins
const countEnabledPlugins = () => {
  return pluginsConfig.plugins.reduce((count, plugin) => {
    return plugin.enabled ? count + 1 : count;
  }, 0);
};

// Function to get the names of enabled plugins
const getEnabledPluginNames = () => {
  return pluginsConfig.plugins
    .filter(plugin => plugin.enabled && plugin.name)
    .map(plugin => plugin.name);
};

export { loadPlugins, countEnabledPlugins, getEnabledPluginNames };


