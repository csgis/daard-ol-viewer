import './layerPanelContainer.css';

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js';

const createContainerMarkup = () => {
    // define plugin html markup
    const layerPanelContainerMarkup = `
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 ps-0 pt-0 shadow bg-light" 
        z-index="2000" 
        id="layerPanelContainer" 
        x-show="$store.layerPanelContainer.componentIsActive" x-transition>

        <div class="row">
            <!-- Navigation -->
            <div class="col-1 bg-secondary vh-100 p-0 pt-21 d-flex flex-column" id="layerPanelContainerNavBar"></div>

            <!-- Content -->
            <div class="col-11 vh-100 p-0 border-0">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="layerPanelEditBodyLabel">&nbsp;</h5>
                    <button type="button" class="btn-close text-reset me-3 mt-3" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.layerPanelContainer.componentIsActive = false"></button>
                </div>
                <div class="offcanvas-body p-3 overflow-auto h-100" id="layerPanelContainerBody">
                </div>
            </div>
        </div>

    </div>
        `;

    var mapDIV = document.getElementById('map');
    mapDIV.insertAdjacentHTML('afterend', layerPanelContainerMarkup);
    console.log('adding container markup to DOM')
}


const createMarkupButton = () => {
    const buttonHtml = `
        <div x-data="{ get layerPanelContainer() { return $store.layerPanelContainer; } }" class="mx-1" :class="'order-'+layerPanelContainer.buttonDomOrder" id="layerPanelContainerButton">
            <button type="button" 
            class="btn btn-danger btn-sm btn-circle" 
            x-tooltip.placement.left="'Map Layer'"
            @click="layerPanelContainer.componentIsActive = !layerPanelContainer. componentIsActive"
            :class="layerPanelContainer.componentIsActive ? 'bg-danger' : 'btn-light'">
            <i data-feather="layers" class="size-16"></i>
            </button>
          </div>
    `;
  
    // insert the plugin markup where we need it
    document.getElementById('rightMiddleSlot').insertAdjacentHTML('beforeend', buttonHtml);

  };


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async (buttonDomOrder) => {
    
    Alpine.store('layerPanelContainer', {
        componentIsActive: false,
        buttonDomOrder: buttonDomOrder,
        sectionActive: "layer-edit",
        setSectionActive: function(section){
            this.sectionActive = section;
            console.log(this.sectionActive);
        },
    });

    // [function name that creates the DOM Element, Element to check for presence}
    const domElementsToCreate = [
        [createContainerMarkup, '#layerPanelContainer'],
        [createMarkupButton, '#layerPanelContainerButton'],
    ]

    // this function tirggers the rendering and tells main.js that initialization is finished
    renderMarkupAndSetPluginReady(domElementsToCreate)

    console.log("init layerPanelContainerMarkup");

};


export { initialize };
