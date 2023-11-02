import { checkboxes } from './checkboxToggle.js';
import { wmsSource } from './mapSetup.js';

document.getElementById('filterForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const enabledFilters = [];
  checkboxes.forEach(function(checkbox, index) {
    const row = checkbox.closest('.row');
    const operatorsSelect = row.querySelector('.operators');
    const valuesSelect = row.querySelector('.values');

    if (checkbox.checked) {
      const filterName = row.querySelector('.form-control').value;
      const operatorValue = operatorsSelect.value;
      const filterValue = valuesSelect.value;

      enabledFilters.push({
        name: filterName,
        operator: operatorValue,
        value: filterValue,
      });
    }
  });

  console.log('Enabled Filters:', enabledFilters);

  const filterString = enabledFilters.map(element => `("${element.name}"${element.operator}'${element.value}')`);
  console.log('Enabled filterString:', filterString);

  const or_selector = document.getElementById('or_operator_selector');
  const join_str = or_selector.checked ? ' OR ' : ' AND ';
  const joinedFilters = filterString.join(join_str);

  console.log('Joined Filters:', joinedFilters);

  wmsSource.updateParams({ 'CQL_FILTER': joinedFilters });
});
