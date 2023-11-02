import ImageLayer from 'ol/layer/Image.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

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

export { map, view, wmsSource };
