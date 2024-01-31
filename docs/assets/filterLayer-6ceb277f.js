import{m as l,r as w}from"./index-732974ed.js";const u=function(n,t,s,r,e){fetch(`${r}/wps?service=WPS&outputFormat=json`,{headers:{accept:"application/json","accept-language":"de-DE,de;q=0.5","content-type":"application/xml"},referrer:"https://geoserver.dainst.org/catalogue/",body:`
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
                  <wfs:Query typeName="${e}">
                    <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc">
                      <ogc:SortProperty>
                        <ogc:PropertyName>${t}</ogc:PropertyName>
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
              <wps:LiteralData>${t}</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Title>
            <wps:Data>
              <wps:LiteralData>200</wps:LiteralData>
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
      `,method:"POST"}).then(o=>o.json()).then(o=>{s.classList.contains("updated")||(s.innerHTML="",o.values.forEach(a=>{if(a!==""){const i=document.createElement("option");i.value=a,i.textContent=a,s.appendChild(i),s.classList.add("updated")}}))}).catch(o=>{console.error("Error:",o)})},d=async(n,t)=>{const s=l.store("filterLayer");if(s.attributes[t]){console.debug(`filter form for ${t} is already in store`),s.currentFilterFormtoShow=t;return}const r=`${n}?service=WFS&version=2.0.0&request=DescribeFeatureType&typename=${t}&outputFormat=application/json`;console.log(r);try{const o=await(await fetch(r)).json();console.log(o),s.attributes[t]=s.attribute_set.filter(a=>a.visible).map(a=>a.attribute),console.log("from url it looks like"),console.log(s.attributes[t]),console.log("from dataset it looks like"),console.log(s.attribute_set),s.currentFilterFormtoShow=t}catch(e){console.error(`Error fetching data for ${t}:`,e)}},m=()=>{let n=`
    <div class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" x-transition tabindex="-1" id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel" x-show="$store.filterLayer.componentIsActive">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="filterOffcanvasLabel" x-text="'Filter: ' + $store.filterLayer.mapName">Filter</h5>
        <button type="button" class="btn-close text-reset" @click="$store.filterLayer.componentIsActive = false;"></button>
      </div>

      <div class="offcanvas-body">

            <template x-for="(layerEntry, layerIndex) in Object.entries($store.filterLayer.attributes || {})" :key="layerIndex">
            
              <div :id="layerEntry[0]" x-show="layerEntry[0] == $store.filterLayer.currentFilterFormtoShow">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="or_operator_selector" @click="$store.filterLayer.checkbox_change()">
                    <label class="form-check-label" for="or_operator_selector">AND / OR</label>
                  </div>

                  <hr>

                  <form id="filterForm" @submit.prevent>
                          <div class="row mb-3 mt-3 mx-0" id="filterHeader">
                            <div class="col-1">on</div>
                            <div class="col-3">name</div>
                            <div class="col-3">operator</div>
                            <div class="col-5">value</div>
                          </div>
                          <template x-for="(attribute, attributeIndex) in layerEntry[1]" :key="attributeIndex">
                                <div class="row mb-3">
                                    <div class="col-1">
                                        <div class="form-check">
                                            <input class="form-check-input js-enableselect" type="checkbox" :value="attribute" :id="'filterCheckbox' + layerEntry[0] + attribute" @click="$store.filterLayer.checkbox_change($el)">
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <input type="text" class="form-control form-control-sm" :value="attribute" :id="'input' + layerEntry[0] + attribute" :name="attribute" readonly></input>
                                    </div>
                                    <div class="col-3">
                                        <select class="form-select form-select-sm operators" :id="'operators' + layerEntry[0] + attributeIndex" disabled>
                                            <option value="=">is</option>
                                            <option value="<>">is not</option>
                                        </select>
                                    </div>
                                    <div class="col-5">
                                        <select class="form-select form-select-sm values" :id="'values' + layerEntry[0] + attributeIndex" disabled>
                                        </select>
                                    </div>
                                </div>
                          </template>
                          <button type="input" class="btn btn-secondary btn-sm mt-2 float-end ms-2 clearForm" @click="$store.filterLayer.reset_form(layerEntry[0], $store.filterLayer.mapName)">clear</button>
                          <button type="submit" class="btn btn-secondary btn-sm mt-2 float-end" @click="$store.filterLayer.form_submit(layerEntry[0], $store.filterLayer.mapName)">filter</button>
                  </form>
              </div>

          </template>

      </div>
  </div>`;document.getElementById("map").insertAdjacentHTML("afterend",n)},y=()=>{l.store("filterLayer",{componentIsActive:!1,attributes:{},currentFilterFormtoShow:"",url:"",layername:"",mapName:"",layer:!1,activeFilters:[],show_filter:function(t,s){this.componentIsActive=!0},form_submit:function(t,s){const r=document.getElementById(t),o=Array.from(r.querySelectorAll(".js-enableselect:checked")).map(c=>{const p=c.closest(".row");return{name:p.querySelector(".form-control").value,operator:p.querySelector(".operators").value,value:p.querySelector(".values").value}}).map(c=>`("${c.name}"${c.operator}'${c.value}')`),a=r.querySelector("#or_operator_selector").checked?" OR ":" AND ",i=o.join(a);console.log("filters: "+i),this.layer.updateParams({CQL_FILTER:i}),l.store("layerPanel").activeFilters.push(s)},checkbox_change:function(t){const s=t,r=s.closest(".row"),e=r.querySelector(".operators"),o=r.querySelector(".values");if(s.checked){e.removeAttribute("disabled"),o.removeAttribute("disabled");const a=r.querySelector(".form-control").value;u(r,a,o,this.url,this.layername)}else e.setAttribute("disabled",!0),o.setAttribute("disabled",!0)},reset_form:function(t,s){const r=document.getElementById(t);r.querySelectorAll(".js-enableselect:checked").forEach(e=>e.checked=!1),r.querySelectorAll(".values").forEach(e=>e.value=""),r.querySelectorAll(".values").forEach(e=>e.setAttribute("disabled",!0)),r.querySelectorAll(".operators").forEach(e=>e.setAttribute("disabled",!0)),r.querySelector("#or_operator_selector").checked=!1,this.layer.updateParams({CQL_FILTER:"(1=1)"}),l.store("layerPanel").activeFilters=l.store("layerPanel").activeFilters.filter(function(e){return e!==s})}}),document.addEventListener("filterPushed",function(t){console.debug('Custom event "filterPushed" caught in filterLayer/filterLayer.js');const s=t.detail.instance.getUrl(),r=t.detail.instance.getParams().LAYERS;d(s,r);const e=l.store("filterLayer");e.mapName=t.detail.instance.mapName,e.show_filter(r,e.mapName),e.layername=r,e.url=s,e.dataset=t.detail.instance.dataset,e.attribute_set=e.dataset.attribute_set,e.layer=t.detail.instance,console.warn(e.attribute_set)}),w([[m,"#filterOffcanvas"]])};export{y as initialize};
//# sourceMappingURL=filterLayer-6ceb277f.js.map
