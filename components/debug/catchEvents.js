import Alpine from 'alpinejs';

const initialize = () => {
    
  // Catch the custom event and execute a function to update the legend
  document.addEventListener('filterPushed', function (event) {
    console.debug('Custom event "filterPushed" caught in debug/catchEvents.js');
    //console.debug(event)
    console.debug(event.detail.instance)
    console.debug(event.detail.instance.getUrl())
    console.debug(event.detail.instance.getParams().LAYERS)
  });

  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};


export { initialize };
