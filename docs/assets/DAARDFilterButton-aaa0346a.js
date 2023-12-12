import{m as n,a,e as s,r as i}from"./index-c18e8515.js";import"./feather-becb2378.js";const l=()=>{const t=`
        <div class="mx-1" id="DAARDFilterButtonNav" :class="'order-'+$store.DAARDFilterButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Filter disease cases'"
                @click="$store.DAARDFilterButton.openFilter()"
                :class="$store.DAARDFilterButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="filter" class="size-16"></i>
            </button>
        </div>
        `;var r=document.getElementById("rightMiddleSlot");r.insertAdjacentHTML("beforeend",t)},u=async t=>{n.store("DAARDFilterButton",{componentIsActive:!1,buttonDomOrder:t,openFilter:function(){const e=a.getLayers().getArray()[1],o=e.getSource();o.mapName=e.get("name"),o.dataset=e.get("dataset"),s("filterPushed",{instance:o})}}),i([[l,"#DAARDFilterButtonNav"]])};export{u as initialize};
//# sourceMappingURL=DAARDFilterButton-aaa0346a.js.map
