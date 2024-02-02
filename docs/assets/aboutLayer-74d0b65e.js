import{m as r,r as l}from"./index-bf3ecceb.js";const c=()=>{let n=`
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" 
        x-transition tabindex="-1" 
        id="aboutOffcanvas" 
        aria-labelledby="aboutOffcanvasLabel"
        x-show="$store.aboutLayer.componentIsActive">
      <div class="offcanvas-header mb-4">
        <h5 class="offcanvas-title" id="aboutOffcanvasLabel" x-text="$store.aboutLayer.mapName">Filter</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.aboutLayer.componentIsActive = false;"></button>
      </div>

      <div class="offcanvas-body">
            <img :src="$store.aboutLayer.layer?.dataset?.thumbnail_url || ''">
            <table class="table table-striped">
                <tbody>
                    <template x-for="[key, value] in Object.entries($store.aboutLayer.metadata)" :key="key">
                        <tr>
                            <td x-text="$store.aboutLayer.pritfyName(key)" class="aboutKey"></td>
                            <td x-html="value" class="aboutValue"></td>
                        </tr>
                    </template>   
                </tbody>
            </table>   
        </div>
  </div>`;document.getElementById("map").insertAdjacentHTML("afterend",n)},i=()=>{r.store("aboutLayer",{componentIsActive:!1,layer:{},allowedKeys:["data_quality_statement","abstract","created","license","maintenance_frequency","metadata_author","poc","srid","supplemental_information"],metadata:{},mapName:"",pritfyName:function(t){return t=t.replaceAll("_"," "),t}}),document.addEventListener("aboutPushed",function(t){console.debug('Custom event "aboutPushed" caught in aboutLayer/aboutLayer.js');const e=r.store("aboutLayer"),o=t.detail.instance;e.layer=o,e.mapName=o.mapName,e.componentIsActive=!0;const s={};e.allowedKeys.forEach(a=>{o.dataset.hasOwnProperty(a)&&(s[a]=o.dataset[a],a=="poc"&&(s[a]=o.dataset[a].username))}),console.log("newMetadata"),console.log(s),e.metadata=s}),l([[c,"#aboutOffcanvas"]])};export{i as initialize};
//# sourceMappingURL=aboutLayer-74d0b65e.js.map
