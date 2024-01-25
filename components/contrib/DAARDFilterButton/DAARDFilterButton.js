import { emitCustomEvent, renderMarkupAndSetPluginReady } from '../../core/helper.js'
import {featureLayersGroup, map, view} from '../../core/mapSetup/mapSetup.js'

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { fromLonLat } from 'ol/proj.js';

const createMarkup = () => {
    // define plugin html markup
    const buttonHtml = `
        <div class="mx-1" id="DAARDFilterButtonNav" :class="'order-'+$store.DAARDFilterButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Filter disease cases'"
                @click="$store.DAARDFilterButton.openFilter()"
                :class="$store.DAARDFilterButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="filter" class="size-16"></i>
            </button>
        </div>
        `;

    // insert the plugin markup where we need it
    var rightMiddleSlot = document.getElementById('rightMiddleSlot');
    rightMiddleSlot.insertAdjacentHTML('beforeend', buttonHtml);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async (buttonDomOrder) => {
    
    Alpine.store('DAARDFilterButton', {
        componentIsActive: false,
        buttonDomOrder: buttonDomOrder,
        closeComponent: function () {
            console.log("catched")
            this.componentIsActive = false;
            Alpine.store('geonodeCustomLayerFilter').componentIsActive = false;

        },
        openFilter: function() {
            this.componentIsActive = !this.componentIsActive;

            console.log("group is")
            console.log(featureLayersGroup.getLayers())


            const layer = featureLayersGroup.getLayers().getArray()[0];
            const source = layer.getSource();
            source.mapName = layer.get('name');
            source.dataset = layer.get('dataset');

            if (this.componentIsActive){
                emitCustomEvent('filterPushed', {"instance": source})
                console.log("source is", source.mapName,  source.dataset )
            } else {
                Alpine.store('geonodeCustomLayerFilter').componentIsActive = false;
            }

        }
    });

    
    document.addEventListener('geonodeCustomLayerFilterClosed', function (event) {
        console.debug('Custom event "geonodeCustomLayerFilterClosed" caught.');
        Alpine.store('DAARDFilterButton').closeComponent();
      });

    // [function name that creates the DOM Element, Element to check for presence}
    const domElementsToCreate = [
        [createMarkup, '#DAARDFilterButtonNav'],
    ]

    // this function tirggers the rendering and tells main.js that initialization is finished
    renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };
