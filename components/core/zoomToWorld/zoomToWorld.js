import {map, view} from '../../core/mapSetup/mapSetup.js'

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { fromLonLat } from 'ol/proj.js';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createMarkup = () => {
    // define plugin html markup
    const buttonHtml = `
        <div class="mx-1" id="zoomToWorld" :class="'order-'+$store.zoomToWorld.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Zoom to full world extent'"
                @click="$store.zoomToWorld.zoomTo()"
                :class="$store.zoomToWorld.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="maximize" class="size-16"></i>

            </button>
        </div>
        `;

    // insert the plugin markup where we need it
    var rightMiddleSlot = document.getElementById('rightMiddleSlot');
    rightMiddleSlot.insertAdjacentHTML('beforeend', buttonHtml);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async (buttonDomOrder) => {
    
    Alpine.store('zoomToWorld', {
        componentIsActive: false,
        buttonDomOrder: buttonDomOrder,
        zoomTo: function() {
            view.animate({
                center: fromLonLat([0, 0]),
                zoom: 1,
                maxZoom: 1,
                duration: 300
            });
        }
    });

    // [function name that creates the DOM Element, Element to check for presence}
    const domElementsToCreate = [
        [createMarkup, '#zoomToWorld'],
    ]

    // this function tirggers the rendering and tells main.js that initialization is finished
    renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };
