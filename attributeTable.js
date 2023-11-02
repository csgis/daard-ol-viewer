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
  
    let content = '<h2>Attribute Table</h2><table class="attributesTable"><tr>';
  
    // Get all attribute keys
    const attributes = features[0].properties;
    for (const key in attributes) {
      if (key == 'svgid'){
        continue;
      }
      content += `<th>${key}</th>`;
    }
  
    content += '</tr>';
  
    features.forEach(feature => {
      const properties = feature.properties;
      content += '<tr>';
      


      for (const key in properties) {
        if (key == 'svgid'){
          continue;
        }
        content += `<td>${properties[key]}</td>`;
      }
  
      content += '</tr>';
    });
  
    content += '</table>';
    document.getElementById('attributeTableBody').innerHTML = content;
    console.log(content);

  })
  .catch(error => {
    console.error('Error:', error);
  });
}


