import{G as a,m as r,r as d}from"./index-2688a25b.js";const c=()=>{const i=`
    <div 
      id="backgroundSwticher"
      class="position-absolute bottom-0 start-0 ms-2 mb-2 d-flex" 
      x-data="{ showAll: false }"
      data-bs-toggle="tooltip" 
      data-bs-placement="top" 
      title="Choose Background"
    >
      <template x-for="(item, index) in $store.backgroundSwitcher.background" :key="item.id">
        <div 
          class="border m-1" 
          x-show="$store.backgroundSwitcher.shouldShow(index)" 
          x-transition
        >
          <a 
            type="button" 
            class="btn btn-secondary btn-sm p-0 borde border-light border-5 backgroundSwitcher-item"
            :id="item.id" 
            @click="$store.backgroundSwitcher.handleItemClick(item, index)"
          >
            <img class="bgs-img" :src="item.img">
          </a> 
        </div>
      </template>
    </div>
  `;var o=document.getElementById("map");o.insertAdjacentHTML("afterend",i)},m=(i,o)=>{const n=a.map(t=>({id:t.get("id"),img:t.get("img")}));r.store("backgroundSwitcher",{showAll:!1,shouldShow:function(t){return t===0||this.showAll},setBasemap:function(t){a.forEach(e=>{e.setVisible(e.get("id")===t)})},handleItemClick:function(t,e){if(e!==0){console.log(this.background);const s=this.background.indexOf(t);s!==-1&&(this.background.splice(s,1),this.background.unshift(t),this.setBasemap(t.id))}this.showAll=!this.showAll},toggleVisibility:function(){this.showAll=!this.showAll},background:n}),d([[c,"#backgroundSwticher"]])};export{m as initialize};
//# sourceMappingURL=backgroundSwitcher-da22945e.js.map
