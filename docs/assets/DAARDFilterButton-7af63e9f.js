import{m as o,a as r,e as a,r as i}from"./index-05542e30.js";import"./feather-becb2378.js";const l=()=>{const n=`
        <div class="mx-1" id="DAARDFilterButtonNav" :class="'order-'+$store.DAARDFilterButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Filter disease cases'"
                @click="$store.DAARDFilterButton.openFilter()"
                :class="$store.DAARDFilterButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="filter" class="size-16"></i>
            </button>
        </div>
        `;var s=document.getElementById("rightMiddleSlot");s.insertAdjacentHTML("beforeend",n)},m=async n=>{o.store("DAARDFilterButton",{componentIsActive:!1,buttonDomOrder:n,closeComponent:function(){console.log("catched"),this.componentIsActive=!1,o.store("geonodeCustomLayerFilter").componentIsActive=!1},openFilter:function(){this.componentIsActive=!this.componentIsActive,console.log("group is"),console.log(r.getLayers());const t=r.getLayers().getArray()[0],e=t.getSource();e.mapName=t.get("name"),e.dataset=t.get("dataset"),this.componentIsActive?(a("filterPushed",{instance:e}),console.log("source is",e.mapName,e.dataset)):o.store("geonodeCustomLayerFilter").componentIsActive=!1}}),document.addEventListener("geonodeCustomLayerFilterClosed",function(t){console.debug('Custom event "geonodeCustomLayerFilterClosed" caught.'),o.store("DAARDFilterButton").closeComponent()}),i([[l,"#DAARDFilterButtonNav"]])};export{m as initialize};
//# sourceMappingURL=DAARDFilterButton-7af63e9f.js.map
