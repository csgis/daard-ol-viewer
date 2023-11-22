import { boundingExtent, getCenter } from 'ol/extent';
import { featureLayersGroup, map } from '../mapSetup/mapSetup.js'
import { getBaseUrl, isValidUrl } from '../helper.js'

import Alpine from 'alpinejs';
import { DataTable } from "simple-datatables"
import { WFS } from 'ol/format';
import { addClickIndicator } from '../clickIndicator/clickIndicator.js';
import feather from 'feather-icons';
import {renderMarkupAndSetPluginReady} from '../helper.js'

// Function to fetch feature data from WFS
const fetchFeatureData = (layerName) => {
  console.warn("fetching feature data")
  const Layer = featureLayersGroup.getLayers().getArray().find(layer => layer.get('name') === layerName);
  const LayerParams = Layer.getSource().getParams().LAYERS;

  const baseurl = getBaseUrl(featureLayersGroup.getLayers().getArray().find(layer => layer.get('name') === layerName).getSource().url_);

  const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featurePrefix: 'geonode',
    featureTypes: [LayerParams],
    outputFormat: 'application/json',
  });


  return fetch(`${baseurl}wfs`, {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
    headers: {
      'Content-Type': 'text/xml',
    },
  })
  .then(response => response.json());
}

// Function to generate table content
const generateTableContent = (features) => {
  let content = '<table class="attributesTable"><thead><tr>';
  const attributes = features[0].properties;

  content += `<th>zoom to</th>`;

  for (const key in attributes) {
    if (key == 'svgid' || key == "bone_relations" || key == "c_b_t_bc_rel" || key == "c_bones" || key == "references" || key == 'uuid'){
      continue;
    }
    content += `<th>${key}</th>`;
  }

  content += '</tr></thead><tbody>';

  features.forEach(feature => {
    const properties = feature.properties;
    content += '<tr>';
    content += `<td><a href="#" data-id='${properties['fid']}' class='clicklink'>${feather.icons['map-pin'].toSvg({ width: '16', height: '16' })}</a></td>`;

    for (const key in properties) {
      if (key == 'svgid' || key == "bone_relations" || key == "c_b_t_bc_rel" || key == "c_bones" || key == "references" || key == 'uuid'){
        continue;
      }
      if (isValidUrl(properties[key])) {
        content += `<td><a href="${properties[key]}" target="_blank">${properties[key]}</a></td>`;
      } else {
        content += `<td>${properties[key]}</td>`;
      }
    }

    content += '</tr>';
  });

  content += '</tbody></table>';

  return content;
}

// Function to initialize DataTable
const initializeDataTable = () => {
  const tableElement = document.querySelector('.attributesTable');
  if (tableElement) {
    new DataTable('.attributesTable', {
      perPage: 5,
      class: 'table'
    });

    // Add classes to the table element
    tableElement.classList.add('table');
    tableElement.classList.add('table-striped');
  } else {
    console.error('Table element not found');
  }

  const searchInput = document.querySelector('.datatable-input');
  if (searchInput) {
    // Add classes to the search input
    searchInput.classList.add('form-control');
  } else {
    console.error('Search input not found');
  }
}

// Function to add event listener for clicklink
const addClickLinkEventListener = (features) => {
  
  document.addEventListener('click', function(event) {
    const clickLink = event.target.closest('a.clicklink');
    if (clickLink) {
      event.preventDefault();
      const featureId = clickLink.getAttribute('data-id');
      const feature = features.find(f => f.properties['fid'] == featureId);
  
      if (feature) {
        const geometry = feature.geometry;
        let extent;
        let center;
  
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
          console.log('Zooming to extent:', extent);
          map.getView().fit(extent, { padding: [50, 50, 500, 50], maxZoom: maxZoom });
          const indicatorEvent = { coordinate: center };
          addClickIndicator(indicatorEvent);
        }
      }
    }
  });
  
  
  
}


// Main function to get attribute table data
const getAttributeTableData = () => {
  fetchFeatureData()
    .then(data => {
      const features = data.features;
      const content = generateTableContent(features);
      this.currentTable = content;
      addClickLinkEventListener(features);
    })
    .catch(error => {
      console.error('Error:', error);
    });
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
        ${feather.icons['list'].toSvg({ width: '16', height: '16' })}
      </button>
    </div>
      `

  var rightMiddleSlot = document.getElementById('rightMiddleSlot');
  rightMiddleSlot.insertAdjacentHTML('beforeend', attributeTableNaavigationBtn);

  const attributeTableSlideOutHtml = `
    <div id="attributeTable" class="position-absolute bottom-0 end-0 p-0 bg-white border-top" style="width: 100%; height: 57vh; z-index:1000" x-show="$store.attributeTable.componentIsActive">
      <div class="offcanvas-header d-flex justify-content-between align-items-center px-3 mt-3">
        <div class="layer-select-container">
          <select id="layerSelect" class="form-select form-select-sm">
            <template x-for="option in $store.attributeTable.visisbleLayers">
              <option :value="option.get('name')" x-text="option.get('name')"></option>
            </template>
          </select>
        </div>
        <button type="button" class="btn-close" aria-label="Close" @click="$store.attributeTable.componentIsActive = false"></button>
      </div>

    <div class="offcanvas-body mt-4" id="attributeTableBody">
      <div style="height: calc(100% - 1.5rem); width: 100%; overflow-y: auto;" class="px-3">
        <div x-html="$store.attributeTable.currentTable || 'No data replied.'"></div>
      </div>
    </div>
  </div>

  `
  console.log("getting map div")
  var mapDIV = document.getElementById('map');
  console.log(mapDIV);
  mapDIV.insertAdjacentHTML('afterend', attributeTableSlideOutHtml);


}


// Initialize the plugin
const initialize = () => {


  Alpine.store('attributeTable', {
    componentIsActive: false,
    visisbleLayers: [],
    currentTable: false,
    process_attribute_table: function() {
      Alpine.store('pluginStatus').closeAllOffcanvas();
      this.componentIsActive = !this.componentIsActive;
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

    updateTableForLayer: function(layerName = null) {
      this.currentTable = false;
      const selectedLayer = layerName || document.getElementById('layerSelect').value;
      fetchFeatureData(selectedLayer)
        .then(data => {
          const features = data.features;
          const content = generateTableContent(features);
          this.currentTable = content;
    
          // Wait for Alpine to update the DOM
          Alpine.nextTick(() => {
            initializeDataTable();
            addClickLinkEventListener(features);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
  });


  const domElementsToCreate = [ 
    [createMarkup, '#attributeTable']
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)


  document.getElementById('layerSelect').addEventListener('change', function() {
    Alpine.store('attributeTable').updateTableForLayer(this.value);
  });


};


export { initialize };