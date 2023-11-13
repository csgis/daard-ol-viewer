import {basemapLayers, osmLayer, osmLayerColor} from '../mapSetup'

import Alpine from 'alpinejs';

const createMarkup = () => {
  // Plugin HTML Markup
  const backgroundSwitcherButtonHtml = `
    <div class="mx-1">
      <button type="button" 
          class="btn btn-secondary btn-sm" 
          data-bs-toggle="collapse"
          data-bs-target="#background-switcher"
          @click="$store.layerSwitcher.buttonIsActive = !$store.layerSwitcher.buttonIsActive "
          :class="$store.layerSwitcher.buttonIsActive ? 'bg-secondary' : 'btn-light'"
          >
          Background
      </button>
      </div>
      `

  var specialMarkupContainer = document.getElementById('specialMarkupContainer');
  specialMarkupContainer.insertAdjacentHTML('beforeend', backgroundSwitcherButtonHtml);

  const backgroundSwitcherslideOutHtml = `
  <div id="background-switcher" class="bg-white collapse my-1 shadow-sm"  data-parent="#specialMarkupContainerSub">
    <div class="border m-2">
      <a 
        type="button" 
        class="btn btn-secondary btn-sm p-0 border border-5" 
        id="osm-color" 
        @click="$store.layerSwitcher.set_color_osm($el)"
        :class="$store.layerSwitcher.activeBackground == 'osm-color' ? 'border-primary' : 'border-light'"> 
        <img src="./assets/img/color.jpeg"> 
        </a> 
        
      <a 
        type="button" 
        class="btn btn-secondary btn-sm p-0 border border-5" 
        id="osm-grey" 
        @click="$store.layerSwitcher.set_grey_osm($el)"
        :class="$store.layerSwitcher.activeBackground == 'osm-grey' ? 'border-primary' : 'border-light'">
        <img src="./assets/img/grey.jpeg">
        </a> 
    </div>
    </div>
  `
  var specialMarkupContainerSub = document.getElementById('specialMarkupContainerSub');
  specialMarkupContainerSub.insertAdjacentHTML('beforeend', backgroundSwitcherslideOutHtml);

}


// Initialize the plugin
const initialize = () => {
  Alpine.store('layerSwitcher', {
      buttonIsActive: false,
      activeBackground: "osm-color",
      setBasemap: function(selectedLayer) {
          basemapLayers.forEach(layer => {
              layer.setVisible(layer === selectedLayer);
          });
      },
      set_grey_osm: function($el) {
          this.setBasemap(osmLayer);
          this.activeBackground = $el.id;
      },
      set_color_osm: function($el) {
          this.setBasemap(osmLayerColor);
          this.activeBackground = $el.id;

      },
  });

  createMarkup()
  Alpine.store('pluginStatus').increasePluginLoadingStatus();


};


export { initialize };
