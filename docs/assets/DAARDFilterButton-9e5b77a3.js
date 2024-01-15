import{m as t,a as r,e as i,r as a}from"./index-81c1d2af.js";import"./feather-becb2378.js";const l=()=>{const o=`
        <div class="mx-1" id="DAARDFilterButtonNav" :class="'order-'+$store.DAARDFilterButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Filter disease cases'"
                @click="$store.DAARDFilterButton.openFilter()"
                :class="$store.DAARDFilterButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="filter" class="size-16"></i>
            </button>
        </div>
        `;var s=document.getElementById("rightMiddleSlot");s.insertAdjacentHTML("beforeend",o)},m=async o=>{t.store("DAARDFilterButton",{componentIsActive:!1,buttonDomOrder:o,closeComponent:function(){console.log("catched"),this.componentIsActive=!1,t.store("geonodeCustomLayerFilter").componentIsActive=!1},openFilter:function(){this.componentIsActive=!this.componentIsActive;const e=r.getLayers().getArray()[1],n=e.getSource();n.mapName=e.get("name"),n.dataset=e.get("dataset"),this.componentIsActive?i("filterPushed",{instance:n}):t.store("geonodeCustomLayerFilter").componentIsActive=!1}}),document.addEventListener("geonodeCustomLayerFilterClosed",function(e){console.debug('Custom event "geonodeCustomLayerFilterClosed" caught.'),t.store("DAARDFilterButton").closeComponent()}),a([[l,"#DAARDFilterButtonNav"]])};export{m as initialize};
//# sourceMappingURL=DAARDFilterButton-9e5b77a3.js.map
