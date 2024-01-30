import{m as a,e as i,O as f,a as p,v as h,r as g,K as b}from"./index-05542e30.js";import{d as m}from"./contentDecorator-d883a54f.js";import{g as I}from"./bonesSvgGenerator-1d5190eb.js";const v=()=>{const c=`
  <div id="featureInfoOffcanvas" class="position-absolute end-0 top-0 bg-white h-100 w-50 p-3 shadow overflow-scroll" tabindex="-1" aria-labelledby="featuresOffcanvasLabel" x-show="$store.featureInfoStore.showOffCanvas" style="z-index:1001" x-transition>
  <!-- Offcanvas Header -->
  <div class="offcanvas-header d-flex justify-content-between">
    <h5 class="offcanvas-title" id="featuresOffcanvasLabel">Feature Information</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.featureInfoStore.closePanel()"></button>
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
          <tr>
            <td></td>
            <td class="text-end">
              <button
                class="btn btn-primary btn-sm"
                :disabled="$store.featureInfoStore.disableButton()"
                @click="$store.featureInfoStore.addToCompareTool($event)">add to compare tool</button>
            </td>
        </tr>
          <template x-if="$store.featureInfoStore.filteredFeatures[$store.featureInfoStore.currentFeatureIndex]">

            <template x-for="[key, value] in $store.featureInfoStore.getFilteredFeatures()" :key="key">
              <template x-if="$store.featureInfoStore.filteredFeatures">
                    <tr>
                      <td><strong x-text="$store.featureInfoStore.getKeyTranslation(key)"></strong></td>
                      <td><span x-html="$store.featureInfoStore.decorateValue(value)"></span></td>
                    </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>
    </template>

    <template x-if="$store.featureInfoStore.currentSkullSVG.length > 4">
        <div class="row w-100">
          <div class="col-6" x-html="$store.featureInfoStore.svgContent($store.featureInfoStore.currentSkullSVG)"></div>
          <div class="col-6">
          <div class="legend col">
              <div class="rect dark"></div> bone preservation &gt;75% <br>
              <div class="rect grey"></div> bone preservation &lt;75% <br>
              <div class="rect pale"></div> affected <br>
              <div class="rect white"></div>  unknown / absent <br>
          </div>
          </div>
        </div>
    </template>
  </div>
</div>

  `;document.getElementById("map").insertAdjacentHTML("afterend",c)},F=()=>{a.store("featureInfoStore",{featuresDict:{},filteredFeatures:[],currentFeatureIndex:0,selectedOption:"",showOffCanvas:!1,visibleLayers:[],selectedLayers:[],currentSkullSVG:"",getFilteredFeatures:function(){if(!this.filteredFeatures[this.currentFeatureIndex])return[];const e=this.filteredFeatures[this.currentFeatureIndex].properties,t=Object.entries(e).filter(([n,o])=>!this.isBlacklistedKey(n)&&this.valueIsSet(o)).sort((n,o)=>{const l=Object.keys(this.keyTranslations).indexOf(n[0]),u=Object.keys(this.keyTranslations).indexOf(o[0]);return l===-1&&u===-1?0:l===-1?1:u===-1?-1:l-u}),s=t.findIndex(([n])=>n==="storage_place_freetext");if(s!==-1&&t[s][1]){const n=t.findIndex(([o])=>o==="storage_place");n!==-1&&t.splice(n,1)}return console.log("sorted and filtered properties",t),t},keyTranslations:{disease:"Disease",sex:"Sex",age:"Age",age_class:"Age class",age_freetext:"Age comment",adults:"Adults",chronology:"Chronology",chronology_freetext:"Chronology comment",dating_method:"Dating method",subadults:"Subadults",c_no_o_bones:"Amount of bones",c_technic:"Used Technic",doi:"Doi",dna_analyses:"aDNA analyses",dna_analyses_link:"DNA analyses",storage_place:"Storage place",storage_place_freetext:"Storage place freetext",archaeological_burial_type:"Archaeological burial type",archaeological_funery_context:"Archaeological funerary context",archaeological_individualid:"Archaeological individual ID",archaeological_tombid:"Archaeological tomb ID",gaz_link:"iDAI.gazetteer link",gazid:"iDAI.gazetteer ID",site:"Site",origin:"Origin",reference_images:"Reference images",references:"References",uuid:"UUID",owner:"Owner",fid:"Datbase ID"},getKeyTranslation:function(e){return this.keyTranslations[e]||e},closePanel:function(){this.showOffCanvas=!1,i("deleteMapPins",{})},buildLink:function(e){return f(e)},valueIsSet:function(e){var r=e!==!1&&e!==void 0&&e!==null&&e!=="";return r},decorateValue:function(e){return m(e,["appendEuroToNumber","createLinkForUrl","decodeUrl","replaceBullet","harmonizeUnknown","harmonizeTrueFalse","harmonizeMonth","removeListIfOnlyOneLi"])},isBlacklistedKey:function(e){return["c_b_t_bc_rel","svgid","c_bones","bone_relations","age","adults","subadults","c_no_o_bones","published","gaz_link","gazid","uuid","fid","owner","is_approved"].includes(e)},svgContent:function(e){let r=decodeURIComponent(e);return JSON.stringify(r),I(r)},init:function(){this.updateVisibleLayers(),this.updateSelectedOption()},updateVisibleLayers:function(){this.visibleLayers=p.getLayers().getArray().filter(e=>e.getVisible()&&(this.selectedLayers.length===0||this.selectedLayers.includes(e.get("name"))))},updateSelectedOption:function(){this.selectedOption=this.visibleLayers.length>0?this.visibleLayers[0].get("name"):""},changeSelect:function(e){this.currentFeatureIndex=0,this.filteredFeatures=this.featuresDict[e]||[]},showNext:function(){this.currentFeatureIndex<this.filteredFeatures.length-1&&(this.currentFeatureIndex++,this.updateCurrentSkullSVG())},showPrevious:function(){this.currentFeatureIndex>0&&(this.currentFeatureIndex--,this.updateCurrentSkullSVG())},updateCurrentSkullSVG:function(){const e=this.filteredFeatures[this.currentFeatureIndex];e&&e.properties.svgid&&(this.currentSkullSVG=e.properties.svgid)},handleFeatureInfo:function(e){i("showLoading",{}),this.resetFeatureInfo();const r=h.getResolution();let t=0;const s=this.visibleLayers.length;this.visibleLayers.forEach(n=>this.processLayer(n,e.coordinate,r,()=>{t++,t===s&&this.updateAfterProcessing(e)}))},resetFeatureInfo:function(){this.featuresDict={},this.currentFeatureIndex=0,this.currentSkullSVG=""},processLayer:function(e,r,t,s){if(!e.getVisible())return;const n=e.getSource().getFeatureInfoUrl(r,t,"EPSG:3857",{INFO_FORMAT:"application/json",FEATURE_COUNT:200});n&&(console.warn("making a fetch request in feature info"),fetch(n).then(o=>o.json()).then(o=>{Object.keys(o.features).length>0&&(window.daard_items=o,this.processFeatureData(e,o),o.features.length>0&&o.features[0].properties.svgid&&(this.currentSkullSVG=o.features[0].properties.svgid)),s()}).catch(o=>{console.error("Error:",o),i("hideLoading",{})}))},processFeatureData:function(e,r){const t=e.get("dataset").attribute_set.filter(s=>s.visible).map(s=>s.attribute);this.featuresDict[e.get("name")]=r.features.map(s=>({...s,properties:this.filterFeatureProperties(s.properties,t)}))},filterFeatureProperties:function(e,r){return Object.keys(e).filter(t=>r.includes(t)).reduce((t,s)=>(t[s]=e[s],t),{})},updateAfterProcessing:function(e){const r=Object.keys(this.featuresDict)[0];if(r&&(this.filteredFeatures=this.featuresDict[r],this.selectedOption=r),i("hideLoading",{}),this.isFeaturesDictNotEmpty()){this.showOffCanvas=!0;const t=e.coordinate,s=[[t[0],t[1]]];i("deleteMapPins",{}),i("addMapPins",{pin_coordinates:s,fitView:!0,moveCenterLeft:!0})}else console.log("The dictionary is empty.")},isFeaturesDictNotEmpty:function(){return Object.keys(this.featuresDict).length>0},disableButton:function(){const e=this.filteredFeatures[this.currentFeatureIndex].properties.uuid;let t=a.store("compareTool").items.disease_case.find(s=>s.properties.uuid==e);return t=!!t,t},addToCompareTool:function(e){this.disableButton();const r=this.filteredFeatures[this.currentFeatureIndex].properties.uuid,t=a.store("compareTool").find_in_response(window.daard_items,r);a.store("compareTool").update_disease_case_store(t)}}),g([[v,"#featureInfoOffcanvas"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught.'),a.store("featureInfoStore").init()}),document.addEventListener("mapLayerSelected",function(e){console.debug('Custom event "mapLayerSelected" caught.'),a.store("featureInfoStore").selectedLayers=e.detail.layer,a.store("featureInfoStore").init()});function d(e){if(!a.store("pluginStatus").mapClickEnabled)return!1;a.store("featureInfoStore").handleFeatureInfo.bind(a.store("featureInfoStore"))(e)}a.nextTick(()=>{b.on("singleclick",d)})};export{F as initialize};
//# sourceMappingURL=featureInfo-d257a5ab.js.map
