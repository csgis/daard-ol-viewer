import Alpine from 'alpinejs';
import feather from 'feather-icons';

const initialize = () => {
  const initTooltips = () => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    console.log("init enableTooltips");
  };

  // Listen for the custom event that all plugins are ready
  document.addEventListener('allPluginsFinishedLoading', () => {
    console.log("- init enableTooltips");
    //initTooltips();
    feather.replace();
  });

  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};

export { initialize };
