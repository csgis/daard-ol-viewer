import './legend.css';

import Alpine from 'alpinejs';
import ImageWMS from 'ol/source/ImageWMS.js';
import VectorSource from 'ol/source/Vector.js';
import feather from 'feather-icons';
import { featureLayersGroup } from '../core/mapSetup/mapSetup.js';
import {renderMarkupAndSetPluginReady} from '../core/helper.js'

const createMarkupButton = () => {
    const buttonHtml = `
      <div x-data="{ get legend() { return $store.legend; } }" class="mx-1" :class="'order-'+legend.buttonDomOrder" id="legendNavButton">
        <button type="button" 
          class="btn btn-danger btn-sm btn-circle" 
          x-tooltip.placement.left="'Legend'"
          @click="legend.toggleLegend($el)"
          :class="legend.componentIsActive ? 'bg-danger' : 'btn-light'">
          <i data-feather="info" class="size-16"></i>
          </button>
      </div>
    `;
  
    // insert the plugin markup where we need it
    document.getElementById('rightMiddleSlot').insertAdjacentHTML('beforeend', buttonHtml);

  };

const createMarkupContainer = () => {

    const slideOut = `
          <div x-data="{ get legend() { return $store.legend; } }" id="legendContainer">
          <div x-show="legend.showLegend">
              <div class="accordion" id="legendAccordion">
                  <template x-for="item in legend.visibleLayers" :key="item.get('name')">
                      <div class="accordion-item">
                          <p class="accordion-header py-0">
                              <button class="accordion-button py-1 btn-light btn-sm" type="button" @click="legend.toggleDetails(item)">
                                  <span x-text="item.get('name')"></span>
                              </button>
                          </p>
                          <div class="accordion-collapse collapse" :class="{'show': item.showDetails}">
                              <div class="accordion-body">
                                  <img :src="legend.getLegendUrl(item)" alt="" x-show="item.get('type') === 'WMS' || item.get('type') === 'geonode'">
                                  <span x-show="item.get('type') !== 'WMS' && item.get('type') !== 'geonode'">This layer does not support dynamic legend creation.</span>
                              </div>
                          </div>
                      </div>
                  </template>
              </div>
          </div>
      </div>
    `;
  
    // Replace the content of rightBottomSlot
    document.getElementById('rightBottomSlot').innerHTML = slideOut;
  };
  

const initialize = (buttonDomOrder) => {

  Alpine.store('legend', {
    componentIsActive: false,
    buttonDomOrder: buttonDomOrder,
    showLegend: false,
    visibleLayers: featureLayersGroup.getLayers().getArray().filter(layer => layer.getVisible()),

    toggleLegend() {
      this.componentIsActive = !this.componentIsActive;
      this.showLegend = !this.showLegend;
      this.updateVisibleLayers();
    },

    updateVisibleLayers() {
      this.visibleLayers = featureLayersGroup.getLayers().getArray().filter(layer => layer.getVisible());
      if (this.visibleLayers.length == 1){
        const firstLayer = this.visibleLayers[0]
       this.toggleDetails(firstLayer);
      }
    },

    getLegendUrl(layer) {
      const source = layer.getSource();
      let baseUrl = typeof source.getUrl === 'function' ? source.getUrl() : source.getUrl;
      const rootUrlRegex = /(https?:\/\/[^/]+\/[^/]+)\//;
      const match = baseUrl.match(rootUrlRegex);
      const basePart = match ? match[1] : baseUrl;

      if (layer.getSource() instanceof ImageWMS) {
        return `${basePart}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${source.getParams()['LAYERS']}`;
      } else if (source instanceof VectorSource) {
        return `${basePart}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layer.get('layername')}`;
      } else {
        return '';
      }
    },
    toggleDetails(item) {
      console.log(item)
      item.showDetails = !item.showDetails; // Toggle the visibility of the item
    }
  });


  const domElementsToCreate = [ 
    [createMarkupButton, '#legendNavButton'],
    [createMarkupContainer, '#legendContainer']
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)


  // Catch the custom event and execute a function to update the legend
  document.addEventListener('mapLayerHaveChanged', function (event) {
    console.debug('Custom event "mapLayerHaveChanged" caught. Updating legend Markup');
    Alpine.store('legend').updateVisibleLayers();
  });


};

export { initialize };
