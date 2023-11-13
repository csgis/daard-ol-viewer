import './style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import { map, view } from './components/core/mapSetup.js';

import Alpine from 'alpinejs'
import { loadPlugins } from './pluginLoader.js'; // Adjust the path as needed
import persist from '@alpinejs/persist'

window.Alpine = Alpine.plugin(persist)
 
Alpine.store('guiStore', {
  background: false
})

Alpine.store('pluginStatus', {
  registeredPlugins: 0,
  increasePluginLoadingStatus(){
    this.registeredPlugins++;
  }
})

Alpine.start()


const pluginInitializationFunctions = loadPlugins();
const totalPlugins = pluginInitializationFunctions.length;

Alpine.effect(() => {
  if (Alpine.store('pluginStatus').registeredPlugins === totalPlugins) {
    // Trigger a custom event when all plugins are finished
    const event = new Event('allPluginsFinishedLoading');
    document.dispatchEvent(event);
    console.log(Alpine.store('pluginStatus').registeredPlugins, " finished Loading");
  }
});