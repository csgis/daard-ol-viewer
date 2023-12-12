import Alpine from 'alpinejs';
import { getUniqueValues } from './uniqueValues.js';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createForm = async (url, layer) => {
  const filterStore = Alpine.store("filterLayer");
  if (filterStore.attributes[layer]) {
    console.debug(`filter form for ${layer} is already in store`);
    filterStore.currentFilterFormtoShow = layer;
    return;
  }

  const describeFeatureTypeUrl = `${url}?service=WFS&version=2.0.0&request=DescribeFeatureType&typename=${layer}&outputFormat=application/json`;
  console.log(describeFeatureTypeUrl)
  try {
    const response = await fetch(describeFeatureTypeUrl);
    const properties = await response.json();
    console.log(properties)
    // filterStore["attributes"][layer] = properties.featureTypes[0].properties.map(property => property.name);
    filterStore["attributes"][layer] = filterStore['attribute_set'].filter(item => item.visible).map(item => item.attribute);

    console.log("from url it looks like")
    console.log(filterStore["attributes"][layer])

    console.log("from dataset it looks like")
    console.log(filterStore['attribute_set'])

    filterStore.currentFilterFormtoShow = layer;
  } catch (error) {
    console.error(`Error fetching data for ${layer}:`, error);
  }
}

const createOffCanvasMarkup = () => {

  let filterOffcanvas = `
    <div class="position-absolute start-0 top-0 bg-white h-100 w-40 p-3 shadow z-2 overflow-auto" x-transition tabindex="-1" id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel" x-show="$store.filterLayer.componentIsActive">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="filterOffcanvasLabel" x-text="'Filter: ' + $store.filterLayer.mapName">Filter</h5>
        <button type="button" class="btn-close text-reset" @click="$store.filterLayer.componentIsActive = false;"></button>
      </div>

      <div class="offcanvas-body">

            <template x-for="(layerEntry, layerIndex) in Object.entries($store.filterLayer.attributes || {})" :key="layerIndex">
            
              <div :id="layerEntry[0]" x-show="layerEntry[0] == $store.filterLayer.currentFilterFormtoShow">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="or_operator_selector" @click="$store.filterLayer.checkbox_change()">
                    <label class="form-check-label" for="or_operator_selector">AND / OR</label>
                  </div>

                  <hr>

                  <form id="filterForm" @submit.prevent>
                          <div class="row mb-3 mt-3 mx-0" id="filterHeader">
                            <div class="col-1">on</div>
                            <div class="col-3">name</div>
                            <div class="col-3">operator</div>
                            <div class="col-5">value</div>
                          </div>
                          <template x-for="(attribute, attributeIndex) in layerEntry[1]" :key="attributeIndex">
                                <div class="row mb-3">
                                    <div class="col-1">
                                        <div class="form-check">
                                            <input class="form-check-input js-enableselect" type="checkbox" :value="attribute" :id="'filterCheckbox' + layerEntry[0] + attribute" @click="$store.filterLayer.checkbox_change($el)">
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <input type="text" class="form-control form-control-sm" :value="attribute" :id="'input' + layerEntry[0] + attribute" :name="attribute" readonly></input>
                                    </div>
                                    <div class="col-3">
                                        <select class="form-select form-select-sm operators" :id="'operators' + layerEntry[0] + attributeIndex" disabled>
                                            <option value="=">is</option>
                                            <option value="<>">is not</option>
                                        </select>
                                    </div>
                                    <div class="col-5">
                                        <select class="form-select form-select-sm values" :id="'values' + layerEntry[0] + attributeIndex" disabled>
                                        </select>
                                    </div>
                                </div>
                          </template>
                          <button type="input" class="btn btn-secondary btn-sm mt-2 float-end ms-2 clearForm" @click="$store.filterLayer.reset_form(layerEntry[0], $store.filterLayer.mapName)">clear</button>
                          <button type="submit" class="btn btn-secondary btn-sm mt-2 float-end" @click="$store.filterLayer.form_submit(layerEntry[0], $store.filterLayer.mapName)">filter</button>
                  </form>
              </div>

          </template>

      </div>
  </div>`;

  document.getElementById('map').insertAdjacentHTML('afterend', filterOffcanvas);
}


const initialize = () => {

  Alpine.store('filterLayer', {
      componentIsActive: false,
      attributes: {},
      currentFilterFormtoShow: "",
      url: "",
      layername: "",
      mapName: "",
      layer: false,
      activeFilters: [],
      show_filter: function(layer, layername) {
        this.componentIsActive = true;
      },
      form_submit: function (formID, mapName) {
        const form = document.getElementById(formID);
        const enabledFilters = Array.from(form.querySelectorAll('.js-enableselect:checked')).map(checkbox => {
          const row = checkbox.closest('.row');
          return {
            name: row.querySelector('.form-control').value,
            operator: row.querySelector('.operators').value,
            value: row.querySelector('.values').value
          };
        });

        const filterString = enabledFilters.map(filter => `("${filter.name}"${filter.operator}'${filter.value}')`);
        const joinStr = form.querySelector('#or_operator_selector').checked ? ' OR ' : ' AND ';
        const joinedFilters = filterString.join(joinStr);
        console.log("filters: " + joinedFilters)
        this.layer.updateParams({ 'CQL_FILTER': joinedFilters });

        // Update the layerVisibility Store so that icons are marked active
        Alpine.store('layerPanel').activeFilters.push(mapName)
      },

      checkbox_change: function ($el) {
        const checkbox = $el;
        const row = checkbox.closest('.row');
        const operatorsSelect = row.querySelector('.operators');
        const valuesSelect = row.querySelector('.values');
        
        if (checkbox.checked) {
          operatorsSelect.removeAttribute('disabled');
          valuesSelect.removeAttribute('disabled');
          const filterName = row.querySelector('.form-control').value;
          getUniqueValues(row, filterName, valuesSelect, this.url, this.layername);
        } else {
          operatorsSelect.setAttribute('disabled', true);
          valuesSelect.setAttribute('disabled', true);
        }
      },
      reset_form: function (formID, mapName) {
        const formToReset = document.getElementById(formID);
        formToReset.querySelectorAll('.js-enableselect:checked').forEach(checkbox => checkbox.checked = false);
        formToReset.querySelectorAll('.values').forEach(select => select.value = '');
        formToReset.querySelectorAll('.values').forEach(select => select.setAttribute('disabled', true));
        formToReset.querySelectorAll('.operators').forEach(select => select.setAttribute('disabled', true));

        formToReset.querySelector('#or_operator_selector').checked = false;
        this.layer.updateParams({ 'CQL_FILTER': '(1=1)' });

        // Update the layerVisibility Store so that icons are marked non active
        Alpine.store('layerPanel').activeFilters = Alpine.store('layerPanel').activeFilters.filter(function(item) {
          return item !== mapName
        })

      }
    },
  );

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('filterPushed', function (event) {
      console.debug('Custom event "filterPushed" caught in filterLayer/filterLayer.js');

      const url = event.detail.instance.getUrl();
      const layer = event.detail.instance.getParams().LAYERS
      createForm(url, layer);
      
      const filterLayerStore = Alpine.store('filterLayer');
      filterLayerStore.mapName = event.detail.instance.mapName;
      filterLayerStore.show_filter(layer, filterLayerStore.mapName);
      filterLayerStore.layername = layer;
      filterLayerStore.url = url;
      filterLayerStore.dataset = event.detail.instance.dataset;
      filterLayerStore.attribute_set = filterLayerStore.dataset.attribute_set;

      filterLayerStore.layer = event.detail.instance;

      console.warn(filterLayerStore.attribute_set)
    });

  // [function name that creates the DOM Element, Element to check for presence}
  const domElementsToCreate = [
      [createOffCanvasMarkup, '#filterOffcanvas'],
  ]

  // this function tirggers the rendering and tells main.js that initialization is finished
  renderMarkupAndSetPluginReady(domElementsToCreate)

};


export { initialize };