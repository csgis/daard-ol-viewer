import{y as F,z as w,C as L,P as O,h as C,S as y,A as g,B as k,D as v,E as $,G as D,H as P,J as T,K as I,N as p,m as i,a as E,e as u,v as j,r as N}from"./index-065f7d44.js";function A(a){if(!(a.context instanceof CanvasRenderingContext2D))throw new Error("Only works for render events from Canvas 2D layers");const e=a.inversePixelTransform[0],t=a.frameState,s=F(a.inversePixelTransform.slice(),t.coordinateToPixelTransform),r=w(t.viewState.resolution,e);let o;return new L(a.context,e,t.extent,s,t.viewState.rotation,r,o)}const b=2e3,R=(a,e=1)=>{if(!a.coordinate)return;const t=a.coordinate,s=new O([t[0],t[1]]),r=new C(s);r.setStyle(new y({image:new g({radius:5,fill:new k({color:"rgba(255, 255, 255, 0)"}),stroke:new v({color:"rgba(255, 255, 255, 0)",width:1})})})),$.addFeature(r),V(r,e)},V=(a,e)=>{let t=0,s=Date.now(),r=a.getGeometry().clone();function o(f){const l=f?f.frameState:!1;if(!l||!l.time)return;const c=l.time-s;c>=b&&(s=Date.now(),r=a.getGeometry().clone(),t<e?(t++,setTimeout(o,0)):T(n));const d=A(f),h=c/b,x=p(h)*25+5,m=p(1-h),S=new y({image:new g({radius:x,stroke:new v({color:"rgba(255, 0, 0, "+m+")",width:.25+m})})});d.setStyle(S),d.drawGeometry(r),I.render()}D.find(f=>f.getVisible());const n=P.on("postrender",o)},G=()=>{const a=`
  <div id="featureInfoOffcanvas" class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-3 overflow-scroll" tabindex="-1" aria-labelledby="featuresOffcanvasLabel" x-show="$store.featureInfoStore.showOffCanvas" x-transition>
  <!-- Offcanvas Header -->
  <div class="offcanvas-header d-flex justify-content-between">
    <h5 class="offcanvas-title" id="featuresOffcanvasLabel">Feature Information</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.featureInfoStore.showOffCanvas = false"></button>
  </div>

  <!-- Layer Selection -->
  <div class="my-3">
  <label for="layerSelect">Data found on the following layers:</label>
  <select class="form-select" x-model="$store.featureInfoStore.selectedOption" x-on:change="$store.featureInfoStore.changeSelect($event.target.value)" :disabled="Object.keys($store.featureInfoStore.featuresDict).length == 1">
    <template x-for="option in Object.keys($store.featureInfoStore.featuresDict)" :key="option">
      <option :value="option" x-text="option"></option>
    </template>
  </select>
</div>


  <!-- Feature Container -->
  <div class="offcanvas-body featureInfoContainer">
    <!-- Navigation Buttons -->
    <div class="text-center my-2">
      <button class="btn btn-outline-primary btn-sm mx-1" @click="$store.featureInfoStore.showPrevious()" x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == 0" x-show="$store.featureInfoStore.filteredFeatures.length > 1">Previous</button>
      <span x-text="$store.featureInfoStore.currentFeatureIndex + 1 + ' of ' + $store.featureInfoStore.filteredFeatures.length" x-show="$store.featureInfoStore.filteredFeatures.length > 1"></span>
      <button class="btn btn-outline-primary btn-sm mx-1" @click="$store.featureInfoStore.showNext()" x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == $store.featureInfoStore.filteredFeatures.length - 1" x-show="$store.featureInfoStore.filteredFeatures.length > 1">Next</button>
    </div>
    
    <!-- Feature Properties Table -->
    <template x-if="$store.featureInfoStore.filteredFeatures.length > 0">
      <table class="table table-sm table-striped">
        <tbody>
          <template x-if="$store.featureInfoStore.filteredFeatures[$store.featureInfoStore.currentFeatureIndex]">
            <template x-for="[key, value] in Object.entries($store.featureInfoStore.filteredFeatures[$store.featureInfoStore.currentFeatureIndex].properties)" :key="key">
              <tr>
                <td><strong x-text="key"></strong></td>
                <td><span x-text="value"></span></td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</div>

  `;document.getElementById("map").insertAdjacentHTML("afterend",a)},_=()=>{i.store("featureInfoStore",{featuresDict:{},filteredFeatures:[],currentFeatureIndex:0,selectedOption:"",showOffCanvas:!1,visibleLayers:[],selectedLayers:[],init:function(){this.updateVisibleLayers(),this.updateSelectedOption()},updateVisibleLayers:function(){this.visibleLayers=E.getLayers().getArray().filter(e=>e.getVisible()&&(this.selectedLayers.length===0||this.selectedLayers.includes(e.get("name"))))},updateSelectedOption:function(){this.selectedOption=this.visibleLayers.length>0?this.visibleLayers[0].get("name"):""},changeSelect:function(e){this.currentFeatureIndex=0,this.filteredFeatures=this.featuresDict[e]||[]},showNext:function(){this.currentFeatureIndex<this.filteredFeatures.length-1&&this.currentFeatureIndex++},showPrevious:function(){this.currentFeatureIndex>0&&this.currentFeatureIndex--},handleFeatureInfo:function(e){u("showLoading",{}),this.resetFeatureInfo();const t=j.getResolution();let s=0;const r=this.visibleLayers.length;this.visibleLayers.forEach(o=>this.processLayer(o,e.coordinate,t,()=>{s++,s===r&&this.updateAfterProcessing(e)}))},resetFeatureInfo:function(){this.featuresDict={},this.currentFeatureIndex=0},processLayer:function(e,t,s,r){if(!e.getVisible())return;const o=e.getSource().getFeatureInfoUrl(t,s,"EPSG:3857",{INFO_FORMAT:"application/json",FEATURE_COUNT:200});o&&fetch(o).then(n=>n.json()).then(n=>{Object.keys(n.features).length>0&&this.processFeatureData(e,n),r()}).catch(n=>{console.error("Error:",n),u("hideLoading",{})})},processFeatureData:function(e,t){const s=e.get("dataset").attribute_set.filter(r=>r.visible).map(r=>r.attribute);this.featuresDict[e.get("name")]=t.features.map(r=>({...r,properties:this.filterFeatureProperties(r.properties,s)}))},filterFeatureProperties:function(e,t){return Object.keys(e).filter(s=>t.includes(s)).reduce((s,r)=>(s[r]=e[r],s),{})},updateAfterProcessing:function(e){const t=Object.keys(this.featuresDict)[0];t&&(this.filteredFeatures=this.featuresDict[t],this.selectedOption=t),u("hideLoading",{}),this.isFeaturesDictNotEmpty()?(this.showOffCanvas=!0,R(e)):console.log("The dictionary is empty.")},isFeaturesDictNotEmpty:function(){return Object.keys(this.featuresDict).length>0}}),N([[G,"#featureInfoOffcanvas"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught.'),i.store("featureInfoStore").init()}),document.addEventListener("mapLayerSelected",function(e){console.debug('Custom event "mapLayerSelected" caught.'),console.log(e.detail.layer),i.store("featureInfoStore").selectedLayers=e.detail.layer,i.store("featureInfoStore").init()}),i.nextTick(()=>{I.on("singleclick",i.store("featureInfoStore").handleFeatureInfo.bind(i.store("featureInfoStore")))})};export{_ as initialize};
//# sourceMappingURL=featureInfo-7c2e20fe.js.map
