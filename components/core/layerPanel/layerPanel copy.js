import { featureLayersGroup, map, view } from '../mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import Polygon from 'ol/geom/Polygon.js';
import {emitCustomEvent} from '../helper.js';
import feather from 'feather-icons';
import proj4 from 'proj4';
import {renderMarkupAndSetPluginReady} from '../../core/helper.js'

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
  let layerPanelEditBody = `

    <div class="position-absolute start-0 top-0 bg-white h-100 w-30 p-3 shadow z-1" id="layerPanelEditBody" x-show="$store.layerPanel.componentIsActive" x-transition>
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="layerPanelEditBodyLabel">Map Layers</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.layerPanel.show_filter()"></button>
    </div>

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
                    style="cursor:pointer"
                    class="form-check-label p-0"
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
              <div class="col-2 p-0 text-right">
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
                    'text-warning': $store.layerPanel.activeFilters.includes(layer.get('name'))
                  }"
                  @click="$store.layerPanel.openFilter(index)"
                  ><i data-feather="filter" class="size-20"></i></span>
              </div>

            </div>
        </template>
    </div>
  </div>`;

  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', layerPanelEditBody);
}

const createButtonMarkup = () => {
  let visibilityButtonHtml = `
    <div class="mx-1" :class="'order-'+$store.layerPanel.buttonDomOrder" id="layerPanelNavButton">
      <button 
        type="button" 
        x-tooltip.placement.left="'Map Layers'"
        @click="$store.layerPanel.show_filter()"
        class="btn btn-danger btn-sm btn-circle" 
        data-bs-target="#layerPanelEditBody" 
        aria-controls="layerPanelEditBody"
        :class="$store.layerPanel.componentIsActive ? 'bg-danger' : 'btn-light'"
      >
      ${feather.icons['layers'].toSvg({ width: '16', height: '16' })}
      </button>
    </div>
  `;
  
  var rightMiddleSlot = document.getElementById('rightMiddleSlot');
  rightMiddleSlot.insertAdjacentHTML('beforeend', visibilityButtonHtml);
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
    show_filter: function() {
      this.componentIsActive = !this.componentIsActive;
    },
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

  // Alpine.store('layerPanel').show_filter()


};

export { initialize };
