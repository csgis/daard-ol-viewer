import{m as o,v as n,f as r,r as a}from"./index-64db22cd.js";import"./feather-becb2378.js";const i=()=>{const t=`
        <div class="mx-1" id="myButtonNav" :class="'order-'+$store.myButton.buttonDomOrder">
            <button type="button" 
                class="btn btn-danger btn-sm btn-circle" 
                x-tooltip.placement.left="'Demo button'"
                @click="$store.myButton.rotate()"
                :class="$store.myButton.componentIsActive ? 'bg-danger' : 'btn-light'">
                <i data-feather="minimize" class="size-16"></i>
            </button>
        </div>
        `;var e=document.getElementById("rightMiddleSlot");e.insertAdjacentHTML("beforeend",t)},c=async t=>{o.store("myButton",{componentIsActive:!1,buttonDomOrder:t,rotate:function(){n.animate({center:r([28.9744,41.0128]),zoom:8,duration:1e3})}}),a([[i,"#myButtonNav"]]),console.log("ini mybutton")};export{c as initialize};
//# sourceMappingURL=myButton-5db3baf0.js.map
