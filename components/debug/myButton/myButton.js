import './myButton.css'

import {map, view} from '../../core/mapSetup/mapSetup.js'

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { fromLonLat } from 'ol/proj.js';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createMarkup = () => {
    // define plugin html markup
    const buttonHtml = `
        <div class="mx-1" id="myButtonNav" :class="'order-'+$store.myButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Demo button'"
                @click="$store.myButton.rotate()"
                :class="$store.myButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="minimize" class="size-16"></i>
            </button>
        </div>
        `;

    // insert the plugin markup where we need it
    var rightMiddleSlot = document.getElementById('rightMiddleSlot');
    rightMiddleSlot.insertAdjacentHTML('beforeend', buttonHtml);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async (buttonDomOrder) => {
    
    Alpine.store('myButton', {
        componentIsActive: false,
        buttonDomOrder: buttonDomOrder,
        rotate: function() {
            view.animate({
                center: fromLonLat([28.9744, 41.0128]),
                zoom: 8,
                duration: 1000
            });
        }
    });

    // [function name that creates the DOM Element, Element to check for presence}
    const domElementsToCreate = [
        [createMarkup, '#myButtonNav'],
    ]

    // this function tirggers the rendering and tells main.js that initialization is finished
    renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };
