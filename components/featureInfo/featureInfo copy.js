import { spinner_hide, spinner_show } from '../spinner.js';
import { view, wmsSource } from '../mapSetup.js';

import Alpine from 'alpinejs';

const createFeatureInfoOffCanvasMarkup = () => {
  const featureInfoOffcanvas = `
    <div id="featureInfoOffcanvas" class="offcanvas offcanvas-end" tabindex="-1" aria-labelledby="featuresOffcanvasLabel" style="width: 50%">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="featuresOffcanvasLabel">Found Cases 5</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body featureInfoContainer"></div>
    </div>
  `;

  const mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', featureInfoOffcanvas);
};

const update_compare_items_from_outside = (item_uuid) => {
  event.target.disabled = true;
  const disease_case_from_result = Alpine.store("compareTool").find_in_response(
    window.daard_items,
    item_uuid
  );
  Alpine.store("compareTool").update_disease_case_store(disease_case_from_result);
};

const createFeatureListItem = (key, value) => {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'py-0');
  listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
  return listItem;
};

const createButton = (properties) => {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-secondary', 'btn-sm', 'w-50');
  button.textContent = 'Add to compare tool';
  button.addEventListener('click', function () {
    update_compare_items_from_outside(properties['uuid']);
  });
  return button;
};

const handleFeatureInfo = (evt) => {
  spinner_show();
  const viewResolution = view.getResolution();
  const url = wmsSource.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'application/json'}
  );
  if (url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const featureInfoContainerInner = document.querySelector('.featureInfoContainer');
        featureInfoContainerInner.innerHTML = '';

        window.daard_items = data;

        data.features.forEach((feature, index) => {
          const properties = feature.properties;
          const content = document.createElement('div');

          for (const key in properties) {
            if (key == 'bone_relations' || key == 'c_b_t_bc_rel' || key == 'svgid') {
              continue;
            }

            const listItem = createFeatureListItem(key, properties[key]);
            content.appendChild(listItem);
          }

          const button = createButton(properties);
          content.appendChild(button);

          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item', 'py-0');
          listItem.appendChild(content);

          featureInfoContainerInner.appendChild(listItem);
        });

        let offcanvasElement = document.getElementById('featureInfoOffcanvas');
        let featureInfoOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

        if (data.features.length > 0) {
          featureInfoOffcanvas.show();
        }

        spinner_hide();
      })
      .catch((error) => {
        console.error('Error:', error);
        spinner_hide();
      });
  }
};

const initialize = (map, view) => {
  createFeatureInfoOffCanvasMarkup();
  Alpine.store('featureInfo', {});
  map.on('singleclick', handleFeatureInfo);
};

export { initialize };
