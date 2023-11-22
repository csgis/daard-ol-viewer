import './layerPanel.css';

import { emitCustomEvent, waitForElementAndExecute } from '../helper.js';
import { featureLayersGroup, map, view } from '../mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import Polygon from 'ol/geom/Polygon.js';
import feather from 'feather-icons';
import proj4 from 'proj4';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

function isValid4326Coordinates(coordinates) {
  if (!Array.isArray(coordinates)) return false;

  for (const coord of coordinates) {
    if (!Array.isArray(coord) || coord.length !== 2) return false;
    const [longitude, latitude] = coord;
    if (
      typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90 ||
      typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180
    ) {
      return false;
    }
  }
  return true;
}

const transformExtent = (extent, sourceSRID) => {
  const targetProjection = 'EPSG:3857';
  return extent.map(subArray => {
    const coord = proj4(sourceSRID, targetProjection, subArray);
    console.log(coord)
    return [coord[0], coord[1]];
  });
}

const createOffCanvasMarkup = () => {
  let layerPanelBodyMarkup = `

    <div class="overflow-auto" id="layerPanelEditBody" x-show="$store.layerPanelContainer.sectionActive == 'layer-edit'">

    <div class="offcanvas-body p-3">
        <template x-for="(layer, index) in $store.layerPanel.ol_feature_layers" :key="index">
          <div class="row p-0 border-top py-2" :class="{ 'bg-warning': $store.layerPanel.layerCheckbox.includes(layer.get('name')) }">
              <div class="col-1 form-check form-switch pe-0">
              <input 
                x-tooltip.placement.right="'Show/Hide Layer ' + layer.getVisible()"
                class="form-check-input" 
                type="checkbox" 
                :id="'layerCheckbox' + layer.get('name')" 
                x-bind:checked="layer.getVisible()" 
                @click="$store.layerPanel.toggleLayerVisibility(index)">
              </div>
              <div class="col-5 form-check p-0" x-tooltip.placement.top="'Click to Select Layer'">
                <input 
                  class="form-check-input d-none p-0"
                  type="checkbox" 
                  :id="'layerselectCheckbox' + layer.get('name')" 
                  :checked="$store.layerPanel.layerCheckbox.includes(layer.get('name'))"
                  @change="$store.layerPanel.handleCheckboxChange(layer.get('name'), $event.target.checked)">              
                  <label 
                    class="form-check-label p-0 layer-label"
                    x-text="layer.get('name')" 
                    :for="'layerselectCheckbox' + layer.get('name')"
                  ></label>
              </div>
              <div class="form-range-container col-3 position-relative p-0">
              <input type="range" class="form-range p-0"
                min="0" 
                max="1" 
                step="0.01" 
                x-init="layer.opacity = layer.opacity || 1" 
                x-model="layer.opacity" 
                x-tooltip.placement.top="'Change opacity'"
                x-on:input="$store.layerPanel.changeLayerOpacity(index)" 
                :disabled="!layer.getVisible()">
              </div>
              <div class="col p-0 text-right">
                  <span 
                  x-tooltip.placement.top="'Layer Info'"
                  class="d-inline"
                  :class="{'disabled opacity-5' : (layer.get('type') !== 'geonode')}"
                  @click="$store.layerPanel.zoomToLayerExtent(index)"
                  ><i data-feather="info" class="size-20"></i></span>

                  <span 
                  x-tooltip.placement.top="'Zoom to layer'"
                  class="d-inline"
                  :class="{'disabled opacity-5' : (layer.get('type') !== 'geonode')}"
                  @click="$store.layerPanel.zoomToLayerExtent(index)"
                  ><i data-feather="zoom-in" class="size-20"></i></span>

                <span 
                  style="cursor:pointer"
                  x-show="$store.layerPanel.showFilter"
                  x-tooltip.placement.left="'Show filter'"
                  :class="{
                    'disabled opacity-5': (layer.get('type') !== 'geonode' && layer.get('type') !== 'WMS'),
                    'text-danger': $store.layerPanel.activeFilters.includes(layer.get('name'))
                  }"
                  @click="$store.layerPanel.openFilter(index)"
                  ><i data-feather="filter" class="size-20"></i></span>
              </div>

            </div>
        </template>
    </div>
  </div>`;

  var layerPanelContainerNavBody = document.getElementById('layerPanelContainerBody');
  layerPanelContainerNavBody.insertAdjacentHTML('beforeend', layerPanelBodyMarkup);

  // waitForElementAndExecute('layerPanelContainerBody')
  // .then(() => {
  //   var layerPanelContainerNavBody = document.getElementById('layerPanelContainerBody');
  //   layerPanelContainerNavBody.insertAdjacentHTML('beforeend', layerPanelBodyMarkup);
  //   console.log('- layerPanelBodyMarkup added')

  // })
  // .catch((error) => {
  //   console.error(error.message);
  // });
}

const createButtonMarkup = () => {
    let toggleLayerContainerBtn = `
        <button 
          id="layerPanelNavButton"
          type="button" 
          x-tooltip.placement.right="'Map Layers'"
          class="btn btn-inactive btn-square-md rounded-0 m-0 border-0 shadow-none text-dark d-block"
          :class="{'bg-light' : $store.layerPanelContainer.sectionActive == 'layer-edit',
          ['order-' + $store.layerPanel.buttonDomOrder]: true}"
          @click="$store.layerPanelContainer.setSectionActive('layer-edit')">          
            <i data-feather="layers" class="size-16"></i>

        </button>

    `;
    

    var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerNavBar');
    layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', toggleLayerContainerBtn);
    
    // waitForElementAndExecute('layerPanelContainerNavBar')
    // .then(() => {
    //   var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerNavBar');
    //   layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', toggleLayerContainerBtn);
    //   console.log('- toggleLayerContainerBtn added')
    // })
    // .catch((error) => {
    //   console.error(error.message);
    // });



}



const initialize = async (buttonDomOrder) => {

  const pluginStatus = Alpine.store('pluginStatus');
  const showFilter = pluginStatus.registeredPluginNames.includes('filterLayer');

  Alpine.store('layerPanel', {
    componentIsActive: false,
    buttonDomOrder: buttonDomOrder,
    layerCheckbox: [],
    activeFilters: [],
    showFilter: showFilter,
    ol_feature_layers: featureLayersGroup.getLayers().getArray(),
    handleCheckboxChange: function(layerName, isChecked) {
      if (isChecked) {
        if (!this.layerCheckbox.includes(layerName)) {
          this.layerCheckbox.push(layerName);
        }
      } else {
        this.layerCheckbox = this.layerCheckbox.filter(name => name !== layerName);
      }
      console.debug(`Checkbox for ${layerName} is now ${isChecked ? 'checked' : 'unchecked'}`);
      console.debug(this.layerCheckbox);
      emitCustomEvent('mapLayerSelected', {'layer': this.layerCheckbox})
    },
    toggleLayerVisibility: function (index) {
      const layer = this.ol_feature_layers[index];  
      layer.visible = !layer.getVisible();
      layer.setVisible(layer.visible);
      
      // Emit event when layer visibility changed
      emitCustomEvent('mapLayerHaveChanged', {})
    },
    changeLayerOpacity: function(index) {
      const layer = this.ol_feature_layers[index];
      const layerToChangeOpacity = featureLayersGroup.getLayers().getArray()[index];
      // Ensure opacity is a number between 0 and 1
      layer.opacity = Math.max(0, Math.min(1, layer.opacity));
      layerToChangeOpacity.setOpacity(layer.opacity);
    },
    zoomToLayerExtent: function(index) {
      const layer = this.ol_feature_layers[index];
      // Todo: check if we can/should use "extent" key from api instead
      const extent = layer.get('dataset').ll_bbox_polygon.coordinates.flat()

      if (isValid4326Coordinates(extent)) {
        try {
          const transformedExtent = transformExtent(extent, 'EPSG:4326')
          const polygon = new Polygon([transformedExtent]);
      
          view.fit(polygon.getExtent(), {
            padding: [100, 100, 100, 100],
          });
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
      } else {
        console.error('Invalid EPSG:4326 coordinates');
      }
    },
    openFilter: function(index){
      const layer = this.ol_feature_layers[index];
      const source = layer.getSource();
      source.mapName = layer.get('name');
      source.dataset = layer.get('dataset');
      emitCustomEvent('filterPushed', {"instance": source})
    },
    isFilterActive: function(layername){
      console.log("checking for")
      console.log(layername)
      activeFilters = this.activeFilters;
      return activeFilters.includes(layername)
    }
  });

  const domElementsToCreate = [
    [createOffCanvasMarkup, '#layerPanelEditBody'],
    [createButtonMarkup, '#layerPanelNavButton'],
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)

  Alpine.effect(() => {
    console.log(Alpine.store('layerPanel').componentIsActive)
  });



};

export { initialize };
