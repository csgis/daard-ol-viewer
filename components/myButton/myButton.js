import './myButton.css'

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { fromLonLat } from 'ol/proj.js';

const createMarkup = () => {
    // define plugin html markup
    const buttonHtml = `

        <div class="mx-1 order-1">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                data-bs-toggle="tooltip" 
                data-bs-placement="left" 
                title="Demo plugin"
                @click="$store.myButton.rotate()"
                :class="$store.myButton.buttonIsActive ? 'bg-danger' : 'btn-light'">
                ${feather.icons['minimize'].toSvg({ width: '16', height: '16' })}
            </button>
        </div>
        `;

    // insert the plugin markup where we need it
    var specialMarkupContainer = document.getElementById('specialMarkupContainer');
    specialMarkupContainer.insertAdjacentHTML('beforeend', buttonHtml);
}

// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = (map, view) => {
    
    createMarkup()

    Alpine.store('myButton', {
        buttonIsActive: false,
        rotate: function() {
            view.animate({
                center: fromLonLat([28.9744, 41.0128]),
                zoom: 8,
                duration: 1000
            });

            // Todo: why do we need this to close the tooltip?
            document.activeElement.blur()

        }
    });

//  Tell the main component that this plugin isready
Alpine.store('pluginStatus').increasePluginLoadingStatus();

};


export { initialize };
