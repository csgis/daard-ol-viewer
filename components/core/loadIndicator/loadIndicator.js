import Alpine from 'alpinejs';
import { renderMarkupAndSetPluginReady } from '../../core/helper.js'

const createMarkup = () => {
    // define plugin html markup
    const loaderHtml = `
            <div class="d-flex justify-content-center align-items-center" style="height: 100vh" >
                <div class="spinner-border" id="spinner" role="status" x-show="$store.loadIndicator.show">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

    var mapDIV = document.getElementById('map');
    mapDIV.insertAdjacentHTML('afterend', loaderHtml);
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async () => {
    
    Alpine.store('loadIndicator', {
        show: true
    });

    createMarkup();

    document.addEventListener('showLoading', function (event) {
        console.debug('show loading triggered')

        Alpine.store('loadIndicator').show = true;
      });

    document.addEventListener('hideLoading', function (event) {
        console.debug('hide loading triggered')
        Alpine.store('loadIndicator').show = false;
    });

};

export default initialize;
