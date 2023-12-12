// mapSetup.js

import GeoJSON from 'ol/format/GeoJSON.js'; // Import GeoJSON
import ImageLayer from 'ol/layer/Image.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import LayerGroup from 'ol/layer/Group.js'; // Import LayerGroup
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import { askUser } from '../../contrib/mapSourceWarning/mapSourceWarning';
import basemapLayersJson from './basemapLayersConfig.js';
import { customFeatureLayersJson } from './customFeatureLayersConfig.js';
import { emitCustomEvent } from '../helper.js';
import { fromLonLat } from 'ol/proj.js';
import { updateJsonWithFetchData } from './updateJsonWithFetchData.js';

// Create basemap layers dynamically based on JSON definition
const createBasemapLayersFromJson = (layerDefinitions) => {
  return layerDefinitions.map((layerDef) => {
    return new TileLayer({
      source: new OSM({
        url: layerDef.url,
        attributions: layerDef.attribution,
      }),
      visible: layerDef.visible,
      name: layerDef.id,
      id: layerDef.id,
      img: layerDef.img,
    });
  });
};

// Create feature layers dynamically based on JSON definition
const createFeatureLayersFromJson = (layerDefinitions) => {

  console.debug("4. Start working on updating geonode json data and building ol feature layers ")

  const layers = [];
  layerDefinitions.forEach((layerDef) => {

    console.debug(`- Working on ${layerDef.name}`)

    switch (layerDef.type) {
      case 'WMS':
        case 'geonode':
        const wmsSource = new ImageWMS({
          url: layerDef.url,
          params: layerDef.params,
          serverType: 'geoserver'
        });
        const wmsLayer = new ImageLayer({
          source: wmsSource,
          name: layerDef.name,
          dataset: layerDef.dataset || {} ,
          visible: layerDef.visible,
          type: layerDef.type,
        });
        layers.push(wmsLayer);
        break;
      case 'GeoJSON':
        const geoJSONSource = new VectorSource({
          url: layerDef.url,
          format: new GeoJSON(),
        });
        const geoJSONLayer = new VectorLayer({
          source: geoJSONSource,
          name: layerDef.name,
          visible: layerDef.visible,
        });
        layers.push(geoJSONLayer);
        break;

      default:
        break;
    }
  });

  return layers;
};


// askUser();


// Baselayer loading
const basemapLayers = createBasemapLayersFromJson(basemapLayersJson);

// Feature Layer
const source = new VectorSource({
  wrapX: false,
});

const vector = new VectorLayer({
  source: source,
  zIndex: 1000
});

// Map and View
const view = new View({
  center: fromLonLat([0,0]),
  // center: fromLonLat([34.8, 31.46667]),
  zoom: 1,
});

const map = new Map({
  layers: [...basemapLayers, vector],
  target: 'map',
  view: view,
});

let featureLayersGroup = new LayerGroup({
  layers: [],
});



updateJsonWithFetchData(customFeatureLayersJson)
  .then((updatedJson) => {
    console.debug(`3. JSON data has updated and now is ${updatedJson}`)
    console.debug(`4. Calling createFeatureLayersFromJson()`)

    let customFeatureLayers = createFeatureLayersFromJson(updatedJson);
    map.getLayers().extend(customFeatureLayers);

    featureLayersGroup = new LayerGroup({
      layers: customFeatureLayers,
    });
    console.debug('5. Map Setup done')
    console.debug('6. Dispatch event featureMaplayersFinished')
    // jsonUpdateFinished
    const event = new CustomEvent('featureMaplayersFinished', {});
    document.dispatchEvent(event);

  })
  .catch((error) => {
    console.error('Error updating JSON:', error);
  });


export { map, view, basemapLayers, vector, source, featureLayersGroup };
