import Alpine from 'alpinejs';
import autoTable from 'jspdf-autotable'
import feather from 'feather-icons';
import { generateColoredSvg } from '../featureInfoDAARD/bonesSvgGenerator.js';
import jsPDF from 'jspdf'
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createOffCanvasMarkup = () => {

  let compareToolMarkup = `
    <div id="library" class="position-absolute bottom-0 end-0 p-0 bg-white border-top" x-transision style="width: 100%; height: 100vh; z-index:1000"  tabindex="-1" aria-labelledby="libraryLabel" style="width: 100%; height: 100vh" x-show="$store.compareTool.componentIsActive">

        <div class="offcanvas-header" style="height: 4rem">
        
            <!-- left toolbar  -->
            <div x-data class="ms-4 pt-3" style="line-height: 0px;">
                <label class="switch mb-0 ms-3">
                  <input type="checkbox"
                  @click="$store.compareTool.show_table = !$store.compareTool.show_table"
                  :checked="$store.compareTool.show_table">
                  <span class="slider round"></span>
                </label><span class="ms-2 daard-filter_label">show table</span>
            
                <label class="switch ms-3 mb-0">
                  <input type="checkbox"
                  @click="$store.compareTool.show_skull = !$store.compareTool.show_skull"
                  :checked="$store.compareTool.show_skull">
                  <span class="slider round"></span>
                </label><span class="ms-2 daard-filter_label">show skeleton</span>
            
                  <input type="text" class="daard-search border-dark border-1 mb-3 border rounded-pill" placeholder="filter by name" x-model="$store.compareTool.search">


                  
            </div>

                <!-- right hand toolbar -->
                <h5 id="offcanvasRightLabel"></h5>
                <div class="me-3 mt-2" x-data>
                  <button class="btn btn-danger ms-3" @click="$store.compareTool.items.disease_case = []"
                  style="transform: translateY(-3px); background: #c53e4a">remove all</button>
                  <button 
                    class="btn btn-primary ms-1"
                    id="print-pdf" 
                    style="transform: translateY(-3px); background: #397AAB"
                    @click="$store.compareTool.printPDF()">
                    <span id="boot-icon" class="bi bi-file-pdf" style="font-size: 14px; -webkit-text-stroke-width: 0.5px;"></span> print</button>
  
                    <button 
                    type="button" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close"
                    @click="$store.compareTool.componentIsActive=false"
                    class="btn btn-dark ms-1" style="transform: translateY(-3px);">close</button>
                </div>
        </div>

        <div class="offcanvas-body" id="offcanvas-body" x-data>
          <section class="bg-light pt-5 pb-5 shadow-sm ps-4 p4-4" style="overflow: auto; height: 100vh">
            <div class="container-fluid">
              <div class="row">
              <template x-data x-for="(disease, index) in $store.compareTool.search_result()">
                <div class="col-lg-4 mb-3 align-items-stretch d-flex">
                  <div class="card w-100">
                    <div class="card-header d-flex justify-content-between align-items-center bg-white" style="font-size: 1rem">
                      <span x-text="disease.properties.disease" style="font-size: 0.8rem; font-weight: bold"></span>
                      <button type="button" class="btn-close text-reset" @click="$store.compareTool.delete_item_from_disease_case(disease.properties.uuid);"></button>
                    </div>

                    <div class="card-body d-flex flex-column" x-show="$store.compareTool.items.disease_case.length > 0">
                      <table class="table table-stripe" x-show="$store.compareTool.show_table" x-transition>
                          <tbody>
                            <tr style="display: none;">
                              <th>Name</th>
                              <th x-text="disease.properties.disease || '-'"></th>
                            </tr>
                            <tr>
                              <td style="width:180px">Sex</td>
                              <td x-text="disease.properties.sex || '-'"></td>
                            </tr>
                            <tr>
                              <td>Age class</td>
                              <td x-text="disease.properties.age_class || '-'"></td>
                            </tr>
                            <tr>
                              <td>Narrower age</td>
                              <td x-text="disease.properties.age_freetext || '-'"></td>
                            </tr>
                            <tr>
                              <td>Site</td>
                              <td x-text="disease.properties.site || '-'"></td>
                            </tr>
                            <tr>
                              <td>Storage place</td>
                              <td x-text="disease.properties.storage_place || '-'"></td>
                            </tr>
                            <tr>
                              <td>Time period</td>
                              <td x-text="disease.properties.chronology || '-'"></td>
                            </tr>
                            <tr>
                              <td>Narrower time period</td>
                              <td x-text="disease.properties.chronology_freetext || '-'"></td>
                            </tr>
                          </tbody>
                        </table>

                   <div  class="h-100 d-flex align-items-center justify-content-center">
                      <div class="row w-100" x-show="$store.compareTool.show_skull" x-transition>
                        <div class="col-sm-12 col-md-12" x-html="$store.compareTool.svgContent(disease.properties.svgid)"></div>
                        <div class="col-sm-12 col-md-12">
                        <div class="legend col">
                            <div class="rect dark"></div> bone preservation &gt;75% <br>
                            <div class="rect grey"></div> bone preservation &lt;75% <br>
                            <div class="rect pale"></div> affected <br>
                            <div class="rect white"></div>  unknown / absent <br>
                        </div>
                        </div>
                      </div>
                  </template>


                    </div>

            </div>
          </div>
              </template>
            </div>
            </div>
          </section>
      </div>
    </div>
  `;

  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', compareToolMarkup);

}

const createButtonMarkup = () => {
  let compareOffcanvasButtonHtml = `
  <div class="mx-1 order-3">
    <button 
      id="compareToolBtn"
      type="button" 
      class="btn btn-light btn-sm btn-circle" 
      aria-controls="library"
      x-tooltip.placement.left="'Compare Library'"
      @click="$store.compareTool.openCanvas()"
      :class="$store.compareTool.componentIsActive ? 'bg-danger' : 'btn-light'">
      ${feather.icons['grid'].toSvg({ width: '16', height: '16' })}
    </button>
    </div>
  `;
  
  // insert the plugin markup where we need it
  var rightMiddleSlot = document.getElementById('rightMiddleSlot');
  rightMiddleSlot.insertAdjacentHTML('beforeend', compareOffcanvasButtonHtml);
}


  // Helper function to replace strings in bone relations
const replaceInString = (str) => {
  str = '- '+str
  // replace everything between square brackets
  str = str.replace(/\[(.*?)\]/gm, '')
  str = str.replaceAll('; Bone changes:', '')
  str = str.replaceAll('Amount:', '')
  str = str.replaceAll(' ● ', '<br>- ')
  str = str.replaceAll('  ', ' ')

  return str
}


// Update alpine store from button click
const update_compare_items_from_outside = (item_uuid) => {
  event.target.disabled = true;
  disease_case_from_result = Alpine.store("compareTool").find_in_response(
    window.daard_items,
    item_uuid
  );
  Alpine.store("compareTool").update_disease_case_store(
    disease_case_from_result
  );
}


// Print PDF by use of jspdf
const make_compare_pdf = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  var doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Export: daard.dainst.org`, 14, 10);
  doc.text(`Date: ${day}.${month}.${year}`, 14, 16);

  doc.setFontSize(10);
  doc.text(`This PDF shows your current selection of DAARD diseases.`, 14, 25);
  doc.text(`Every disease case will start on a new page`, 14, 30);
  doc.text(`Note: the skull image will not be printed.`, 14, 35);
  var src = document.getElementsByClassName("table-stripe");

  for (let item of src) {
    doc.addPage();
    doc.autoTable({
      html: item,
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 40 }
      },
      includeHiddenHtml: true,
      styles: { cellPadding: 0.5, fontSize: 10, overflow: "linebreak" }
    });
  }

  var pageCount = doc.internal.getNumberOfPages(); //Total Page Number
  for (let i = 0; i < pageCount; i++) {
    doc.setPage(i);
    let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
    doc.setFontSize(10);
    doc.text(
      "page: " + pageCurrent + "/" + pageCount,
      10,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`DAARD_export_${day}-${month}-${year}`);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = (map, view) => {



  Alpine.store('compareTool', {
    componentIsActive: false,
    items: Alpine.$persist({ disease_case: []}),
    show_table : Alpine.$persist(true),
    show_skull : Alpine.$persist(true),
    search: "",
    svgContent: function(value){
      let decoded = decodeURIComponent(value)
      let json_str = JSON.stringify(decoded);
      return generateColoredSvg(decoded);
    },
    openCanvas(){
      this.componentIsActive = !this.componentIsActive ;
    },
    update_disease_case_store(item_uuid){
        let is_uuid_present = this.items.disease_case.find(
          is_uuid_present => is_uuid_present.properties.uuid == item_uuid.properties.uuid
          );
          console.log(is_uuid_present)
        if (is_uuid_present === undefined){
            item_uuid.properties.c_b_t_bc_rel = replaceInString(item_uuid.properties.c_b_t_bc_rel)
            this.items.disease_case.push(item_uuid)
        }
    },
    delete_item_from_disease_case(item_uuid){
        var result = this.items.disease_case.filter(obj => {
        return obj.properties.uuid !== item_uuid
        })
        this.items.disease_case = result
    },
    find_in_response(items, item_uuid){
      let result = items.features.find(obj => {
              return obj.properties.uuid === item_uuid
      })
      return result
    },
    search_result(){
      var result = this.items.disease_case.filter(obj => {
        return obj.properties.disease.toLowerCase().includes(this.search.toLowerCase())
        })

      return result
    },
    printPDF(){
      make_compare_pdf();
    }
  });


  // Catch WFS request
  var elements = [];
  (function() {
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
      this.addEventListener('load', function() {
              response = this.responseText
              window.daard_items = JSON.parse(response);
      });
      origOpen.apply(this, arguments);
  };
  })();


  const domElementsToCreate = [ 
    [createOffCanvasMarkup, '#library'],
    [createButtonMarkup, '#compareToolBtn']
  ]
  renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };
