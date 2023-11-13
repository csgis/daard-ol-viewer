// enableTooltips.js

import Alpine from 'alpinejs';

const initialize = () => {
  const initTooltips = () => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    console.log("init enableTooltips");
  };

  // Listen for the custom event
  document.addEventListener('allPluginsFinishedLoading', () => {
    initTooltips();
    // Increase the loading status (assuming you have a method like increasePluginLoadingStatus)
  });

  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};

export { initialize };
