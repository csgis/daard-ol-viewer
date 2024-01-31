import{m as i,a as y,e as s,n as p,v as u,r as g}from"./index-732974ed.js";import"./feather-becb2378.js";import{p as h}from"./index-c4575d02.js";function f(r){if(!Array.isArray(r))return!1;for(const o of r){if(!Array.isArray(o)||o.length!==2)return!1;const[l,n]=o;if(typeof n!="number"||isNaN(n)||n<-90||n>90||typeof l!="number"||isNaN(l)||l<-180||l>180)return!1}return!0}const m=(r,o)=>{const l="EPSG:3857";return r.map(n=>{const e=h(o,l,n);return console.log(e),[e[0],e[1]]})},b=()=>{let r=`

    <div class="overflow-auto" id="layerPanelEditBody" x-show="$store.layerPanelContainer.sectionActive == 'layer-edit'">

    <div class="offcanvas-body p-3">
        <template x-for="(layer, index) in $store.layerPanel.ol_feature_layers" :key="index">
          <div class="row p-0 border-top py-2" :class="{ 'bg-warning': $store.layerPanel.layerCheckbox.includes(layer.get('name')) }">
              <div class="col-1 form-check form-switch pe-0">
              <input 
                x-tooltip.placement.right="'Show/Hide Layer ' + layer.getVisible()"
                class="form-check-input" 
                type="checkbox" 
                :id="'layerCheckbox' + layer.get('name')" 
                x-bind:checked="layer.getVisible()" 
                @click="$store.layerPanel.toggleLayerVisibility(index)">
              </div>
              <div class="col-5 form-check p-0" x-tooltip.placement.top="'Click to Select Layer'">
                <input 
                  class="form-check-input d-none p-0"
                  type="checkbox" 
                  :id="'layerselectCheckbox' + layer.get('name')" 
                  :checked="$store.layerPanel.layerCheckbox.includes(layer.get('name'))"
                  @change="$store.layerPanel.handleCheckboxChange(layer.get('name'), $event.target.checked)">              
                  <label 
                    class="form-check-label p-0 layer-label"
                    x-text="layer.get('name')" 
                    :for="'layerselectCheckbox' + layer.get('name')"
                  ></label>
              </div>
              <div class="form-range-container col-3 position-relative p-0">
              <input type="range" class="form-range p-0"
                min="0" 
                max="1" 
                step="0.01" 
                x-init="layer.opacity = layer.opacity || 1" 
                x-model="layer.opacity" 
                x-tooltip.placement.top="'Change opacity'"
                x-on:input="$store.layerPanel.changeLayerOpacity(index)" 
                :disabled="!layer.getVisible()">
              </div>
              <div class="col p-0 text-right ps-3">
                  <span 
                  x-tooltip.placement.top="'Layer Info'"
                  class="d-inline"
                  :class="{'disabled opacity-5' : (layer.get('type') !== 'geonode')}"
                  @click="$store.layerPanel.openAbout(index)"
                  ><i data-feather="info" class="size-20"></i></span>

                  <span 
                  x-tooltip.placement.top="'Zoom to layer'"
                  class="d-inline"
                  :class="{'disabled opacity-5' : (layer.get('type') !== 'geonode')}"
                  @click="$store.layerPanel.zoomToLayerExtent(index)"
                  ><i data-feather="zoom-in" class="size-20"></i></span>

                <span 
                  style="cursor:pointer"
                  x-show="$store.layerPanel.showFilter"
                  x-tooltip.placement.left="'Show filter'"
                  :class="{
                    'disabled opacity-5': (layer.get('type') !== 'geonode' && layer.get('type') !== 'WMS'),
                    'text-danger': $store.layerPanel.activeFilters.includes(layer.get('name'))
                  }"
                  @click="$store.layerPanel.openFilter(index)"
                  ><i data-feather="filter" class="size-20"></i></span>
              </div>

            </div>
        </template>
    </div>
  </div>`;var o=document.getElementById("layerPanelContainerBody");o.insertAdjacentHTML("beforeend",r)},x=()=>{let r=`
        <button 
          id="layerPanelNavButton"
          type="button" 
          x-tooltip.placement.right="'Map Layers'"
          class="btn btn-inactive btn-square-md rounded-0 m-0 border-0 shadow-none text-dark d-block"
          :class="{'bg-light' : $store.layerPanelContainer.sectionActive == 'layer-edit',
          ['order-' + $store.layerPanel.buttonDomOrder]: true}"
          @click="$store.layerPanelContainer.setSectionActive('layer-edit')">          
            <i data-feather="layers" class="size-16"></i>

        </button>

    `;var o=document.getElementById("layerPanelContainerNavBar");o.insertAdjacentHTML("beforeend",r)},C=async r=>{const o=i.store("pluginStatus"),l=o.registeredPluginNames.includes("filterLayer")||o.registeredPluginNames.includes("geonodeCustomLayerFilter");i.store("layerPanel",{componentIsActive:!1,buttonDomOrder:r,layerCheckbox:[],activeFilters:[],showFilter:l,ol_feature_layers:y.getLayers().getArray(),handleCheckboxChange:function(e,t){t?this.layerCheckbox.includes(e)||this.layerCheckbox.push(e):this.layerCheckbox=this.layerCheckbox.filter(a=>a!==e),console.debug(`Checkbox for ${e} is now ${t?"checked":"unchecked"}`),console.debug(this.layerCheckbox),s("mapLayerSelected",{layer:this.layerCheckbox})},toggleLayerVisibility:function(e){const t=this.ol_feature_layers[e];t.visible=!t.getVisible(),t.setVisible(t.visible),s("mapLayerHaveChanged",{})},changeLayerOpacity:function(e){const t=this.ol_feature_layers[e],a=y.getLayers().getArray()[e];t.opacity=Math.max(0,Math.min(1,t.opacity)),a.setOpacity(t.opacity)},zoomToLayerExtent:function(e){const a=this.ol_feature_layers[e].get("dataset").ll_bbox_polygon.coordinates.flat();if(f(a))try{const c=m(a,"EPSG:4326"),d=new p([c]);u.fit(d.getExtent(),{padding:[100,100,100,100]})}catch(c){console.error(`Error: ${c.message}`)}else console.error("Invalid EPSG:4326 coordinates")},openAbout:function(e){const t=this.ol_feature_layers[e],a=t.getSource();a.mapName=t.get("name"),a.dataset=t.get("dataset"),s("aboutPushed",{instance:a})},openFilter:function(e){const t=this.ol_feature_layers[e],a=t.getSource();a.mapName=t.get("name"),a.dataset=t.get("dataset"),s("filterPushed",{instance:a})},isFilterActive:function(e){return console.log("checking for"),console.log(e),activeFilters=this.activeFilters,activeFilters.includes(e)}}),g([[b,"#layerPanelEditBody"],[x,"#layerPanelNavButton"]]),i.effect(()=>{console.log(i.store("layerPanel").componentIsActive)})};export{C as initialize};
//# sourceMappingURL=layerPanel-ddacd2b8.js.map
