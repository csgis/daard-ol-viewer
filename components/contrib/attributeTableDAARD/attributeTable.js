import './attributeTable.css';

import { and, equalTo, or } from 'ol/format/filter';
import { boundingExtent, getCenter } from 'ol/extent';
import { emitCustomEvent, getBaseUrl, isValidUrl } from '../../core/helper.js'
import { featureLayersGroup, map } from '../../core/mapSetup/mapSetup.js'

import Alpine from 'alpinejs';
import { WFS } from 'ol/format';
import { decorateValue } from '../../core/contentDecorator/contentDecorator.js';
import feather from 'feather-icons';
import {renderMarkupAndSetPluginReady} from '../../core/helper.js'

const parseFilterCondition = (condition) => {
  const match = condition.match(/"([^"]+)"='([^']+)'/);
  return equalTo(match[1], match[2]);
};

var fetchFeatureData = (layerName, filterString) => {
  const Layer = featureLayersGroup.getLayers().getArray().find(layer => layer.get('name') === layerName);
  const LayerParams = Layer.getSource().getParams().LAYERS;
  const baseurl = getBaseUrl(featureLayersGroup.getLayers().getArray().find(layer => layer.get('name') === layerName).getSource().url_);

  // Construct the feature request
  let featureRequestOptions = {
    srsName: 'EPSG:3857',
    featurePrefix: 'geonode',
    featureTypes: [LayerParams],
    outputFormat: 'application/json'
  };

  // Parse the filter string and construct filter objects
  if (filterString && typeof filterString === 'string' && filterString.trim() !== '') {
    let filters;
    if (filterString.includes(' AND ')) {
      // Process AND conditions
      filters = filterString.split(' AND ').map(parseFilterCondition);
      featureRequestOptions.filter = and(...filters);
    } else if (filterString.includes(' OR ')) {
      // Process OR conditions
      filters = filterString.split(' OR ').map(parseFilterCondition);
      featureRequestOptions.filter = or(...filters);
    } else {
      // Process a single condition
      const singleFilter = parseFilterCondition(filterString);
      featureRequestOptions.filter = singleFilter;
    }
  }

  console.warn("Options are ", featureRequestOptions)


  const featureRequest = new WFS().writeGetFeature(featureRequestOptions);

  return fetch(`${baseurl}wfs`, {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
    headers: {
      'Content-Type': 'text/xml',
    },
  })
  .then(response => response.json());
}





const createMarkup = () => {
  // Plugin HTML Markup
  const attributeTableNaavigationBtn = `
      <div class="mx-1  order-2">
      <button
        type="button" 
        class="btn btn-danger btn-sm btn-circle" 
        id="attributeTableBtn" 
        x-tooltip.placement.left="'Attribute table'"
        @click="$store.attributeTable.process_attribute_table()"
        :class="$store.attributeTable.componentIsActive ? 'bg-danger' : 'btn-light'">
        <i data-feather="list" class="size-16"></i>

      </button>
    </div>
      `

  var rightMiddleSlot = document.getElementById('rightMiddleSlot');
  rightMiddleSlot.insertAdjacentHTML('beforeend', attributeTableNaavigationBtn);

  const attributeTableSlideOutHtml = `
    <div id="attributeTable" class="position-absolute bottom-0 end-0 p-0 bg-white border-top px-1" style="width: 100%; height: 40vh; z-index:1000" x-show="$store.attributeTable.componentIsActive">
      <div class="offcanvas-header d-flex justify-content-between align-items-center px-3 mt-3">
          <div class="d-flex align-items-center">
              <!-- Layer Selection -->
              <div class="layer-select-container me-2">
                  <select id="layerSelect" class="form-select form-select-sm">
                      <template x-for="option in $store.attributeTable.visisbleLayers"> 
                          <option :value="option.get('name')" x-text="option.get('name')"></option>
                      </template>
                  </select>
              </div>
              <!-- Row Count Selection -->
              <div class="ms-2"> 
                  <select x-model="$store.attributeTable.rowCount" class="form-select form-select-sm" id="rowCountSelect">
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                  </select>
              </div>
          </div>

          <div class="d-flex align-items-center">
              <!-- Items Shown Indicator -->
              <p class="mb-0 mx-3" x-text="$store.attributeTable.filteredFeatures().length + ' items shown'"></p>
           
              <!-- Search Input -->
              <div class="d-flex me-2">
                  <label for="searchInput" class="me-2 mb-0"><i class="bi bi-search"></i></label>
                  <input type="text" id="searchInput" class="form-control form-control-sm" placeholder="Search..." x-model="$store.attributeTable.searchQuery" style="width: 200px;">
              </div>

              <!-- Close Button -->
              <button type="button" class="btn-close" aria-label="Close" @click="$store.attributeTable.closePanel()"></button>
          </div>
      </div>

            <div class="offcanvas-body mt-4 px-3" id="attributeTableBody">

              <!-- table -->
              <div style="width: 100%; overflow-y: auto;">

              <!-- Alpine.js Component for Feature Properties Table -->
              <div x-cloak>
                <template x-if="!$store.attributeTable.fetchSuccessful">
                  <p>Sorry, no items received.</p>
                </template>

                <template x-if="$store.attributeTable.fetchSuccessful">
                  <table class="attributesTable table table-sm table-striped mb-0" id="attributesTable">
                    <thead>
                        <tr>
                          <th>
                            <span class="attributTable_col" x-text="'zoom to'"></span>
                          </th>
                          <template x-if="$store.attributeTable.features.length > 0">
                            <template x-for="key in Object.keys($store.attributeTable.features[0].properties)" :key="key">
                              <th>
                                <span class="attributTable_col" x-text="$store.attributeTable.getKeyTranslation(key)"></span>
                              </th>
                            </template>
                          </template>
                        </tr>
                      </thead>
                      <tbody>
                          <template x-for="feature in $store.attributeTable.paginatedFeatures()" :key="feature.id">
                          <tr :class="$store.attributeTable.activeFeatures.includes(String(feature.properties['fid'])) ? 'highlight-row' : ''">
                            <td>
                            <p x-show="!$store.attributeTable.activeFeatures.includes(String(feature.properties['fid']))">
                              <a href="#" :data-id="feature.properties['fid']" @click="$store.attributeTable.zoomTo()" >
                                  <i data-feather="map-pin" class="size-16"></i>
                              </a>      
                            </p>

                            <p x-show="$store.attributeTable.activeFeatures.includes(String(feature.properties['fid']))">
                              <a href="#" :data-id="feature.properties['fid']" @click="$store.attributeTable.zoomTo()" >
                                <i data-feather="check" class="size-16"></i>
                              </a>      
                            </p>

                            </td>
                            <template x-for="[key, value] in Object.entries(feature.properties)" :key="key">
                              <td class="attributTableTD">
                                <span class="attributTable_col" x-html="$store.attributeTable.decorateValue(value)"> </span>
                              </td>
                            </template>
                          </tr>
                        </template>
                      </tbody>
                  </table>
                </template>
                
              </div>


            
            </div>
            <!-- Pagination -->
            <template x-if="$store.attributeTable.fetchSuccessful">

              <nav aria-label="Page navigation">
                <ul class="pagination pagination-sm justify-content-end mt-3">
                  <!-- First Page Link -->
                  <li class="page-item" :class="{ disabled: $store.attributeTable.currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="$store.attributeTable.setFirstPage()">
                      First
                    </a>
                  </li>
              
                  <!-- Dynamic Page Links -->
                  <template x-for="page in $store.attributeTable.pageRange()" :key="page">
                    <li class="page-item" :class="{ active: $store.attributeTable.currentPage === page }">
                      <a class="page-link" href="#" x-text="page" @click.prevent="$store.attributeTable.setPage(page)">
                      </a>
                    </li>
                  </template>
              
                  <!-- Last Page Link -->
                  <li class="page-item" :class="{ disabled: $store.attributeTable.currentPage === $store.attributeTable.totalPages() }">
                    <a class="page-link" href="#" @click.prevent="$store.attributeTable.setLastPage()">
                      Last
                    </a>
                  </li>
                </ul>
              </nav>
              </template>
    </div>
  </div>

  `
  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', attributeTableSlideOutHtml);


}


// Initialize the plugin
const initialize = () => {

  Alpine.store('attributeTable', {
    componentIsActive: false,
    visisbleLayers: [],
    features: [],
    filterString: "",
    activeFeatures: [],
    isValidUrl: function(value){
      return isValidUrl(value);
    },

    zoomToCoordinates: [],
    closePanel: function(){
      emitCustomEvent('deleteMapPins', {});
      this.componentIsActive = false;
      this.activeFeatures = [];
      this.zoomToCoordinates = [];
      Alpine.store('pluginStatus').mapClickEnabled = true;

    },
    zoomTo: function(){
        const featureId = event.target.closest('a').getAttribute("data-id")
        const feature = this.features.find(f => f.properties['fid'] == featureId);

        if (feature) {
          const geometry = feature.geometry;
          let extent;
          let center;
          if (this.activeFeatures.includes(featureId)) {
              this.activeFeatures = this.activeFeatures.filter(function(e) { return e !== featureId })
          } else {
              this.activeFeatures.push(featureId);
          }

    
          switch (geometry.type) {
            case 'Point':
              center = geometry.coordinates;
              const buffer = 100; // Adjust buffer size as needed
              extent = [
                geometry.coordinates[0] - buffer, 
                geometry.coordinates[1] - buffer, 
                geometry.coordinates[0] + buffer, 
                geometry.coordinates[1] + buffer
              ];
              var maxZoom = 13;
              break;
    
            case 'Polygon':
              extent = boundingExtent(geometry.coordinates[0].flat());
              center = getCenter(extent);
              var maxZoom = 15;
              break;
    
            case 'MultiPolygon':
              const allPolygons = geometry.coordinates.flat(2);
              extent = boundingExtent(allPolygons);
              center = getCenter(extent);
              var maxZoom = 15;
              break;
    
            case 'LineString':
              extent = boundingExtent(geometry.coordinates);
              center = getCenter(extent);
              var maxZoom = 15;
              break;
    
            case 'MultiLineString':
              const allLines = geometry.coordinates.flat();
              extent = boundingExtent(allLines);
              center = getCenter(extent);
              var maxZoom = 15;
              break;
    
            default:
              console.error('Unsupported geometry type:', geometry.type);
              return;
          }
    
          if (extent) {

            const coordIndex = this.zoomToCoordinates.findIndex(coord => 
                coord[0] === center[0] && coord[1] === center[1]
            );

            if (coordIndex === -1) {
                // Coordinate not found, add it
                this.zoomToCoordinates.push([center[0], center[1]]);
            } else {
                // Coordinate found, remove it
                this.zoomToCoordinates.splice(coordIndex, 1);
            }

            emitCustomEvent('deleteMapPins', {});
            emitCustomEvent('addMapPins', {"pin_coordinates": this.zoomToCoordinates, "fitView": true, moveCenterLeft: false, bottomPadding: '40vh'});
        }
        }
      
    },
    searchQuery: '',
    rowCount: 5,
    currentPage: 1,
    fetchSuccessful: false,
    decorateValue: function(value) {
      const decoratedValue = decorateValue(value, ['createLinkForUrl', 'decodeUrl', 'harmonizeUnknown', 'replaceBulletwithComma']);
      return decoratedValue;
    },
    blockedKeys: [
      'c_b_t_bc_rel', 
      'svgid', 
      'c_bones', 
      'bone_relations', 
      'age', 
      'adults', 
      'subadults',
      'c_no_o_bones',
      'published',
      'gaz_link',
      'gazid',
      'uuid',
      'owner',
      'is_approved'
    ],
    keyTranslations: {
      "disease": "Disease",
      "sex": "Sex",
      "sex_freetext": "Methods for sex determination",
      "age": "Age",
      "age_class": "Age class",
      "age_estimation_method": "Methods for age estimation",
      "age_freetext": "Age comment",
      "adults": "Adults",
      "size_from": "Body height from (cm)",
      "size_to": "Body height to (cm)",
      "size_freetext": "Methods for body height calculation",
      "chronology": "Time period",
      "chronology_freetext": "Time period comment",
      "dating_method": "Dating method",
      "subadults": "Subadults",
      "c_no_o_bones": "Amount of bones",
      "c_technic": "Used Technic",
      "doi": "Doi",
      "dna_analyses": "aDNA analyses",
      "dna_analyses_link": "DNA analyses",
      "storage_place": "Storage place",
      "storage_place_freetext": "Storage place freetext",
      "archaeological_burial_type": "Archaeological burial type",
      "archaeological_funery_context": "Archaeological funerary context",
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
      "fid": "Datbase ID",
      "comment": "Comment"

    },
    getKeyTranslation: function(value){
      const translatedKey = this.keyTranslations[value] || value;
      return translatedKey
    },
    filteredFeatures: function() {
      feather.replace();

      const query = this.searchQuery.toLowerCase();
      const filtered = this.features.filter(feature => {
        return Object.entries(feature.properties).some(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value.toString().toLowerCase().includes(query);
          }
          return false;
        });
      });

      // WORKAROUND: Inform the DAARD Filter component about current found features.
      Alpine.store('geonodeCustomLayerFilter').layerFeaturesOnMap['Daard Database'] = filtered.length

      return filtered;
    },

    // New function to get the features for the current page
    paginatedFeatures: function() {
      const start = (this.currentPage - 1) * this.rowCount;
      const end = start + Number(this.rowCount);
      const paginated = this.filteredFeatures().slice(start, end);
      console.log(`Paginated Features: Current Page = ${this.currentPage}, Row Count = ${this.rowCount}, Start = ${start}, End = ${end}, Count = ${paginated.length}`);
      return paginated;
    },

    // Adjust totalPages to use the length of filteredFeatures instead of paginatedFeatures
    totalPages: function() {
      const filteredCount = this.filteredFeatures().length;
      return Math.ceil(filteredCount / this.rowCount);
    },
    setPage: function(page) {
      this.currentPage = page;
    },

    pageRange: function() {
      const range = 2; // Number of pages to display around the current page
      const start = Math.max(1, this.currentPage - range);
      const end = Math.min(this.totalPages(), this.currentPage + range);
    
      let pages = [];
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      return pages;
    },
  
    setFirstPage: function() {
      this.currentPage = 1;
    },

    setLastPage: function() {
      this.currentPage = this.totalPages();
    },
  
    setPage: function(page) {
      this.currentPage = page;
      console.log(`Set Page: Current Page Set to = ${page}`);
    },
    
    process_attribute_table: function() {
      Alpine.store('pluginStatus').closeAllOffcanvas('attributeTable');
      this.componentIsActive = !this.componentIsActive;
      Alpine.store('pluginStatus').mapClickEnabled = this.componentIsActive ? false : true;

      this.populateLayerSelect();
    },

    populateLayerSelect: function() {
      const visibleLayers = featureLayersGroup.getLayers().getArray().filter(layer => layer.getVisible());
      this.visisbleLayers = visibleLayers;
      if (visibleLayers.length > 0) {
        this.selectedLayer = visibleLayers[0].get('name');
        this.updateTableForLayer(this.selectedLayer); // Load table for the first layer
      }
    },

    updateRowCount: function() {
      this.currentPage = 1;
      console.log(`Row Count Updated: New Row Count = ${this.rowCount}, Current Page Reset to = ${this.currentPage}`);
    },

    updateTableForLayer: function(layerName = null) {
      console.log("updating with: ", this.filterString);
      this.currentTable = true;
      const selectedLayer = layerName || document.getElementById('layerSelect').value;
      const Layer = featureLayersGroup.getLayers().getArray().find(layer => layer.get('name') === selectedLayer);
    
      this.activeFeatures = [];
      this.zoomToCoordinates = [];
      emitCustomEvent('deleteMapPins', {});
      emitCustomEvent('showLoading', {});
    
      fetchFeatureData(selectedLayer, this.filterString)
        .then(data => {
          if (data && data.features) {
            const translationKeys = Object.keys(this.keyTranslations);
            
            const sortedFeatures = data.features.map(feature => {
              const filteredPropertyKeys = Object.keys(feature.properties)
                .filter(key => !this.blockedKeys.includes(key))  // Filter out blocked keys
                .sort((a, b) => {
                  const indexA = translationKeys.indexOf(a);
                  const indexB = translationKeys.indexOf(b);
                  return (indexA !== -1 ? indexA : Infinity) - (indexB !== -1 ? indexB : Infinity);
                });
    
              const sortedProperties = {};
              filteredPropertyKeys.forEach(key => {
                sortedProperties[key] = feature.properties[key];
              });
    
              return { ...feature, properties: sortedProperties };
            });
    
            // Apply additional processing if necessary, like filtering based on visibility
            this.features = sortedFeatures;
            this.fetchSuccessful = true;
          } else {
            this.fetchSuccessful = false;
          }
          emitCustomEvent('hideLoading', {});
        })
        .catch(error => {
          console.error('Error:', error);
          this.fetchSuccessful = false;
        });
    },
    
    
    
    
  });


  const domElementsToCreate = [ 
    [createMarkup, '#attributeTable']
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)


  // Event listener for layer select change
  document.getElementById('layerSelect').addEventListener('change', function() {
    Alpine.store('attributeTable').updateTableForLayer(this.value);
  });

  // Event listener for upated filter
  document.addEventListener('geonodeCustomLayerFilterUpdated', function (event) {
    console.debug('Custom event "geonodeCustomLayerFilterClosed" caught.');
    Alpine.store('attributeTable').filterString = Alpine.store('geonodeCustomLayerFilter').allFormValues['daard-database'];
    Alpine.store('attributeTable').updateTableForLayer('Daard Database');
  });
};


export { initialize };