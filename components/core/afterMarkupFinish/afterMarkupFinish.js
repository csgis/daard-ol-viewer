import Alpine from 'alpinejs';
import feather from 'feather-icons';

const initialize = () => {

  // Listen for the custom event that all plugins are ready
  document.addEventListener('allPluginsFinishedLoading', () => {
    console.log("- init enableTooltips");
    //initTooltips();
    feather.replace();
  });

  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};

export { initialize };
