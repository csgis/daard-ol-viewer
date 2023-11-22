import { map, view, wmsSource } from '../core/mapSetup/mapSetup.js';
import { spinner_hide, spinner_show } from '../spinner.js';

import Alpine from 'alpinejs';
import { addClickIndicator } from '../clickIndicator/clickIndicator.js';

const createFeatureInfoOffCanvasMarkup = () => {
  const featureInfoOffcanvas = `
    <div id="featureInfoOffcanvas" class="offcanvas offcanvas-end" tabindex="-1" aria-labelledby="featuresOffcanvasLabel" style="width: 50%">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="featuresOffcanvasLabel">
          <span x-text="$store.featureInfoStore.currentFeatureIndex+1"></span> of <span x-text="$store.featureInfoStore.features.length"></span></h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <template x-if="$store.featureInfoStore.currentFeature">
          <div class="offcanvas-body featureInfoContainer">
            <table class="table table-sm table-striped">
              <tbody>
                <tr>
                  <td colspan="2">
                  <div class="row">
                    <div class="col">
                      <button 
                        class="btn btn-secondary btn-sm" 
                        @click="$store.featureInfoStore.showPrevious()"
                        x-show="$store.featureInfoStore.features.length > 1"
                        x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == 0"
                        >Previous</button>
                      <button
                        class="btn btn-secondary btn-sm"
                        @click="$store.featureInfoStore.showNext()" 
                        x-show="$store.featureInfoStore.features.length > 1"
                        x-bind:disabled="$store.featureInfoStore.currentFeatureIndex == $store.featureInfoStore.features.length-1"
                        >Next</button>
                    </div>
                    <div class="col">
                    <button class="btn btn-secondary btn-sm" @click="addToCompareTool($store.featureInfoStore.currentFeature.properties.uuid)">
                      Add to compare tool
                    </button>
                    </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><h4 class="mt-2" x-text="$store.featureInfoStore.currentFeature.properties.disease"></h4></td>
                </tr>
                <template x-for="(value, key) in $store.featureInfoStore.currentFeature.properties" :key="key">
                  <template x-if="value !== null && $store.featureInfoStore.shouldShowKey(key)">
                  <tr>
                  <td><strong x-text="key"></strong></td>
                    <td><span x-html="value"></span></td>
                  </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
      </template>
    </div>
  `;

  const mapDIV = document.getElementById('map');
  mapDIV.insertAdjacentHTML('afterend', featureInfoOffcanvas);
};


// Initialize the plugin
const initialize = () => {

  const handleFeatureInfo = (evt) => {
    spinner_show();
    const viewResolution = view.getResolution();
    const url = wmsSource.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      'EPSG:3857',
      {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 200}
    );

    if (url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {

          let featuresMoreThanOne = data.features.length > 0;
          
          if (featuresMoreThanOne)
            addClickIndicator(evt, 2);

          Alpine.store('featureInfoStore')['features'] = data.features;
          Alpine.store('featureInfoStore')['currentFeatureIndex'] = 0; // Reset to the first feature
          let offcanvasElement = document.getElementById('featureInfoOffcanvas');
          let featureInfoOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

          if (featuresMoreThanOne) {
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

  Alpine.store('featureInfoStore', {
    features: [],
    currentFeatureIndex: 0,
    get currentFeature() {
      return this.features[this.currentFeatureIndex] || null;
    },
    shouldShowKey(key, value) {
      return !['bone_relations', 'c_b_t_bc_rel', 'svgid', 'disease', 'svgid'].includes(key);
    },
    addToCompareTool(uuid) {
      console.log('Add to compare tool:', uuid);
    },
    showNext() {
      this.currentFeatureIndex = (this.currentFeatureIndex + 1) % this.features.length;
    },
    showPrevious() {
      this.currentFeatureIndex = (this.currentFeatureIndex - 1 + this.features.length) % this.features.length;
    }
  });

  createFeatureInfoOffCanvasMarkup();

  Alpine.nextTick(() => {
    map.on('singleclick', handleFeatureInfo);
  });

  Alpine.store('pluginStatus').increasePluginLoadingStatus();

};

export { initialize };
