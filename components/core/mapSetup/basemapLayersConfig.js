// basemapLayers.json

const basemapLayers = [
    {
      "id": "osm-grey",
      "url": "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      "attribution": "&copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
      "visible": true,
      "img": "/assets/img/basemaps/carto-grey.jpeg"
    },
    {
      "id": "osm-color",
      "url": "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
      "attribution": "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      "visible": false,
      "img": "/assets/img/basemaps/osm-color-de.jpeg"
    },
    {
      "id": "osm-france",
      "url": "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      "attribution": "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
      "visible": false,
      "img": "/assets/img/basemaps/osm-hot-fr.jpeg"
    }
  ];
  
  export default basemapLayers;
  