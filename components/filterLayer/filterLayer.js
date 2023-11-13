import Alpine from 'alpinejs';
import feather from 'feather-icons';
import { getUniqueValues } from './uniqueValues.js';
import { wmsSource } from '../core/mapSetup.js';

const createForm = () => {
  let layername = wmsSource.getParams().LAYERS;
  let baseurl = wmsSource.url_;
  const describeFeatureTypeUrl = `${baseurl}?service=WFS&version=2.0.0&request=DescribeFeatureType&typename=${layername}&outputFormat=application/json`;

  fetch(describeFeatureTypeUrl)
    .then(response => response.json())
    .then(properties => {
      const attributes = properties.featureTypes[0].properties.map(property => property.name);
      Alpine.store("filterLayer")["attributes"] = attributes;
    })
    .catch(error => console.error(error));
}


const createOffCanvasMarkup = () => {

  let filterOffcanvas = `
    <div class="offcanvas offcanvas-start" tabindex="-1" id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel"
    style="width: 40%">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="filterOffcanvasLabel">Filter</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="or_operator_selector" @click="$store.filterLayer.checkbox_change()">
        <label class="form-check-label" for="or_operator_selector">AND / OR</label>
      </div>
      <hr>
      <form id="filterForm" @submit.prevent>
        <div class="row mb-3 mt-3" id="filterHeader">
          <div class="col-1">on</div>
          <div class="col-3">name</div>
          <div class="col-3">operator</div>
          <div class="col-5">value</div>
        </div>
        <template x-for="(attribute, index) in $store.filterLayer.attributes" :key="index">
        <div class="row mb-3">
          <div class="col-1">
            <div class="form-check">
              <input class="form-check-input js-enableselect" type="checkbox" value="" :id="'filterCheckbox' + attribute" @click="$store.filterLayer.checkbox_change($el)">
            </div>
          </div>
          <div class="col-3">
            <input type="text" class="form-control form-control-sm" :value="attribute" :id="attribute" :name="attribute" readonly></input>
          </div>
          <div class="col-3">
            <select class="form-select form-select-sm operators" :id="'operators' + index" disabled>
              <option value="=">is</option>
              <option value="<>">is not</option>
            </select>
          </div>
          <div class="col-5">
            <select class="form-select form-select-sm values" :id="'values' + index" disabled>
            </select>
          </div>
        </div>
      </template>
        <button type="input" class="btn btn-secondary btn-sm mt-2 float-end ms-2 clearForm" @click="$store.filterLayer.reset_form()">clear</button>
        <button type="submit" class="btn btn-secondary btn-sm mt-2 float-end" @click="$store.filterLayer.form_submit()">filter</button>
      </form>
    </div>
  </div>`;

  var mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', filterOffcanvas);

}

const createButtonMarkup = () => {
  let filterFormButtonHtml = `
  <div class="mx-1  order-4">
  <button 
    type="button" 
    class="btn btn-danger btn-sm btn-circle" 
    data-bs-toggle="tooltip" 
    data-bs-placement="left" 
    title="Filter Layer"
    @click="$store.filterLayer.show_filter()"
    :class="$store.filterLayer.buttonIsActive ? 'bg-danger' : 'btn-light'"
    aria-controls="filterOffcanvas">
      ${feather.icons['filter'].toSvg({ width: '16', height: '16' })}
    </button>
    </div>
  `;
  
  // insert the plugin markup where we need it
  var specialMarkupContainer = document.getElementById('specialMarkupContainer');
  specialMarkupContainer.insertAdjacentHTML('beforeend', filterFormButtonHtml);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = () => {

  createButtonMarkup()
  createOffCanvasMarkup()


  Alpine.store('filterLayer', {
    buttonIsActive: false,
    attributes: [],
    show_filter: function() {
      this.buttonIsActive = true;
      console.log(this.buttonIsActive);
      createForm();
      var offcanvasElement = document.getElementById('filterOffcanvas');
      var offcanvas = new bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    },
    form_submit: function () {

      const enabledFilters = [];
      const checkboxes = document.querySelectorAll('.js-enableselect:checked');

      checkboxes.forEach(function (checkbox, index) {
        const row = checkbox.closest('.row');
        const operatorsSelect = row.querySelector('.operators');
        const valuesSelect = row.querySelector('.values');

        const filterName = row.querySelector('.form-control').value;
        const operatorValue = operatorsSelect.value;
        const filterValue = valuesSelect.value;

        enabledFilters.push({
          name: filterName,
          operator: operatorValue,
          value: filterValue,
        });
      });

      const filterString = enabledFilters.map(element => `("${element.name}"${element.operator}'${element.value}')`);
      const or_selector = document.getElementById('or_operator_selector');
      const join_str = or_selector.checked ? ' OR ' : ' AND ';
      const joinedFilters = filterString.join(join_str);

      wmsSource.updateParams({ 'CQL_FILTER': joinedFilters });

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
        getUniqueValues(row, filterName, valuesSelect);
      } else {
        operatorsSelect.setAttribute('disabled', true);
        valuesSelect.setAttribute('disabled', true);
      }
    },
    reset_form: function () {
      const checkboxes = document.querySelectorAll('.js-enableselect:checked');

      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
        const row = checkbox.closest('.row');
        const valuesSelect = row.querySelector('.values');
        valuesSelect.value = '';
      });

      const or_selector = document.getElementById('or_operator_selector');
      or_selector.checked = false;
      let filter_string = `(1=1)`
      console.log(filter_string)

      wmsSource.updateParams({ 'CQL_FILTER': filter_string });
    }
  },
  );

  // Listen to Bootstrap Offcanvas hide event
  document.getElementById('filterOffcanvas').addEventListener('hide.bs.offcanvas', function () {
    const filterLayerStore = Alpine.store('filterLayer');
    filterLayerStore.buttonIsActive = false;
    console.log(filterLayerStore.buttonIsActive);
  });

  // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  //   return new bootstrap.Tooltip(tooltipTriggerEl)
  // })

  Alpine.store('pluginStatus').increasePluginLoadingStatus();



};


export { initialize };