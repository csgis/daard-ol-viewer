import{m as a,r as o}from"./index-6eadefd0.js";import"./feather-becb2378.js";const i=()=>{const e=`
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 ps-0 pt-0 shadow bg-light" 
        z-index="2000" 
        id="layerPanelContainer" 
        x-show="$store.layerPanelContainer.componentIsActive" x-transition>

        <div class="row">
            <!-- Navigation -->
            <div class="col-1 bg-secondary vh-100 p-0 pt-21 d-flex flex-column" id="layerPanelContainerNavBar"></div>

            <!-- Content -->
            <div class="col-11 vh-100 p-0 border-0 overflow-hidden">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="layerPanelEditBodyLabel">&nbsp;</h5>
                    <button type="button" class="btn-close text-reset me-3 mt-3" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.layerPanelContainer.componentIsActive = false"></button>
                </div>
                <div class="offcanvas-body p-3 overflow-auto h-100" id="layerPanelContainerBody">
                </div>
            </div>
        </div>

    </div>
        `;var t=document.getElementById("map");t.insertAdjacentHTML("afterend",e),console.log("adding container markup to DOM")},l=()=>{const e=`
        <div x-data="{ get layerPanelContainer() { return $store.layerPanelContainer; } }" class="mx-1" :class="'order-'+layerPanelContainer.buttonDomOrder" id="layerPanelContainerButton">
            <button type="button" 
            class="btn btn-danger btn-sm btn-circle" 
            x-tooltip.placement.left="'Map Layer'"
            @click="layerPanelContainer.componentIsActive = !layerPanelContainer. componentIsActive"
            :class="layerPanelContainer.componentIsActive ? 'bg-danger' : 'btn-light'">
            <i data-feather="layers" class="size-16"></i>
            </button>
          </div>
    `;document.getElementById("rightMiddleSlot").insertAdjacentHTML("beforeend",e)},c=async e=>{a.store("layerPanelContainer",{componentIsActive:!1,buttonDomOrder:e,sectionActive:"layer-edit",setSectionActive:function(n){this.sectionActive=n,console.log(this.sectionActive)}}),o([[i,"#layerPanelContainer"],[l,"#layerPanelContainerButton"]]),console.log("init layerPanelContainerMarkup")};export{c as initialize};
//# sourceMappingURL=layerPanelContainer-047b0391.js.map
