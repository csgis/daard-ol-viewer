import {DataTable} from "simple-datatables"
import { WFS } from 'ol/format';

var attributeTableBtn = document.getElementById('attributeTableBtn')
attributeTableBtn.addEventListener('click', function() {
  sayHello('ok');
});

function sayHello(data) {
  const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:3857',
    featurePrefix: 'geonode',
    featureTypes: ['daard_database'],
    outputFormat: 'application/json',
  });

  fetch('https://geoserver.dainst.org/gs/wfs', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
    headers: {
      'Content-Type': 'text/xml',
    },
  })
  .then(response => response.json())
  .then(data => {
    const features = data.features;
    let content = '<table class="attributesTable"><thead><tr>';

    // Get all attribute keys
    const attributes = features[0].properties;
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

      for (const key in properties) {
        if (key == 'svgid' || key == "bone_relations" || key == "c_b_t_bc_rel" || key == "c_bones" || key == "references" || key == 'uuid'){
          continue;
        }
        content += `<td>${properties[key]}</td>`;
      }

      content += '</tr>';
    });

    content += '</tbody></table>';
    document.getElementById('attributeTableBody').innerHTML = content;
    
    // Initialize the DataTable
    new DataTable('.attributesTable', {
      perPage: 3,
      class: 'table'
    });

    // Get the table element
    const tableElement = document.querySelector('.attributesTable');
    tableElement.classList.add('table');
    tableElement.classList.add('table-striped')

    const searchInput = document.querySelector('.datatable-input');
    searchInput.classList.add('form-control');
    
    
    
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
