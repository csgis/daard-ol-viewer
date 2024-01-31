import{m as a,r as n}from"./index-732974ed.js";import"./feather-becb2378.js";import"./index-c4575d02.js";const r=()=>{let e=`
    <div class="" id="layerPanelContainerStyleBody" x-show="$store.layerPanelContainer.sectionActive == 'layer-style'">
            <div class="offcanvas-body p-3">
                Styles are not implemented yet :()
            </div>
      </div>`;console.log("adding style panel markup to DOM");var t=document.getElementById("layerPanelContainerBody");t.insertAdjacentHTML("beforeend",e)},o=()=>{let e=`
        <button 
        type="button" 
        id="layerPanelNavStyleButton"
        :class="{'bg-light' : $store.layerPanelContainer.sectionActive == 'layer-style',
        ['order-' + $store.layerStyle.buttonDomOrder]: true}"
        class="btn btn-inactive btn-square-md rounded-0 m-0 border-0 shadow-none text-dark d-block"
        @click="$store.layerPanelContainer.setSectionActive('layer-style')"">    
        <i data-feather="pen-tool" class="size-16"></i>
    </button>

    `;var t=document.getElementById("layerPanelContainerNavBar");t.insertAdjacentHTML("beforeend",e)},i=async e=>{a.store("layerStyle",{buttonDomOrder:e}),n([[r,"#layerPanelContainerStyleBody"],[o,"#layerPanelNavStyleButton"]])};export{i as initialize};
//# sourceMappingURL=layerStyle-f2d773d2.js.map
