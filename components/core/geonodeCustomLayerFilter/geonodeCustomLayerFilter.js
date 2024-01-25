import { countEnabledPlugins, getEnabledPluginNames, loadPlugins } from '../../../pluginLoader'
import { emitCustomEvent, renderMarkupAndSetPluginReady } from '../../core/helper.js'

import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { getUniqueValues } from './uniqueValues.js';
import { slugify } from '../../core/helper.js';
import { testCORS } from '../../core/helper/testCors';

const createOffCanvasMarkup = () => {

  let filterOffcanvas = `
    <div 
        class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" 
        x-transition tabindex="-1" 
        id="filterOffcanvas" 
        aria-labelledby="filterOffcanvasLabel"
        x-show="$store.geonodeCustomLayerFilter.componentIsActive">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="filterOffcanvasLabel" x-text="'Filter: ' + $store.geonodeCustomLayerFilter.currentLayerName">Filter</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" @click="$store.geonodeCustomLayerFilter.closeComponent;"></button>
      </div>

      <div class="offcanvas-body">

        <!-- Filter content -->

        <div class="formContent">  </div>
            
            <template class="formRow">
                <div class="row mt-2 gx-1 mx-0" x-id="['filter-select']" :data-id="$id('filter-select')">
                    <div class="col-4">
                        <select class="form-select form-select-sm name" x-on:change="$store.geonodeCustomLayerFilter.updateaOnNameSelect($event.target)">
                            <option value="-" x-text="'select'" class="text-secondary"></option>
                            <template x-for="option in $store.geonodeCustomLayerFilter.visibleAttributes()">
                                <option :value="option" x-text="option"></option>
                            </template>
                        </select>
                    </div>
                    <div class="col-2">
                        <select class="form-select form-select-sm operator" aria-label="Default select example" x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()" disabled>
                            <option value="=">is</option>
                            <option value="<>">is not</option>
                        </select>
                    </div>
                    <div class="col-5">
                        <select class="form-select form-select-sm value" aria-label="Default select example" x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()" disabled>

                        </select>
                    </div>
                    <div class="col-1">
                        <button class="btn btn-light btn-sm" x-tooltip.placement.top="'remove filter'" @click="$store.geonodeCustomLayerFilter.removeItem($id('filter-select'))">
                            <i data-feather="trash-2" class="size-16"></i>
                        </button>
                    </div>
                </div>
            </template>
    
                    <pre x-data x-html="JSON.stringify($store.geonodeCustomLayerFilter.allFormValues)" class="bg-light mt-3 d-none"></pre></div>


            <!-- Filter content -->
        </div>
  </div>`;

  document.getElementById('map').insertAdjacentHTML('afterend', filterOffcanvas);
}

const createFormDom = (id) => {
    return `
      <div class="layerForm" x-id="['operator-input']">
        

          <div id="${id}" x-show="'${id}' == $store.geonodeCustomLayerFilter.currentFormId">

          <p class="alert alert-warning mt-5" x-cloak role="alert" x-text="$store.geonodeCustomLayerFilter.corsInformation" x-show="!$store.geonodeCustomLayerFilter.corsTestpassed"></p>

          <template x-if="$store.geonodeCustomLayerFilter.getLayersOnMap() !== '0 items shown'">
            <div class="my-3"  x-text="$store.geonodeCustomLayerFilter.getLayersOnMap()"></div>
          </template>

            <div x-show="$store.geonodeCustomLayerFilter.corsTestpassed">  
                <div class="form-check form-switch mt-3">
                <input class="form-check-input or_operator_selector" :id="$id('operator-input')" type="checkbox"  x-on:change="$store.geonodeCustomLayerFilter.updateallFormValues()" checked>
                <label class="form-check-label" :for="$id('operator-input')">AND / OR</label>
                </div>

                <div x-data>
                    <button x-data
                    class="btn btn-secondary btn-sm mt-3 addItem"
                    @click="$store.geonodeCustomLayerFilter.addItem('${id}')">add filter</button>

                    <button x-data
                        class="btn btn-secondary btn-sm mt-3 submitFilter"
                        @click="$store.geonodeCustomLayerFilter.submitFilterForm()"
                        :disabled="$store.geonodeCustomLayerFilter.hasActiveFilters()">filter layer</button>

                <button x-data
                    class="btn btn-secondary btn-sm mt-3 submitFilter"
                    @click="$store.geonodeCustomLayerFilter.clearFilterForm()" 
                    :disabled="$store.geonodeCustomLayerFilter.hasActiveFilters()">clear filter</button>

                </div>
            </div>

          </div>
      </div>
    `;
  };




const initialize = () => {

  Alpine.store('geonodeCustomLayerFilter', {
    componentIsActive: false,
    currentLayerName: "",
    currentValueSelect: null,
    url:"",
    corsInformation: "",
    nameSelectOptions: [],
    allFormValues: {},
    layerFeaturesOnMap: {"Daard Database": 0},
    enabledPlugins: getEnabledPluginNames(),
    closeComponent: function (){
      this.componentIsActive = false;
      console.log(this.componentIsActive)
      emitCustomEvent('geonodeCustomLayerFilterClosed', {});
    },
    submitFilterForm: function(){
        const currentFormFilter = this.allFormValues[this.currentFormId];
        const activatedComponents = Alpine.store('pluginStatus').registeredPluginNames;
        this.layer.updateParams({ 'CQL_FILTER': currentFormFilter });
        
        if (this.enabledPlugins.includes('layerPanel')){
          Alpine.store('layerPanel').activeFilters.push(this.currentLayerName);
        }
        emitCustomEvent('geonodeCustomLayerFilterUpdated', {});
    },
    clearFilterForm: function(){
        this.allFormValues[this.currentFormId] = "";
        const template = document.querySelector('#'+this.currentFormId); 
        const contentRows = template.querySelectorAll('.row');

        // Iterate over the NodeList and remove each element
        contentRows.forEach(row => {
            row.remove();
        });

        this.layer.updateParams({ 'CQL_FILTER': '(1=1)' });

        if (this.enabledPlugins.includes('layerPanel')){
          Alpine.store('layerPanel').activeFilters = Alpine.store('layerPanel').activeFilters.filter((item) => {
            return item !== this.currentLayerName;
          });
        }

        emitCustomEvent('geonodeCustomLayerFilterUpdated', {});


    },
    hasActiveFilters: function(){
        const currentFormFilter = this.allFormValues[this.currentFormId];
        if (currentFormFilter){
            return currentFormFilter.length == 0;
        }

        return true;
    },
    visibleAttributes: function() {
       return this.nameSelectOptions.filter(option => option.visible).map(option => option.attribute);
    },
    getLayersOnMap: function() {
      let currentLayerAmount = this.layerFeaturesOnMap[this.currentLayerName]
      return `${currentLayerAmount} items shown`
    },
    updateaOnNameSelect: function(target) {
     const filterName = target.value;
     const hasValue = filterName.trim() !== '' && filterName.trim() !== '-';
     const parentRow = target.closest('.row');
     const operatorSelect = parentRow.querySelector('.operator');
     const valueSelect = parentRow.querySelector('.value');
     this.currentValueSelect = valueSelect;
     
     // Enable or disable the selects based on the input value
     operatorSelect.disabled = !hasValue;
     valueSelect.disabled = !hasValue;

     getUniqueValues(filterName, this.url, this.alternate)
     .then(data => {
        this.currentValueSelect.innerHTML = "";
        data.values.forEach(value => {
            if (value !== "") {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            this.currentValueSelect.appendChild(option);
            this.currentValueSelect.classList.add('updated');
            }
        });

        this.updateallFormValues();

     })
     .catch(error => console.error('Error:', error));

   },
    runCorsTest: async function(){
            const url = this.url; 
            const results = await testCORS(url);
            console.log('CORS Test Results:', results);
            this.corsTestpassed = results['postResult']['success']
            this.corsInformation ="Server does not support POST requests"

            if (this.corsTestpassed ){
                this.corsInformation ="Test passed"
            }
    },
    updateallFormValues: function() {
     const currentFormId = this.currentFormId;
     const currentForm = document.querySelector(`#${currentFormId}`);
     const rows = document.querySelectorAll(`#${currentFormId} .row`);
     var joinStr = currentForm.getElementsByClassName('or_operator_selector')[0];


     joinStr = joinStr.checked ? ' OR ' : ' AND ';
     let concatenatedValues = '';

     rows.forEach(row => {
      const nameElement = row.querySelector('.name');
      const operatorElement = row.querySelector('.operator');
      const valueElement = row.querySelector('.value');
    
      const name = nameElement ? nameElement.value : null;
      const operator = operatorElement ? operatorElement.value : null;
      const value = valueElement ? valueElement.value : null;
    
      const hasNameValue = name && name.trim() !== '' && name.trim() !== '-';
    
      if (hasNameValue && operator && value) {
        concatenatedValues += `("${name}"${operator}'${value}')${joinStr}`;
      }
    });

     const joinStrLength = joinStr.length;

    if (concatenatedValues) {
        // Remove the last join string
        concatenatedValues = concatenatedValues.slice(0, -joinStrLength);
    }

     this.allFormValues[currentFormId] = concatenatedValues;
   },

    currentFormId: "",
    handlelayerChange: function() {
     const content = document.querySelector('.formContent');
     const template = createFormDom(this.currentFormId);
     const form_exists = document.querySelector('#'+this.currentFormId);

     if (!form_exists){
       content.insertAdjacentHTML('beforeend', template);
     } else {
       console.log("Form exists for:", this.currentFormId);
     }
   },

    removeItem: function(id){
      const el = document.querySelector(`[data-id="${id}"]`);
      console.log(el);
      el.remove();
      
      this.updateallFormValues();
      this.submitFilterForm();

      if (this.hasActiveFilters() == true){
        this.clearFilterForm();
      }

    },
    addItem: function(id) {

       const content = document.querySelector('#'+id);
       const btn = content.querySelector('.addItem')
       const template = document.querySelector('template.formRow'); 
       if (content && template) {
         btn.insertAdjacentHTML('beforebegin', template.innerHTML);
         feather.replace();
       }
    }

    });

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('filterPushed', function (event) {
      console.debug('Custom event "filterPushed" caught in filterLayer/filterLayer.js');
      const geonodeCustomLayerFilter = Alpine.store('geonodeCustomLayerFilter');
      
      const layer = event.detail.instance;
      const l_dataset = layer.dataset;

      geonodeCustomLayerFilter.layer = layer;
      geonodeCustomLayerFilter.alternate = l_dataset.alternate;
      geonodeCustomLayerFilter.currentLayerName = layer.mapName;
      geonodeCustomLayerFilter.url = layer.getUrl();
      geonodeCustomLayerFilter.nameSelectOptions = l_dataset.attribute_set;
      geonodeCustomLayerFilter.currentFormId = slugify(layer.mapName);
      geonodeCustomLayerFilter.handlelayerChange();

      geonodeCustomLayerFilter.componentIsActive = true;
      geonodeCustomLayerFilter.runCorsTest();

    });

  // [function name that creates the DOM Element, Element to check for presence}
  const domElementsToCreate = [
      [createOffCanvasMarkup, '#filterOffcanvas'],
  ]

  // this function tirggers the rendering and tells main.js that initialization is finished
  renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };