import './style.css';

import ImageLayer from 'ol/layer/Image.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

document.addEventListener('DOMContentLoaded', function() {


  

  const wmsSource = new ImageWMS({
    url: 'https://geoserver.dainst.org/gs/wms',
    params: {'LAYERS': 'geonode:daard_database', 'TILED': true},
    serverType: 'geoserver'
  });

  const wmsLayer = new ImageLayer({
    source: wmsSource,
  });

  const osmLayer = new TileLayer({
    source: new OSM(),
  });

  const view = new View({
    center: [0, 0],
    zoom: 1,
  });

  const map = new Map({
    layers: [osmLayer, wmsLayer],
    target: 'map',
    view: view,
  });

  const updateLegend = function (resolution) {
    const graphicUrl = wmsSource.getLegendUrl(resolution);
    const img = document.getElementById('legend');
    img.src = graphicUrl;
  };

  const offcanvasElement = document.getElementById('info');
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

  map.on('singleclick', function (evt) {
    const viewResolution = view.getResolution();
    const url = wmsSource.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      'EPSG:3857',
      {'INFO_FORMAT': 'application/json'}
    );
    if (url) {
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
    
        const featureList = document.createElement('ul');
        featureList.classList.add('list-group');
        featureList.classList.add('list-group-flush');

        const carouselInner = document.querySelector('.carousel-inner');
        console.log(carouselInner)
        data.features.forEach((feature, index) => {
          const properties = feature.properties;
          const item = document.createElement('div');
          item.classList.add('carousel-item');
          if (index === 0) {
            item.classList.add('active'); // Set the first item as active
          }
        
          const content = document.createElement('div');
          content.classList.add('list-group');
          content.classList.add('list-group-flush');
        
          for (const key in properties) {

            if (key == 'bone_relations' || key == 'c_b_t_bc_rel') {
              continue
            }

            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.classList.add('py-0');
            listItem.innerHTML = `<strong>${key}:</strong> ${properties[key]}`;
            content.appendChild(listItem);
          }
        
          item.appendChild(content);
          carouselInner.appendChild(item);
        });
      
        if (data.features.length > 0) {
          offcanvas.show(); // Show the offcanvas
        }
      
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });

  map.on('pointermove', function (evt) {
    if (evt.dragging) {
      return;
    }
    const data = wmsLayer.getData(evt.pixel);
    const hit = data && data[3] > 0;
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // Initial legend
  const resolution = map.getView().getResolution();
  updateLegend(resolution);

  // Update the legend when the resolution changes
  map.getView().on('change:resolution', function (event) {
    const resolution = event.target.getResolution();
    updateLegend(resolution);
  });


  function getUniqueValues(row) {
    const filterName = row.querySelector('.form-control').value;
    const operatorsSelect = row.querySelector('.operators');
    const valuesSelect = row.querySelector('.values');
  
    fetch("https://geoserver.dainst.org/gs/wps?service=WPS&outputFormat=json", {
      "headers": {
        "accept": "application/json",
        "accept-language": "de-DE,de;q=0.5",
        "cache-control": "no-cache",
        "content-type": "application/xml",
      },
      "referrer": "https://geoserver.dainst.org/catalogue/",
      "body": `
      <wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">gs:PagedUnique</ows:Identifier>
        <wps:DataInputs>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Title>
            <wps:Data />
            <wps:Reference xmlns:xlink="http://www.w3.org/1999/xlink" mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
              <wps:Body>
                <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.0.0">
                  <wfs:Query typeName="geonode:daard_database">
                    <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc">
                      <ogc:SortProperty>
                        <ogc:PropertyName>${filterName}</ogc:PropertyName>
                      </ogc:SortProperty>
                    </ogc:SortBy>
                  </wfs:Query>
                </wfs:GetFeature>
              </wps:Body>
            </wps:Reference>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Title>
            <wps:Data>
              <wps:LiteralData>${filterName}</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Title>
            <wps:Data>
              <wps:LiteralData>5</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Title>
            <wps:Data>
              <wps:LiteralData>0</wps:LiteralData>
            </wps:Data>
          </wps:Input>
        </wps:DataInputs>
        <wps:ResponseForm>
          <wps:RawDataOutput mimeType="application/json">
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">result</ows:Identifier>
          </wps:RawDataOutput>
        </wps:ResponseForm>
      </wps:Execute>
      `,
            "method": "POST"
    })
    .then(response => response.json())
    .then(data => {
  
      if (!valuesSelect.classList.contains('updated')) {
        valuesSelect.innerHTML = ''; // Reset the select element

        data.values.forEach(value => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          valuesSelect.appendChild(option);
          valuesSelect.classList.add('updated');
        });
      }

    })
    .catch(error => {
      console.error('Error:', error);
    });
  }



const checkboxes = document.querySelectorAll('.js-enableselect');

checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    const row = this.closest('.row');
    const operatorsSelect = row.querySelector('.operators');
    const valuesSelect = row.querySelector('.values');

    if (this.checked) {
      operatorsSelect.removeAttribute('disabled');
      valuesSelect.removeAttribute('disabled');
      getUniqueValues(row); // Populate values for the enabled row
    } else {
      operatorsSelect.setAttribute('disabled', true);
      valuesSelect.setAttribute('disabled', true);
    }
  });
});

document.getElementById('filterForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Collect enabled filters
  const enabledFilters = [];
  checkboxes.forEach(function(checkbox, index) {
    const row = checkbox.closest('.row');
    const operatorsSelect = row.querySelector('.operators');
    const valuesSelect = row.querySelector('.values');

    if (checkbox.checked) {
      const filterName = row.querySelector('.form-control').value; // Change to the actual filter name field
      const operatorValue = operatorsSelect.value;
      const filterValue = valuesSelect.value;

      enabledFilters.push({
        name: filterName,
        operator: operatorValue,
        value: filterValue,
      });
    }
  });


  // Create CQL filter string
  const filterString = enabledFilters.map(element => `("${element.name}"${element.operator}'${element.value}')`);

  // Join filters with OR or AND depending on checkbox state
  const or_selector = document.getElementById('or_operator_selector');
  const join_str = or_selector.checked ? ' OR ' : ' AND ';
  const joinedFilters = filterString.join(join_str);

  // Update WMS source with CQL filter
  wmsSource.updateParams({ 'CQL_FILTER': joinedFilters });
});




});

