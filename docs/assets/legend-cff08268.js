import{m as i,a as d,I as l,V as g,r as c}from"./index-8440c062.js";import"./feather-becb2378.js";const m=()=>{const t=`
      <div x-data="{ get legend() { return $store.legend; } }" class="mx-1" :class="'order-'+legend.buttonDomOrder" id="legendNavButton">
        <button type="button" 
          class="btn btn-danger btn-sm btn-circle" 
          x-tooltip.placement.left="'Legend'"
          @click="legend.toggleLegend($el)"
          :class="legend.componentIsActive ? 'bg-danger' : 'btn-light'">
          <i data-feather="info" class="size-16"></i>
          </button>
      </div>
    `;document.getElementById("rightMiddleSlot").insertAdjacentHTML("beforeend",t)},p=()=>{const t=`
          <div x-data="{ get legend() { return $store.legend; } }" id="legendContainer">
          <div x-show="legend.showLegend">
              <div class="accordion" id="legendAccordion">
                  <template x-for="item in legend.visibleLayers" :key="item.get('name')">
                      <div class="accordion-item">
                          <p class="accordion-header py-0">
                              <button class="accordion-button py-1 btn-light btn-sm" type="button" @click="legend.toggleDetails(item)">
                                  <span x-text="item.get('name')"></span>
                              </button>
                          </p>
                          <div class="accordion-collapse collapse" :class="{'show': item.showDetails}">
                              <div class="accordion-body">
                                  <img :src="legend.getLegendUrl(item)" alt="" x-show="item.get('type') === 'WMS' || item.get('type') === 'geonode'">
                                  <span x-show="item.get('type') !== 'WMS' && item.get('type') !== 'geonode'">This layer does not support dynamic legend creation.</span>
                              </div>
                          </div>
                      </div>
                  </template>
              </div>
          </div>
      </div>
    `;document.getElementById("rightBottomSlot").innerHTML=t},v=t=>{i.store("legend",{componentIsActive:!1,buttonDomOrder:t,showLegend:!1,visibleLayers:d.getLayers().getArray().filter(e=>e.getVisible()),toggleLegend(){this.componentIsActive=!this.componentIsActive,this.showLegend=!this.showLegend,this.updateVisibleLayers()},updateVisibleLayers(){this.visibleLayers=d.getLayers().getArray().filter(e=>e.getVisible())},getLegendUrl(e){const n=e.getSource();let s=typeof n.getUrl=="function"?n.getUrl():n.getUrl;const r=/(https?:\/\/[^/]+\/[^/]+)\//,o=s.match(r),a=o?o[1]:s;return e.getSource()instanceof l?`${a}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${n.getParams().LAYERS}`:n instanceof g?`${a}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${e.get("layername")}`:""},toggleDetails(e){e.showDetails=!e.showDetails}}),c([[m,"#legendNavButton"],[p,"#legendContainer"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught. Updating legend Markup'),i.store("legend").updateVisibleLayers()})};export{v as initialize};
//# sourceMappingURL=legend-cff08268.js.map
