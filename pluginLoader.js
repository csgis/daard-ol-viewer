import Alpine from 'alpinejs';
import { pluginsConfig } from "./plugins.js";

const loadPlugins = (map, view, parentsOnly = false) => {
  const initializationPromises = [];

  for (const pluginConfig of pluginsConfig.plugins) {
    if (!pluginConfig.enabled) continue;
    if ((parentsOnly && pluginConfig.createsParentDOM) || (!parentsOnly && !pluginConfig.createsParentDOM)) {
      const initializationPromise = pluginConfig.component().then((module) => {       
        if (module.initialize) {
          return module.initialize(pluginConfig.buttonDomOrder) || null;
        }
        return null;
      }).catch(error => {
        console.error('Error loading component for plugin:', pluginConfig.name, error);
        return null; 
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


