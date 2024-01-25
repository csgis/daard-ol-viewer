import{m as n,e as i,O as d,a as f,v as h,r as p,K as b}from"./index-22092f9a.js";import{d as g}from"./contentDecorator-805dceda.js";import{g as m}from"./bonesSvgGenerator-1d5190eb.js";const v=()=>{const u=`
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

  `;document.getElementById("map").insertAdjacentHTML("afterend",u)},x=()=>{n.store("featureInfoStore",{featuresDict:{},filteredFeatures:[],currentFeatureIndex:0,selectedOption:"",showOffCanvas:!1,visibleLayers:[],selectedLayers:[],currentSkullSVG:"",getFilteredFeatures:function(){if(!this.filteredFeatures[this.currentFeatureIndex])return[];const e=this.filteredFeatures[this.currentFeatureIndex].properties,r=Object.entries(e).filter(([s,a])=>!this.isBlacklistedKey(s)&&this.valueIsSet(a)).sort((s,a)=>{const o=Object.keys(this.keyTranslations).indexOf(s[0]),l=Object.keys(this.keyTranslations).indexOf(a[0]);return o===-1&&l===-1?0:o===-1?1:l===-1?-1:o-l});return console.log("sorted and filtered properties",r),r},keyTranslations:{disease:"Disease",sex:"Sex",age:"Age",age_class:"Age class",age_freetext:"Age comment",adults:"Adults",chronology:"Chronology",chronology_freetext:"Chronology comment",dating_method:"Dating method",subadults:"Subadults",c_no_o_bones:"Amount of bones",c_technic:"Used Technic",doi:"Doi",dna_analyses:"aDNA analyses",dna_analyses_link:"DNA analyses",storage_place:"Storage place",storage_place_freetext:"Storage place freetext",archaeological_burial_type:"Archaeological burial type",archaeological_funery_context:"Archaeological funerary context",archaeological_individualid:"Archaeological individual ID",archaeological_tombid:"Archaeological tomb ID",gaz_link:"iDAI.gazetteer link",gazid:"iDAI.gazetteer ID",site:"Site",origin:"Origin",reference_images:"Reference images",references:"References",uuid:"UUID",owner:"Owner",fid:"Datbase ID"},getKeyTranslation:function(e){return this.keyTranslations[e]||e},closePanel:function(){this.showOffCanvas=!1,i("deleteMapPins",{})},buildLink:function(e){return d(e)},valueIsSet:function(e){var t=e!==!1&&e!==void 0&&e!==null&&e!=="";return t},decorateValue:function(e){return g(e,["appendEuroToNumber","createLinkForUrl","decodeUrl","replaceBullet","harmonizeUnknown","harmonizeTrueFalse","harmonizeMonth","removeListIfOnlyOneLi"])},isBlacklistedKey:function(e){return["c_b_t_bc_rel","svgid","c_bones","bone_relations","age","adults","subadults","c_no_o_bones","published","gaz_link","gazid","uuid","fid","owner","is_approved"].includes(e)},svgContent:function(e){let t=decodeURIComponent(e);return JSON.stringify(t),m(t)},init:function(){this.updateVisibleLayers(),this.updateSelectedOption()},updateVisibleLayers:function(){this.visibleLayers=f.getLayers().getArray().filter(e=>e.getVisible()&&(this.selectedLayers.length===0||this.selectedLayers.includes(e.get("name"))))},updateSelectedOption:function(){this.selectedOption=this.visibleLayers.length>0?this.visibleLayers[0].get("name"):""},changeSelect:function(e){this.currentFeatureIndex=0,this.filteredFeatures=this.featuresDict[e]||[]},showNext:function(){this.currentFeatureIndex<this.filteredFeatures.length-1&&(this.currentFeatureIndex++,this.updateCurrentSkullSVG())},showPrevious:function(){this.currentFeatureIndex>0&&(this.currentFeatureIndex--,this.updateCurrentSkullSVG())},updateCurrentSkullSVG:function(){const e=this.filteredFeatures[this.currentFeatureIndex];e&&e.properties.svgid&&(this.currentSkullSVG=e.properties.svgid)},handleFeatureInfo:function(e){i("showLoading",{}),this.resetFeatureInfo();const t=h.getResolution();let r=0;const s=this.visibleLayers.length;this.visibleLayers.forEach(a=>this.processLayer(a,e.coordinate,t,()=>{r++,r===s&&this.updateAfterProcessing(e)}))},resetFeatureInfo:function(){this.featuresDict={},this.currentFeatureIndex=0,this.currentSkullSVG=""},processLayer:function(e,t,r,s){if(!e.getVisible())return;const a=e.getSource().getFeatureInfoUrl(t,r,"EPSG:3857",{INFO_FORMAT:"application/json",FEATURE_COUNT:200});a&&(console.warn("making a fetch request in feature info"),fetch(a).then(o=>o.json()).then(o=>{Object.keys(o.features).length>0&&(window.daard_items=o,this.processFeatureData(e,o),o.features.length>0&&o.features[0].properties.svgid&&(this.currentSkullSVG=o.features[0].properties.svgid)),s()}).catch(o=>{console.error("Error:",o),i("hideLoading",{})}))},processFeatureData:function(e,t){const r=e.get("dataset").attribute_set.filter(s=>s.visible).map(s=>s.attribute);this.featuresDict[e.get("name")]=t.features.map(s=>({...s,properties:this.filterFeatureProperties(s.properties,r)}))},filterFeatureProperties:function(e,t){return Object.keys(e).filter(r=>t.includes(r)).reduce((r,s)=>(r[s]=e[s],r),{})},updateAfterProcessing:function(e){const t=Object.keys(this.featuresDict)[0];if(t&&(this.filteredFeatures=this.featuresDict[t],this.selectedOption=t),i("hideLoading",{}),this.isFeaturesDictNotEmpty()){this.showOffCanvas=!0;const r=e.coordinate,s=[[r[0],r[1]]];i("deleteMapPins",{}),i("addMapPins",{pin_coordinates:s,fitView:!0,moveCenterLeft:!0})}else console.log("The dictionary is empty.")},isFeaturesDictNotEmpty:function(){return Object.keys(this.featuresDict).length>0},disableButton:function(){const e=this.filteredFeatures[this.currentFeatureIndex].properties.uuid;let r=n.store("compareTool").items.disease_case.find(s=>s.properties.uuid==e);return r=!!r,r},addToCompareTool:function(e){this.disableButton();const t=this.filteredFeatures[this.currentFeatureIndex].properties.uuid,r=n.store("compareTool").find_in_response(window.daard_items,t);n.store("compareTool").update_disease_case_store(r)}}),p([[v,"#featureInfoOffcanvas"]]),document.addEventListener("mapLayerHaveChanged",function(e){console.debug('Custom event "mapLayerHaveChanged" caught.'),n.store("featureInfoStore").init()}),document.addEventListener("mapLayerSelected",function(e){console.debug('Custom event "mapLayerSelected" caught.'),n.store("featureInfoStore").selectedLayers=e.detail.layer,n.store("featureInfoStore").init()});function c(e){if(!n.store("pluginStatus").mapClickEnabled)return!1;n.store("featureInfoStore").handleFeatureInfo.bind(n.store("featureInfoStore"))(e)}n.nextTick(()=>{b.on("singleclick",c)})};export{x as initialize};
//# sourceMappingURL=featureInfo-5801eef5.js.map
