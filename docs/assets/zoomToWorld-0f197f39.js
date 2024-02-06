import{m as e,v as n,f as r,r as m}from"./index-64db22cd.js";import"./feather-becb2378.js";const a=()=>{const o=`
        <div class="mx-1" id="zoomToWorld" :class="'order-'+$store.zoomToWorld.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Zoom to full world extent'"
                @click="$store.zoomToWorld.zoomTo()"
                :class="$store.zoomToWorld.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="maximize" class="size-16"></i>

            </button>
        </div>
        `;var t=document.getElementById("rightMiddleSlot");t.insertAdjacentHTML("beforeend",o)},s=async o=>{e.store("zoomToWorld",{componentIsActive:!1,buttonDomOrder:o,zoomTo:function(){n.animate({center:r([0,0]),zoom:1,maxZoom:1,duration:300})}}),m([[a,"#zoomToWorld"]])};export{s as initialize};
//# sourceMappingURL=zoomToWorld-0f197f39.js.map
