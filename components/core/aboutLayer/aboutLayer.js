import './aboutLayer.css';

import Alpine from 'alpinejs';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createOffCanvasMarkup = () => {

  let aboutOffcanvas = `
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" 
        x-transition tabindex="-1" 
        id="aboutOffcanvas" 
        aria-labelledby="aboutOffcanvasLabel"
        x-show="$store.aboutLayer.componentIsActive">
      <div class="offcanvas-header mb-4">
        <h5 class="offcanvas-title" id="aboutOffcanvasLabel" x-text="$store.aboutLayer.mapName">Filter</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.aboutLayer.componentIsActive = false;"></button>
      </div>

      <div class="offcanvas-body">
            <img :src="$store.aboutLayer.layer?.dataset?.thumbnail_url || ''">
            <table class="table table-striped">
                <tbody>
                    <template x-for="[key, value] in Object.entries($store.aboutLayer.metadata)" :key="key">
                        <tr>
                            <td x-text="$store.aboutLayer.pritfyName(key)" class="aboutKey"></td>
                            <td x-html="value" class="aboutValue"></td>
                        </tr>
                    </template>   
                </tbody>
            </table>   
        </div>
  </div>`;

  document.getElementById('map').insertAdjacentHTML('afterend', aboutOffcanvas);
}



const initialize = () => {

  Alpine.store('aboutLayer', {
      componentIsActive: false,
      layer: {},
      allowedKeys: ['data_quality_statement', 'abstract', 'created', 'license', 'maintenance_frequency','metadata_author', 'poc', 'srid', 'supplemental_information'],
      metadata: {},
      mapName: "",
      pritfyName: function (name) {
        name = name.replaceAll("_", " ");
        return name;
      }
    });

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('aboutPushed', function (event) {
        console.debug('Custom event "aboutPushed" caught in aboutLayer/aboutLayer.js');
        const aboutLayer = Alpine.store('aboutLayer');
        const layer = event.detail.instance;

        aboutLayer.layer = layer;
        aboutLayer.mapName = layer.mapName;
        aboutLayer.componentIsActive = true;
    
        // Initialize a new metadata object
        const newMetadata = {};

        // Fill newMetadata only with specified keys if they exist in the layer's dataset
        aboutLayer.allowedKeys.forEach(key => {
            if (layer.dataset.hasOwnProperty(key)) {
                newMetadata[key] = layer.dataset[key];
                if (key == 'poc'){
                    newMetadata[key] = layer.dataset[key]['username'];
                }
            }
        });
        
        console.log("newMetadata")
        console.log(newMetadata)
        // Update the metadata in the store
        aboutLayer.metadata = newMetadata;
    
    });
    
  // [function name that creates the DOM Element, Element to check for presence}
  const domElementsToCreate = [
      [createOffCanvasMarkup, '#aboutOffcanvas'],
  ]

  // this function tirggers the rendering and tells main.js that initialization is finished
  renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };