import{m as n,e as i,O as f,a as h,v as p,r as g,K as m}from"./index-23d7eb7e.js";import{d as b}from"./contentDecorator-346bdd9f.js";import{g as v}from"./bonesSvgGenerator-075e1aba.js";const y=()=>{const c=`
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
                    <tr :class="key">
                      <td><strong x-text="$store.featureInfoStore.getKeyTranslation(key)"></strong></td>
                      <td><div x-html="$store.featureInfoStore.decorateValue(value)"></div></td>
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

  `;document.getElementById("map").insertAdjacentHTML("afterend",c)},_=()=>{n.store("featureInfoStore",{featuresDict:{},filteredFeatures:[],currentFeatureIndex:0,selectedOption:"",showOffCanvas:!1,visibleLayers:[],selectedLayers:[],currentSkullSVG:"",getFilteredFeatures:function(){if(!this.filteredFeatures[this.currentFeatureIndex])return[];const e=this.filteredFeatures[this.currentFeatureIndex].properties,t=Object.entries(e).filter(([a,o])=>!this.isBlacklistedKey(a)&&this.valueIsSet(o)).sort((a,o)=>{const l=Object.keys(this.keyTranslations).indexOf(a[0]),u=Object.keys(this.keyTranslations).indexOf(o[0]);return l===-1&&u===-1?0:l===-1?1:u===-1?-1:l-u}),s=t.findIndex(([a])=>a==="storage_place_freetext");if(s!==-1&&t[s][1]){const a=t.findIndex(([o])=>o==="storage_place");a!==-1&&t.splice(a,1)}return console.log("sorted and filtered properties",t),t},keyTranslations:{disease:"Disease",sex:"Sex",sex_freetext:"Methods for sex determination",age:"Age",age_estimation_method:"Methods for age estimation",age_class:"Age class",age_freetext:"Estimated age",adults:"Adults",size_from:"Body height from (cm)",size_to:"Body height to (cm)",size_freetext:"Methods for body height calculation",chronology:"Time period",chronology_freetext:"Time period comment",dating_method:"Dating method",subadults:"Subadults",c_no_o_bones:"Amount of bones",c_technic:"Used technique",doi:"Doi",dna_analyses:"aDNA analyses",dna_analyses_link:"DNA analyses",storage_place:"Storage place",storage_place_freetext:"Storage place freetext",archaeological_burial_type:"Archaeological burial type",archaeological_funery_context:"Archaeological funerary context",archaeological_individualid:"Archaeological individual ID",archaeological_tombid:"Archaeological tomb ID",gaz_link:"iDAI.gazetteer link",gazid:"iDAI.gazetteer ID",site:"Site",origin:"Origin",reference_images:"Reference images",references:"References",comment:"Comment",c_b_t_bc_rel:"Inventory",uuid:"UUID",owner:"Owner",fid:"Datbase ID"},getKeyTranslation:function(e){return this.keyTranslations[e]||e},closePanel:function(){this.showOffCanvas=!1,i("deleteMapPins",{})},buildLink:function(e){return f(e)},valueIsSet:function(e){var r=e!==!1&&e!==void 0&&e!==null&&e!=="";return r},decorateValue:function(e){return b(e,["appendEuroToNumber","createLinkForUrl","decodeUrl","replaceBullet","harmonizeUnknown","harmonizeTrueFalse","harmonizeMonth","removeListIfOnlyOneLi","toggleLongText"])},isBlacklistedKey:function(e){return["svgid","c_bones","bone_relations","age","adults","subadults","c_no_o_bones","published","gaz_link","gazid","fid","owner","is_approved"].includes(e)},svgContent:function(e){let r=decodeURIComponent(e);return JSON.stringify(r),v(r)},init:function(){this.updateVisibleLayers(),this.updateSelectedOption()},updateVisibleLayers:function(){this.visibleLayers=h.getLayers().getArray().filter(e=>e.getVisible()&&(this.selectedLayers.length===0||this.selectedLayers.includes(e.get("name"))))},updateSelectedOption:function(){this.selectedOption=this.visibleLayers.length>0?this.visibleLayers[0].get("name"):""},changeSelect:function(e){this.currentFeatureIndex=0,this.filteredFeatures=this.featuresDict[e]||[]},showNext:function(){this.currentFeatureIndex<this.filteredFeatures.length-1&&(this.currentFeatureIndex++,this.updateCurrentSkullSVG())},showPrevious:function(){this.currentFeatureIndex>0&&(this.currentFeatureIndex--,this.updateCurrentSkullSVG())},updateCurrentSkullSVG:function(){const e=this.filteredFeatures[this.currentFeatureIndex];e&&e.properties.svgid&&(this.currentSkullSVG=e.properties.svgid)},handleFeatureInfo:function(e){i("showLoading",{}),this.resetFeatureInfo();const r=p.getResolution();let t=0;const s=this.visibleLayers.length;this.visibleLayers.forEach(a=>this.processLayer(a,e.coordinate,r,()=>{t++,t===s&&this.updateAfterProcessing(e)}))},resetFeatureInfo:function(){this.featuresDict={},this.currentFeatureIndex=0,this.currentSkullSVG=""},processLayer:function(e,r,t,s){if(!e.getVisible())return;const a=e.getSource().getFeatureInfoUrl(r,t,"EPSG:3857",{INFO_FORMAT:"application/json",FEATURE_COUNT:200});a&&(console.warn("making a fetch request in feature info"),fetch(a).then(o=>o.json()).then(o=>{Object.keys(o.features).length>0&&(window.daard_items=o,this.processFeatureData(e,o),o.features.length>0&&o.features[0].properties.svgid&&(this.currentSkullSVG=o.features[0].properties.svgid)),s()}).catch(o=>{console.error("Error:",o),i("hideLoading",{})}))},processFeatureData:function(e,r){const t=e.get("dataset").attribute_set.filter(s=>s.visible).map(s=>s.attribute);this.featuresDict[e.get("name")]=r.features.map(s=>({...s,properties:this.filterFeatureProperties(s.properties,t)}))},filterFeatureProperties:function(e,r){return Object.keys(e).filter(t=>r.includes(t)).reduce((t,s)=>(t[s]=e[s],t),{})},updateAfterProcessing:function(e){const r=Object.keys(this.featuresDict)[0];if(r&&(this.filteredFeatures=this.featuresDict[r],this.selectedOption=r),i("hideLoading",{}),this.isFeaturesDictNotEmpty()){this.showOffCanvas=!0;const t=e.coordinate,s=[[t[0],t[1]]];i("deleteMapPins",{}),i("addMapPins",{pin_coordinates:s,fitView:!0,moveCenterLeft:!0})}else console.log("The dictionary is empty.")},isFeaturesDictNotEmpty:function(){return Object.keys(this.featuresDict).length>0},disableButton:function(){const e=this.filteredFeatures[this.currentFeatureIndex].properties.uuid;let t=n.store("compareTool").items.disease_case.find(s=>s.properties.uuid==e);return t=!!t,t},addToCompareTool:function(e){this.disableButton();const r=this.filteredFeatures[this.currentFeatureIndex].properties.uuid,t=n.store("compareTool").find_in_response(window.daard_items,r);n.store("compareTool").update_disease_case_store(t)}}),g([[y,"#featureInfoOffcanvas"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught.'),n.store("featureInfoStore").init()}),document.addEventListener("mapLayerSelected",function(e){console.debug('Custom event "mapLayerSelected" caught.'),n.store("featureInfoStore").selectedLayers=e.detail.layer,n.store("featureInfoStore").init()});function d(e){if(!n.store("pluginStatus").mapClickEnabled)return!1;n.store("featureInfoStore").handleFeatureInfo.bind(n.store("featureInfoStore"))(e)}n.nextTick(()=>{m.on("singleclick",d)})};export{_ as initialize};
//# sourceMappingURL=featureInfo-c4ac8fbc.js.map
