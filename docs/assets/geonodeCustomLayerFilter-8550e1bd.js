import{m as u,g as f,s as h,r as g}from"./index-c18e8515.js";import{f as y}from"./feather-becb2378.js";const F=function(r,e,t){return console.log(r,e,t),fetch(`${e}/wps?service=WPS&outputFormat=json`,{headers:{accept:"application/json","accept-language":"de-DE,de;q=0.5","content-type":"application/xml"},referrer:"https://geoserver.dainst.org/catalogue/",body:`
      <wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">gs:PagedUnique</ows:Identifier>
        <wps:DataInputs>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Title>
            <wps:Data />
            <wps:Reference xmlns:xlink="http://www.w3.org/1999/xlink" mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
              <wps:Body>
                <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.0.0">
                  <wfs:Query typeName="${t}">
                    <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc">
                      <ogc:SortProperty>
                        <ogc:PropertyName>${r}</ogc:PropertyName>
                      </ogc:SortProperty>
                    </ogc:SortBy>
                  </wfs:Query>
                </wfs:GetFeature>
              </wps:Body>
            </wps:Reference>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Title>
            <wps:Data>
              <wps:LiteralData>${r}</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Title>
            <wps:Data>
              <wps:LiteralData>20</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Title>
            <wps:Data>
              <wps:LiteralData>0</wps:LiteralData>
            </wps:Data>
          </wps:Input>
        </wps:DataInputs>
        <wps:ResponseForm>
          <wps:RawDataOutput mimeType="application/json">
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">result</ows:Identifier>
          </wps:RawDataOutput>
        </wps:ResponseForm>
      </wps:Execute>
      `,method:"POST"}).then(o=>o.json()).catch(o=>{console.error("Error:",o)})};async function v(r){async function e(o,n){try{const a=await fetch(o,n);return a.ok?{success:!0,status:a.status}:{success:!1,status:a.status,error:"Response not OK"}}catch(a){return{success:!1,error:a.message}}}const t=await e(r,{method:"GET"}),s=await e(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({test:"data"})});return{getResult:t,postResult:s}}const x=()=>{let r=`
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" 
        x-transition tabindex="-1" 
        id="filterOffcanvas" 
        aria-labelledby="filterOffcanvasLabel"
        x-show="$store.geonodeCustomLayerFilter.componentIsActive">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="filterOffcanvasLabel" x-text="'Filter: ' + $store.geonodeCustomLayerFilter.currentLayerName">Filter</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.geonodeCustomLayerFilter.componentIsActive = false;"></button>
      </div>

      <div class="offcanvas-body">

        <!-- Filter content -->

        <div class="formContent">  </div>
            
            <template class="formRow">
                <div class="row mt-2 gx-1 mx-0" x-id="['filter-select']" :data-id="$id('filter-select')">
                    <div class="col-4">
                        <select class="form-select form-select-sm name" x-on:change="$store.geonodeCustomLayerFilter.updateaOnNameSelect($event.target)">
                            <option value="-" x-text="'select'" class="text-secondary"></option>
                            <template x-for="option in $store.geonodeCustomLayerFilter.visibleAttributes()">
                                <option :value="option" x-text="option"></option>
                            </template>
                        </select>
                    </div>
                    <div class="col-2">
                        <select class="form-select form-select-sm operator" aria-label="Default select example" x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()" disabled>
                            <option value="=">is</option>
                            <option value="<>">is not</option>
                        </select>
                    </div>
                    <div class="col-5">
                        <select class="form-select form-select-sm value" aria-label="Default select example" x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()" disabled>

                        </select>
                    </div>
                    <div class="col-1">
                        <button class="btn btn-light btn-sm" x-tooltip.placement.top="'remove filter'" @click="$store.geonodeCustomLayerFilter.removeItem($id('filter-select'))">
                            <i data-feather="trash-2" class="size-16"></i>
                        </button>
                    </div>
                </div>
            </template>
    
                    <pre x-data x-html="JSON.stringify($store.geonodeCustomLayerFilter.allFormValues)" class="bg-light mt-3 d-none"></pre></div>


            <!-- Filter content -->
        </div>
  </div>`;document.getElementById("map").insertAdjacentHTML("afterend",r)},b=r=>`
      <div class="layerForm" x-id="['operator-input']">
        

          <div id="${r}" x-show="'${r}' == $store.geonodeCustomLayerFilter.currentFormId">

          <p class="alert alert-warning mt-5" x-cloak role="alert" x-text="$store.geonodeCustomLayerFilter.corsInformation" x-show="!$store.geonodeCustomLayerFilter.corsTestpassed"></p>

            <div x-show="$store.geonodeCustomLayerFilter.corsTestpassed">  
                <div class="form-check form-switch mt-3">
                <input class="form-check-input or_operator_selector" :id="$id('operator-input')" type="checkbox"  x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()">
                <label class="form-check-label" :for="$id('operator-input')">AND / OR</label>
                </div>

                <div x-data>
                    <button x-data
                    class="btn btn-secondary btn-sm mt-3 addItem"
                    @click="$store.geonodeCustomLayerFilter.addItem('${r}')">add filter</button>

                    <button x-data
                        class="btn btn-secondary btn-sm mt-3 submitFilter"
                        @click="$store.geonodeCustomLayerFilter.submitFilterForm()"
                        :disabled="$store.geonodeCustomLayerFilter.hasActiveFilters()">filter layer</button>

                <button x-data
                    class="btn btn-secondary btn-sm mt-3 submitFilter"
                    @click="$store.geonodeCustomLayerFilter.clearFilterForm()" 
                    :disabled="$store.geonodeCustomLayerFilter.hasActiveFilters()">clear filter</button>

                </div>
            </div>

          </div>
      </div>
    `,C=()=>{u.store("geonodeCustomLayerFilter",{componentIsActive:!1,currentLayerName:"",currentValueSelect:null,url:"",corsInformation:"",nameSelectOptions:[],allFormValues:{},enabledPlugins:f(),submitFilterForm:function(){const e=this.allFormValues[this.currentFormId];u.store("pluginStatus").registeredPluginNames,this.layer.updateParams({CQL_FILTER:e}),this.enabledPlugins.includes("layerPanel")&&u.store("layerPanel").activeFilters.push(this.currentLayerName)},clearFilterForm:function(){this.allFormValues[this.currentFormId]="",document.querySelector("#"+this.currentFormId).querySelectorAll(".row").forEach(s=>{s.remove()}),this.layer.updateParams({CQL_FILTER:"(1=1)"}),this.enabledPlugins.includes("layerPanel")&&(u.store("layerPanel").activeFilters=u.store("layerPanel").activeFilters.filter(s=>s!==this.currentLayerName))},hasActiveFilters:function(){const e=this.allFormValues[this.currentFormId];return e?e.length==0:!0},visibleAttributes:function(){return this.nameSelectOptions.filter(e=>e.visible).map(e=>e.attribute)},updateaOnNameSelect:function(e){const t=e.value,s=t.trim()!==""&&t.trim()!=="-",o=e.closest(".row"),n=o.querySelector(".operator"),a=o.querySelector(".value");this.currentValueSelect=a,n.disabled=!s,a.disabled=!s,F(t,this.url,this.alternate).then(l=>{this.currentValueSelect.innerHTML="",l.values.forEach(i=>{if(i!==""){const c=document.createElement("option");c.value=i,c.textContent=i,this.currentValueSelect.appendChild(c),this.currentValueSelect.classList.add("updated")}}),this.updateallFormValues()}).catch(l=>console.error("Error:",l))},runCorsTest:async function(){const e=this.url,t=await v(e);console.log("CORS Test Results:",t),this.corsTestpassed=t.postResult.success,this.corsInformation="Server does not support POST requests",this.corsTestpassed&&(this.corsInformation="Test passed")},updateallFormValues:function(){const e=this.currentFormId,t=document.querySelector(`#${e}`),s=document.querySelectorAll(`#${e} .row`);var o=t.getElementsByClassName("or_operator_selector")[0];o=o.checked?" OR ":" AND ";let n="";s.forEach(l=>{const i=l.querySelector(".name"),c=l.querySelector(".operator"),d=l.querySelector(".value"),m=i?i.value:null,p=c?c.value:null,w=d?d.value:null;m&&m.trim()!==""&&m.trim()!=="-"&&p&&w&&(n+=`("${m}"${p}'${w}')${o}`)});const a=o.length;n&&(n=n.slice(0,-a)),this.allFormValues[e]=n},currentFormId:"",handlelayerChange:function(){const e=document.querySelector(".formContent"),t=b(this.currentFormId);document.querySelector("#"+this.currentFormId)?console.log("Form exists for:",this.currentFormId):e.insertAdjacentHTML("beforeend",t)},removeItem:function(e){const t=document.querySelector(`[data-id="${e}"]`);console.log(t),t.remove(),this.updateallFormValues(),this.submitFilterForm(),this.hasActiveFilters()==!0&&this.clearFilterForm()},addItem:function(e){const t=document.querySelector("#"+e),s=t.querySelector(".addItem"),o=document.querySelector("template.formRow");t&&o&&(s.insertAdjacentHTML("beforebegin",o.innerHTML),y.replace())}}),document.addEventListener("filterPushed",function(e){console.debug('Custom event "filterPushed" caught in filterLayer/filterLayer.js');const t=u.store("geonodeCustomLayerFilter"),s=e.detail.instance,o=s.dataset;t.layer=s,t.alternate=o.alternate,t.currentLayerName=s.mapName,t.url=s.getUrl(),t.nameSelectOptions=o.attribute_set,t.currentFormId=h(s.mapName),t.handlelayerChange(),t.componentIsActive=!0,t.runCorsTest()}),g([[x,"#filterOffcanvas"]])};export{C as initialize};
//# sourceMappingURL=geonodeCustomLayerFilter-8550e1bd.js.map
