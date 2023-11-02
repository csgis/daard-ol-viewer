import { getUniqueValues } from './uniqueValues.js';

const checkboxes = document.querySelectorAll('.js-enableselect');

checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    const row = this.closest('.row');
    const operatorsSelect = row.querySelector('.operators');
    const valuesSelect = row.querySelector('.values');

    if (this.checked) {
      operatorsSelect.removeAttribute('disabled');
      valuesSelect.removeAttribute('disabled');
      const filterName = row.querySelector('.form-control').value;
      getUniqueValues(row, filterName, valuesSelect); // Populate values for the enabled row
    } else {
      operatorsSelect.setAttribute('disabled', true);
      valuesSelect.setAttribute('disabled', true);
    }
  });
});

export { checkboxes };
