import './style.css';
import 'tippy.js/dist/tippy.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import { countEnabledPlugins, getEnabledPluginNames, loadPlugins } from './pluginLoader.js'; // Adjust the path as needed
import { map, view } from './components/core/mapSetup/mapSetup.js';

import Alpine from 'alpinejs'
import Tooltip from "@ryangjchandler/alpine-tooltip";
import { emitCustomEvent } from './components/core/helper.js';
import loader from './components/core/loadIndicator/loadIndicator.js'
import persist from '@alpinejs/persist'

// Init Alpine
window.Alpine = Alpine.plugin(persist)
Alpine.plugin(Tooltip);


const enabledPlugins = getEnabledPluginNames();


// Store used for plugin handling
Alpine.store('pluginStatus', {
  registeredPluginsCount: 0,
  registeredPluginNames: enabledPlugins.join(', '),
  increasePluginLoadingStatus(){
    this.registeredPluginsCount++;
  },
  closeAllOffcanvas(){
    enabledPlugins.forEach(pluginName => {
      Alpine.store(pluginName).componentIsActive =false
    });
  }
})

// Iterate over each enabled plugin and create a store
enabledPlugins.forEach(pluginName => {
  Alpine.store(pluginName, {componentIsActive: false});
});

Alpine.start()

// Init the loader that stands out of other plugins
loader();



// Init plugin loading after map layers have finished loading
document.addEventListener('featureMaplayersFinished', async (event) => {
  console.debug('7. main.js received featureMaplayersFinished event');
  
  // Load parent components
  console.debug('- Starting parent component initialization');
  const parentComponentPromises = loadPlugins(map, view, true); // Load parent components
  await Promise.all(parentComponentPromises);

  // Load non-parent components
  console.debug('- Parent components loaded, loading non-parent components');
  const nonParentComponentPromises = loadPlugins(map, view, false); // Load non-parent components
  await Promise.all(nonParentComponentPromises);

  // Total number of plugins loaded
  const totalPlugins = parentComponentPromises.length + nonParentComponentPromises.length;

  // Check if all plugins are loaded
  Alpine.effect(() => {
    if (Alpine.store('pluginStatus').registeredPluginsCount === totalPlugins) {
      // Trigger a custom event when all plugins are finished
      const allPluginsFinishedLoadingEvent = new Event('allPluginsFinishedLoading');
      document.dispatchEvent(allPluginsFinishedLoadingEvent);
      console.debug(`${Alpine.store('pluginStatus').registeredPluginsCount} plugins finished Loading`);
      emitCustomEvent('hideLoading', {});
    }
  });
});
