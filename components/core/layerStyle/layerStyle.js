import { emitCustomEvent, waitForElementAndExecute } from '../helper.js';
import { featureLayersGroup, map, view } from '../mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import Polygon from 'ol/geom/Polygon.js';
import feather from 'feather-icons';
import proj4 from 'proj4';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

function isValid4326Coordinates(coordinates) {
  if (!Array.isArray(coordinates)) return false;

  for (const coord of coordinates) {
    if (!Array.isArray(coord) || coord.length !== 2) return false;
    const [longitude, latitude] = coord;
    if (
      typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90 ||
      typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180
    ) {
      return false;
    }
  }
  return true;
}

const transformExtent = (extent, sourceSRID) => {
  const targetProjection = 'EPSG:3857';
  return extent.map(subArray => {
    const coord = proj4(sourceSRID, targetProjection, subArray);
    console.log(coord)
    return [coord[0], coord[1]];
  });
}

const createOffCanvasMarkup = () => {
  let layerPanelStyleBodyMarkup = `
    <div class="" id="layerPanelContainerStyleBody" x-show="$store.layerPanelContainer.sectionActive == 'layer-style'">
            <div class="offcanvas-body p-3">
                Styles are not implemented yet :()
            </div>
      </div>`;

  console.log('adding style panel markup to DOM')

  var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerBody');
  layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', layerPanelStyleBodyMarkup);

  // waitForElementAndExecute('layerPanelContainerBody')
  // .then(() => {
  //   var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerBody');
  //   layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', layerPanelStyleBodyMarkup);
  //   console.log('- layerPanelStyleBodyMarkup added')
  // })
  // .catch((error) => {
  //   console.error(error.message);
  // });
}

const createButtonMarkup = () => {
    let toggleLayerContainerStyleBtn = `
        <button 
        type="button" 
        id="layerPanelNavStyleButton"
        :class="{'bg-light' : $store.layerPanelContainer.sectionActive == 'layer-style',
        ['order-' + $store.layerStyle.buttonDomOrder]: true}"
        class="btn btn-inactive btn-square-md rounded-0 m-0 border-0 shadow-none text-dark d-block"
        @click="$store.layerPanelContainer.setSectionActive('layer-style')"">    
        <i data-feather="pen-tool" class="size-16"></i>
    </button>

    `;
    
    var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerNavBar');
    layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', toggleLayerContainerStyleBtn);

    // waitForElementAndExecute('layerPanelContainerNavBar')
    // .then(() => {
    //   var layerPanelCOntainerNavBody = document.getElementById('layerPanelContainerNavBar');
    //   layerPanelCOntainerNavBody.insertAdjacentHTML('beforeend', toggleLayerContainerStyleBtn);
    //   console.log('- toggleLayerContainerStyleBtn added')
    // })
    // .catch((error) => {
    //   console.error(error.message);
    // });

}



const initialize = async (buttonDomOrder) => {

  Alpine.store('layerStyle', {
    buttonDomOrder: buttonDomOrder,
  });

  const domElementsToCreate = [
    [createOffCanvasMarkup, '#layerPanelContainerStyleBody'],
    [createButtonMarkup, '#layerPanelNavStyleButton'],
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)


};

export { initialize };
