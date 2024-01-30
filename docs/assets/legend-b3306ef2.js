import{m as a,a as l,I as d,V as g,r as c}from"./index-05542e30.js";import"./feather-becb2378.js";const m=()=>{const t=`
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
    `;document.getElementById("rightBottomSlot").innerHTML=t},y=t=>{a.store("legend",{componentIsActive:!1,buttonDomOrder:t,showLegend:!1,visibleLayers:l.getLayers().getArray().filter(e=>e.getVisible()),toggleLegend(){this.componentIsActive=!this.componentIsActive,this.showLegend=!this.showLegend,this.updateVisibleLayers()},updateVisibleLayers(){if(this.visibleLayers=l.getLayers().getArray().filter(e=>e.getVisible()),this.visibleLayers.length==1){const e=this.visibleLayers[0];this.toggleDetails(e)}},getLegendUrl(e){const n=e.getSource();let s=typeof n.getUrl=="function"?n.getUrl():n.getUrl;const r=/(https?:\/\/[^/]+\/[^/]+)\//,o=s.match(r),i=o?o[1]:s;return e.getSource()instanceof d?`${i}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${n.getParams().LAYERS}`:n instanceof g?`${i}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${e.get("layername")}`:""},toggleDetails(e){console.log(e),e.showDetails=!e.showDetails}}),c([[m,"#legendNavButton"],[p,"#legendContainer"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught. Updating legend Markup'),a.store("legend").updateVisibleLayers()})};export{y as initialize};
//# sourceMappingURL=legend-b3306ef2.js.map
