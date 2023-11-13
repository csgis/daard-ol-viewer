import './backgroundSwticher.css'

import Alpine from 'alpinejs';
import { basemapLayers } from '../core/mapSetup';

const createMarkup = () => {
  const backgroundSwitcherHtml = `
    <div 
      class="position-absolute bottom-0 start-0 ms-2 mb-2 d-flex" 
      x-data="{ showAll: false }"
      data-bs-toggle="tooltip" 
      data-bs-placement="top" 
      title="Choose Background"
    >
      <template x-for="(item, index) in $store.backgroundSwitcher.background" :key="item.id">
        <div 
          class="border m-1" 
          x-show="$store.backgroundSwitcher.shouldShow(index)" 
          x-transition
        >
          <a 
            type="button" 
            class="btn btn-secondary btn-sm p-0 borde border-light border-5 backgroundSwitcher-item"
            :id="item.id" 
            @click="$store.backgroundSwitcher.handleItemClick(item, index)"
          >
            <img class="bgs-img" :src="item.img">
          </a> 
        </div>
      </template>
    </div>
  `;

  // insert the plugin markup where we need it
  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', backgroundSwitcherHtml);
}

const initialize = (map, view) => {
  
  // Extracting relevant information from basemapLayers for Alpine store
  const backgroundSwitcherData = basemapLayers.map(layer => ({
    id: layer.get('id'),
    img: layer.get('img'),
  }));

  Alpine.store('backgroundSwitcher', {
    showAll: false,
    shouldShow: function(index) {
      return index === 0 || this.showAll;
    },
    setBasemap: function(clickedLayerId) {
      basemapLayers.forEach(layer => {
        layer.setVisible(layer.get('id') === clickedLayerId);
      });
    },
    handleItemClick: function(clickedItem, index){
      if (index !== 0) {
        console.log(this.background)
        const itemIndex = this.background.indexOf(clickedItem);
        if (itemIndex !== -1) {
          this.background.splice(itemIndex, 1); 
          this.background.unshift(clickedItem); 
          this.setBasemap(clickedItem.id); 
        }
      }
      this.showAll = !this.showAll;
    },
    toggleVisibility: function(){
      this.showAll = !this.showAll;
    },
    background: backgroundSwitcherData,
  });

  createMarkup();
  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};

export { initialize };
