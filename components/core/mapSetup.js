// mapSetup.js

import ImageLayer from 'ol/layer/Image.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import basemapLayersJson from '../basemapLayersConfig.js';

const createTileLayersFromJson = () => {
  return basemapLayersJson.map(layer => new TileLayer({
    source: new OSM({
      url: layer.url,
      attributions: layer.attribution,
    }),
    visible: layer.visible,
    name: layer.id,
    id: layer.id,
    img: layer.img,
  }));
}

// Baselayer
const basemapLayers = createTileLayersFromJson();

// Feature Layer
const wmsSource = new ImageWMS({
  url: 'https://geoserver.dainst.org/gs/wms',
  params: {'LAYERS': 'geonode:daard_database', 'TILED': true},
  serverType: 'geoserver',
});

const daardWmsLayer = new ImageLayer({
  source: wmsSource,
});

const source = new VectorSource({
  wrapX: false,
});

const vector = new VectorLayer({
  source: source,
});

// Map and View
const view = new View({
  center: [0, 0],
  zoom: 1,
});

const map = new Map({
  layers: [...basemapLayers, vector, daardWmsLayer],
  target: 'map',
  view: view,
});

export { map, view, wmsSource, basemapLayers, daardWmsLayer, vector, source };
