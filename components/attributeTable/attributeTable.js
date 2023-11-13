import { getBaseUrl, isValidUrl } from '../../helper.js'
import {map, wmsSource} from '../core/mapSetup.js'

import Alpine from 'alpinejs';
import {DataTable} from "simple-datatables"
import { WFS } from 'ol/format';
import feather from 'feather-icons';

// Function to fetch feature data from WFS
const fetchFeatureData = () => {
  const baseurl = getBaseUrl(wmsSource.url_);

  const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featurePrefix: 'geonode',
    featureTypes: ['daard_database'],
    outputFormat: 'application/json',
  });

  return fetch(`${baseurl}/wfs`, {
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
  new DataTable('.attributesTable', {
    perPage: 5,
    class: 'table'
  });

  const tableElement = document.querySelector('.attributesTable');
  tableElement.classList.add('table');
  tableElement.classList.add('table-striped')

  const searchInput = document.querySelector('.datatable-input');
  searchInput.classList.add('form-control');
}

// Function to add event listener for clicklink
const addClickLinkEventListener = (features) => {
  document.addEventListener('click', function(event) {
    if (event.target.closest('a').classList.contains('clicklink')) {
      event.preventDefault();
      const featureId = event.target.closest('a').getAttribute('data-id');
      const feature = features.find(feature => feature.properties['fid'] == featureId);
      
      if (feature) {
        const coordinates = feature.geometry.coordinates;
        const extent = [coordinates[0], coordinates[1], coordinates[0], coordinates[1]];
        map.getView().fit(extent, {padding: [50, 50, 500, 50], maxZoom: 13});
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
      document.getElementById('attributeTableBody').innerHTML = content;
      initializeDataTable();
      addClickLinkEventListener(features);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




const createMarkup = () => {
  // Plugin HTML Markup
  const backgroundSwitcherButtonHtml = `
      <div class="mx-1  order-2">
      <button
        type="button" 
        class="btn btn-danger btn-sm btn-circle" 
        id="attributeTableBtn" 
        data-bs-toggle="tooltip" 
        data-bs-placement="left" 
        title="Attribute Table"
        @click="$store.attributeTable.process_attribute_table()"
        :class="$store.attributeTable.buttonIsActive ? 'bg-danger' : 'btn-light'">
        ${feather.icons['list'].toSvg({ width: '16', height: '16' })}
      </button>
    </div>
      `

  var specialMarkupContainer = document.getElementById('specialMarkupContainer');
  specialMarkupContainer.insertAdjacentHTML('beforeend', backgroundSwitcherButtonHtml);

  const attributeTableSlideOutHtml = `
  <div id="attributeTable" class="offcanvas offcanvas-bottom" tabindex="-1" aria-labelledby="attributeTableLabel"
    style="width: 100%; height: 60vh">
    <div class="offcanvas-header">
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body" id="attributeTableBody">
      <div  style="height:50vh; width: 95%; overflow-y: scroll;">
      <table class="attributesTable table table-dark">
      </table>
    </div>
    </div>
  </div>
  `
  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', attributeTableSlideOutHtml);

}


// Initialize the plugin
const initialize = () => {
  Alpine.store('attributeTable', {
      buttonIsActive: false,
      process_attribute_table: function(){
        this.buttonIsActive = true;
        getAttributeTableData();

        var offcanvasElement = document.getElementById('attributeTable');
        var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();

      }
  });

  createMarkup()

    // Listen to Bootstrap Offcanvas hide event
    document.getElementById('attributeTable').addEventListener('hide.bs.offcanvas', function () {
      const filterLayerStore = Alpine.store('attributeTable');
      filterLayerStore.buttonIsActive = false;
      console.log(filterLayerStore.buttonIsActive);
    });

    console.log("init attributetable")

    Alpine.store('pluginStatus').increasePluginLoadingStatus();

    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })

};


export { initialize };