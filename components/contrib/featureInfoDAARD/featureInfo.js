import './featureInfo.css';

import { buildLink, renderMarkupAndSetPluginReady } from '../../core/helper.js'
import { featureLayersGroup, map, view } from '../../core/mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import { addClickIndicator } from '../../core/clickIndicator/clickIndicator.js';
import { decorateValue } from '../../core/contentDecorator/contentDecorator.js';
import { emitCustomEvent } from '../../core/helper.js';
import { generateColoredSvg } from './bonesSvgGenerator.js';

const createFeatureInfoOffCanvasMarkup = () => {
  const featureInfoOffcanvas = `
  <div id="featureInfoOffcanvas" class="position-absolute end-0 top-0 bg-white h-100 w-50 p-3 shadow overflow-scroll" tabindex="-1" aria-labelledby="featuresOffcanvasLabel" x-show="$store.featureInfoStore.showOffCanvas" style="z-index:1001" x-transition>
  <!-- Offcanvas Header -->
  <div class="offcanvas-header d-flex justify-content-between">
    <h5 class="offcanvas-title" id="featuresOffcanvasLabel">Feature Information</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.featureInfoStore.closePanel()"></button>
  </div>

  <!-- Layer Selection -->
  <div class="my-3">
  <label for="layerSelect">Data found on the following layers:</label>
  <select class="form-select" x-model="$store.featureInfoStore.selectedOption" x-on:change="$store.featureInfoStore.changeSelect($event.target.value)" :disabled="Object.keys($store.featureInfoStore.featuresDict).length == 1">
    <template x-for="option in Object.keys($store.featureInfoStore.featuresDict)" :key="option">
      <option :value="option" x-text="option"></option>
    </template>
  </select>
</div>


  <!-- Feature Container -->
  <div class="offcanvas-body featureInfoContainer">
    <!-- Navigation Buttons -->
    <div class="text-center my-2">
      <button class="btn btn-outline-primary btn-sm mx-1" @click="$store.featureInfoStore.showPrevious()" x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == 0" x-show="$store.featureInfoStore.filteredFeatures.length > 1">Previous</button>
      <span x-text="$store.featureInfoStore.currentFeatureIndex + 1 + ' of ' + $store.featureInfoStore.filteredFeatures.length" x-show="$store.featureInfoStore.filteredFeatures.length > 1"></span>
      <button class="btn btn-outline-primary btn-sm mx-1" @click="$store.featureInfoStore.showNext()" x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == $store.featureInfoStore.filteredFeatures.length - 1" x-show="$store.featureInfoStore.filteredFeatures.length > 1">Next</button>
    </div>
    
    <!-- Feature Properties Table -->
    <template x-if="$store.featureInfoStore.filteredFeatures.length > 0">
      <table class="table table-sm table-striped">
        <tbody>
          <tr>
            <td></td>
            <td class="text-end">
              <button
                class="btn btn-primary btn-sm"
                :disabled="$store.featureInfoStore.disableButton()"
                @click="$store.featureInfoStore.addToCompareTool($event)">add to compare tool</button>
            </td>
        </tr>
          <template x-if="$store.featureInfoStore.filteredFeatures[$store.featureInfoStore.currentFeatureIndex]">

            <template x-for="[key, value] in $store.featureInfoStore.getFilteredFeatures()" :key="key">
              <template x-if="$store.featureInfoStore.filteredFeatures">
                    <tr>
                      <td><strong x-text="$store.featureInfoStore.getKeyTranslation(key)"></strong></td>
                      <td><span x-html="$store.featureInfoStore.decorateValue(value)"></span></td>
                    </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>
    </template>

    <template x-if="$store.featureInfoStore.currentSkullSVG.length > 4">
        <div class="row w-100">
          <div class="col-6" x-html="$store.featureInfoStore.svgContent($store.featureInfoStore.currentSkullSVG)"></div>
          <div class="col-6">
          <div class="legend col">
              <div class="rect dark"></div> bone preservation &gt;75% <br>
              <div class="rect grey"></div> bone preservation &lt;75% <br>
              <div class="rect pale"></div> affected <br>
              <div class="rect white"></div>  unknown / absent <br>
          </div>
          </div>
        </div>
    </template>
  </div>
</div>

  `;

  const mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', featureInfoOffcanvas);
};


const initialize = () => {
  Alpine.store('featureInfoStore', {
    featuresDict: {},
    filteredFeatures: [],
    currentFeatureIndex: 0,
    selectedOption: "",
    showOffCanvas: false,
    visibleLayers: [],
    selectedLayers: [],
    currentSkullSVG: "",
    getFilteredFeatures: function() {
      if (!this.filteredFeatures[this.currentFeatureIndex]) {
        return [];
      }
    
      const properties = this.filteredFeatures[this.currentFeatureIndex].properties;
    
      // Filter out blocked keys and empty values
      const filteredPropertiesArray = Object.entries(properties).filter(([key, value]) => {
        return !this.isBlacklistedKey(key) && this.valueIsSet(value);
      });
    
      // Sort the array based on the order in keyTranslations
      const sortedPropertiesArray = filteredPropertiesArray.sort((a, b) => {
        const orderA = Object.keys(this.keyTranslations).indexOf(a[0]);
        const orderB = Object.keys(this.keyTranslations).indexOf(b[0]);
    
        if (orderA === -1 && orderB === -1) {
          return 0;
        } else if (orderA === -1) {
          return 1;
        } else if (orderB === -1) {
          return -1;
        } else {
          return orderA - orderB;
        }
      });
    
      console.log("sorted and filtered properties", sortedPropertiesArray);
      return sortedPropertiesArray;
    },
    
    
    keyTranslations: {
      "disease": "Disease",
      "sex": "Sex",
      "age": "Age",
      "age_class": "Age class",
      "age_freetext": "Age commennt",
      "adults": "Adults",
      "dating_method": "Dating method",
      "chronology": "Chronology",
      "chronology_freetext": "Chronology comment",
      "subadults": "Subadults",
      "c_no_o_bones": "Amount of bones",
      "c_technic": "Used Technic",
      "doi": "Doi",
      "dna_analyses_link": "DNA analyses",
      "storage_place": "Storage place",
      "storage_place_freetext": "Storage place method",
      "archaeological_burial_type": "Archaeological burial type",
      "archaeological_funery_context": "Archaeological funery context",
      "archaeological_individualid": "Archaeological individual ID",
      "archaeological_tombid": "Archaeological tomb ID",
      "gaz_link": "iDAI.gazetteer link",
      "gazid": "iDAI.gazetteer ID",
      "site": "Site",
      "origin": "Origin",
      "reference_images": "Reference images",
      "references": "References",
      "uuid": "UUID",
      "owner": "Owner",
      "fid": "Datbase ID"
    },
    getKeyTranslation: function(value){
      const translatedKey = this.keyTranslations[value] || value;
      return translatedKey
    },
    closePanel: function () {
      this.showOffCanvas = false;
      emitCustomEvent('deleteMapPins', {})
    },
    buildLink: function(value){
      return buildLink(value)
    },
    valueIsSet: function(value){
      var ret = value !== false && value !== undefined && value !== null &&  value !== "";
      return ret;
    },
    decorateValue: function(value) {
      const decoratedValue = decorateValue(value, ['appendEuroToNumber', 'createLinkForUrl', 'decodeUrl', 'replaceBullet']);
      return decoratedValue;
    },
    isBlacklistedKey: function(key) {
      let blockedKeys = ['c_b_t_bc_rel', 'svgid', 'c_bones', 'bone_relations']
      let isNotBlocked = blockedKeys.includes(key)
      return isNotBlocked;
    },
    svgContent: function(value){
      let decoded = decodeURIComponent(value)
      let json_str = JSON.stringify(decoded);
      return generateColoredSvg(decoded);
    },
    init: function() {
      this.updateVisibleLayers();
      this.updateSelectedOption();
    },
    updateVisibleLayers: function() {
      this.visibleLayers = featureLayersGroup.getLayers().getArray().filter(layer => 
        layer.getVisible() && (this.selectedLayers.length === 0 || this.selectedLayers.includes(layer.get('name')))
      );
    },
    updateSelectedOption: function() {
      this.selectedOption = this.visibleLayers.length > 0 ? this.visibleLayers[0].get('name') : '';
    },
    changeSelect: function(value) {
      this.currentFeatureIndex = 0;
      this.filteredFeatures = this.featuresDict[value] || [];
    },

    showNext: function() {
      if (this.currentFeatureIndex < this.filteredFeatures.length - 1) {
        this.currentFeatureIndex++;
        this.updateCurrentSkullSVG();
      }
    },
  
    showPrevious: function() {
      if (this.currentFeatureIndex > 0) {
        this.currentFeatureIndex--;
        this.updateCurrentSkullSVG();
      }
    },
  
    updateCurrentSkullSVG: function() {
      const currentFeature = this.filteredFeatures[this.currentFeatureIndex];
      if (currentFeature && currentFeature.properties.svgid) {
        this.currentSkullSVG = currentFeature.properties.svgid;
      }
    },

    handleFeatureInfo: function(evt) {
      emitCustomEvent('showLoading', {});
      this.resetFeatureInfo();
    
      const viewResolution = view.getResolution();
      let allLayersProcessed = 0;
      const totalVisibleLayers = this.visibleLayers.length;
    
      this.visibleLayers.forEach(layer => this.processLayer(layer, evt.coordinate, viewResolution, () => {
        allLayersProcessed++;
        if (allLayersProcessed === totalVisibleLayers) {
          this.updateAfterProcessing(evt);
        }
      }));
    },
    resetFeatureInfo: function() {
      this.featuresDict = {};
      this.currentFeatureIndex = 0;
      this.currentSkullSVG = "";
    },
    processLayer: function(layer, coordinate, resolution, callback) {
      if (!layer.getVisible()) return;
  
      const url = layer.getSource().getFeatureInfoUrl(coordinate, resolution, 'EPSG:3857', 
                                                      { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 200 });
  
      if (url) {
        console.warn('making a fetch request in feature info')
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (Object.keys(data.features).length > 0) {
              
              window.daard_items = data;
              this.processFeatureData(layer, data);
              // Set currentSkullSVG for the first feature if it exists
              if (data.features.length > 0 && data.features[0].properties.svgid) {
                this.currentSkullSVG = data.features[0].properties.svgid;
              }
            }
            callback();
          })
          .catch(error => {
            console.error('Error:', error);
            emitCustomEvent('hideLoading', {});
          });
      }
    },
    processFeatureData: function(layer, data) {
      const visibleAttributes = layer.get('dataset')['attribute_set']
                                    .filter(item => item.visible)
                                    .map(item => item.attribute);

      this.featuresDict[layer.get('name')] = data.features.map(feature => ({
        ...feature,
        properties: this.filterFeatureProperties(feature.properties, visibleAttributes)
      }));
    },
    filterFeatureProperties: function(properties, visibleAttributes) {
      return Object.keys(properties)
        .filter(key => visibleAttributes.includes(key))
        .reduce((obj, key) => {
          obj[key] = properties[key];
          return obj;
        }, {});
    },
    updateAfterProcessing: function(evt) { // Accept evt as a parameter
      const firstLayerName = Object.keys(this.featuresDict)[0];
      if (firstLayerName) {
        this.filteredFeatures = this.featuresDict[firstLayerName];
        this.selectedOption = firstLayerName;
      }
      emitCustomEvent('hideLoading', {});
    
      if (this.isFeaturesDictNotEmpty()) {
        this.showOffCanvas = true;
        // addClickIndicator(evt, 3); 

        // add pin to vector layer
        const coordinate = evt.coordinate;
        const pin_coordinates = [[coordinate[0], coordinate[1]]]
        emitCustomEvent('deleteMapPins', {})
        emitCustomEvent('addMapPins', {"pin_coordinates": pin_coordinates, "fitView": true, moveCenterLeft: true})


      } else {
        console.log("The dictionary is empty.");
      }
    },
    isFeaturesDictNotEmpty: function() {
      return Object.keys(this.featuresDict).length > 0;
    },
    disableButton: function() {
      const currentUUID = this.filteredFeatures[this.currentFeatureIndex].properties.uuid;
      const basketItems = Alpine.store('compareTool').items.disease_case;

      let is_uuid_present = basketItems.find(
        is_uuid_present => is_uuid_present.properties.uuid == currentUUID
        );
      is_uuid_present = is_uuid_present ? true : false;
      return is_uuid_present;

    },
    addToCompareTool: function(evt) {
      this.disableButton();
      // evt.target.disabled = true;
      const item_uuid = this.filteredFeatures[this.currentFeatureIndex].properties.uuid;
      // event.target.disabled = true;
      const disease_case_from_result = Alpine.store("compareTool").find_in_response(
          window.daard_items,
          item_uuid
      );
      Alpine.store("compareTool").update_disease_case_store(disease_case_from_result);
  }
  });

  const domElementsToCreate = [
    [createFeatureInfoOffCanvasMarkup, '#featureInfoOffcanvas'],
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('mapLayerHaveChanged', function (event) {
      console.debug('Custom event "mapLayerHaveChanged" caught.');
      Alpine.store('featureInfoStore').init();
    });

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('mapLayerSelected', function (event) {
      console.debug('Custom event "mapLayerSelected" caught.');
      Alpine.store('featureInfoStore').selectedLayers = event.detail.layer;
      Alpine.store('featureInfoStore').init();
    });

    function onMapClick(event) {
      if(!Alpine.store('pluginStatus').mapClickEnabled){
        return false;
      }
      const handleFeatureInfo = Alpine.store('featureInfoStore').handleFeatureInfo.bind(Alpine.store('featureInfoStore'));
      handleFeatureInfo(event);
  }
  
  Alpine.nextTick(() => {
      map.on('singleclick', onMapClick);
  });
  

}


export { initialize };
