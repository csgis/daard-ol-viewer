import { map, wmsSource } from '../core/mapSetup.js';

import Alpine from 'alpinejs';
import feather from 'feather-icons';

const createMarkup = () => {
    const buttonHtml = `
        <div class="mx-1  order-5">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                data-bs-toggle="tooltip" 
                data-bs-placement="left" 
                title="Legend"
                @click="$store.legend.toggleLegend($el)"
                :class="$store.legend.buttonIsActive ? 'bg-danger' : 'btn-light'">
                ${feather.icons['info'].toSvg({ width: '16', height: '16' })}
            </button>
        </div>
        `;

    const slideOut = `
        <div id="legend-gfx" class="bg-white w-100 my-1 shadow-sm" data-parent="#specialMarkupContainerSub" x-transition x-show="$store.legend.showLegend">
            <img id="legend" class="m-2" />
        </div>
    `

    var specialMarkupContainer = document.getElementById('specialMarkupContainer');
    specialMarkupContainer.insertAdjacentHTML('beforeend', buttonHtml);
    var specialMarkupContainerSub = document.getElementById('specialMarkupContainerSub');
    specialMarkupContainerSub.insertAdjacentHTML('beforeend', slideOut);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = () => {


    Alpine.store('legend', {
        buttonIsActive: false,
        showLegend: false,
        toggleLegend($el){
            this.buttonIsActive = !this.buttonIsActive;
            this.showLegend = !this.showLegend;
            document.activeElement.blur()
        }
        },
    );

    createMarkup()

    const updateLegend = function(resolution, wmsSource) {
        const graphicUrl = wmsSource.getLegendUrl(resolution);
        const img = document.getElementById('legend');
        img.src = graphicUrl;
    };

    // Initial legend
    const resolution = map.getView().getResolution();
    updateLegend(resolution, wmsSource);

    // Update the legend when the resolution changes
    map.getView().on('change:resolution', function (event) {
    const resolution = event.target.getResolution();
    updateLegend(resolution, wmsSource);


    });

    Alpine.store('pluginStatus').increasePluginLoadingStatus();

    
};


export { initialize };