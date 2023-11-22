// Feature layer json definitions
const customFeatureLayersJson = [
  {
    type: 'GeoJSON',
    url: 'https://openlayers.org/data/vector/ecoregions.json',
    name: 'GeoJSON Layer Regions',
    visible: false,
    legend: 'GeoJSON'
  },
  {
    type: 'geonode',
    url: 'https://geoserver.dainst.org/',
    id: 6006,
    name: 'Daard Database',
    visible: true
  },
  {
    type: 'geonode',
    url: 'https://geoserver.dainst.org/',
    id: 7305,
    name: 'Miletus',
    visible: false
  },
  {
    type: 'geonode',
    url: 'https://stable.demo.geonode.org/',
    id: 8452,
    name: 'tl_2020_05001_roads',
    visible: true
  },
  {
    type: 'geonode',
    url: 'https://stable.demo.geonode.org/',
    id: 8612,
    name: 'boundaries',
    visible: false,
    style: "geonode%3A7c4fc1c0-7dad-11ee-9642-cdd18e6c0ccf_ms_progress"
  },
  {
    type: 'geonode',
    url: 'https://stable.demo.geonode.org/',
    id: 8697,
    name: 'AAA',
    visible: false
  },
  {
    type: 'geonode',
    url: 'https://stable.demo.geonode.org/',
    id: 8610,
    name: 'progress',
    visible: true
  }
];

export {customFeatureLayersJson};