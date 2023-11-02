import { offcanvas, offcanvasElement } from './offcanvas.js';
import { view, wmsSource } from './mapSetup.js';

const handleFeatureInfo = function(evt) {
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
        const featureList = document.createElement('ul');
        featureList.classList.add('list-group');
        featureList.classList.add('list-group-flush');

        const carouselInner = document.querySelector('.carousel-inner');
        console.log(carouselInner);
        data.features.forEach((feature, index) => {
            const properties = feature.properties;
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            if (index === 0) {
              item.classList.add('active'); // Set the first item as active
            }
          
            const content = document.createElement('div');
            content.classList.add('list-group');
            content.classList.add('list-group-flush');
          
            for (const key in properties) {
  
              if (key == 'bone_relations' || key == 'c_b_t_bc_rel') {
                continue
              }
  
              const listItem = document.createElement('li');
              listItem.classList.add('list-group-item');
              listItem.classList.add('py-0');
              listItem.innerHTML = `<strong>${key}:</strong> ${properties[key]}`;


              content.appendChild(listItem);
            }

            var iframe = document.createElement("IFRAME");
            iframe.classList.add('iframe')
            iframe.src = 'https://geoserver.dainst.org/daard/boneimage?bones=%7B%22%3E75%25%22%3A%20%5B%5D%2C%20%22%3C75%25%22%3A%20%5B%5D%2C%20%22affected%22%3A%20%5B%22166%22%2C%20%22152%22%2C%20%22170%22%2C%20%22167%22%2C%20%22171%22%2C%20%22172%22%2C%20%22164%22%2C%20%22159%22%2C%20%22160%22%2C%20%22200%22%2C%20%22203%22%2C%20%22154%22%2C%20%22155%22%2C%20%22156%22%2C%20%22163%22%2C%20%22157%22%2C%20%22165%22%2C%20%22169%22%2C%20%22168%22%2C%20%22187%22%2C%20%22178%22%2C%20%22191%22%2C%20%22177%22%2C%20%22196%22%2C%20%22198%22%2C%20%22201%22%2C%20%22202%22%2C%20%22153%22%2C%20%22326%22%2C%20%22330%22%2C%20%22248%22%2C%20%22249%22%2C%20%22246%22%2C%20%22250%22%2C%20%22247%22%2C%20%22220%22%2C%20%22224%22%2C%20%22223%22%2C%20%22221%22%2C%20%22222%22%2C%20%22216%22%2C%20%22219%22%2C%20%22214%22%2C%20%22218%22%2C%20%22217%22%2C%20%22213%22%2C%20%22215%22%2C%20%22241%22%2C%20%22239%22%2C%20%22240%22%2C%20%22238%22%2C%20%22237%22%2C%20%22251%22%2C%20%2287%22%2C%20%2288%22%2C%20%22139%22%2C%20%22128%22%2C%20%22113%22%2C%20%22104%22%2C%20%22124%22%2C%20%22122%22%2C%20%22114%22%2C%20%22324%22%2C%20%22127%22%2C%20%22120%22%2C%20%22103%22%2C%20%2298%22%2C%20%22119%22%2C%20%2293%22%2C%20%2296%22%2C%20%22109%22%2C%20%22112%22%2C%20%22132%22%2C%20%22131%22%2C%20%22108%22%2C%20%22140%22%2C%20%22143%22%2C%20%2294%22%2C%20%22147%22%2C%20%2291%22%2C%20%22117%22%2C%20%22111%22%2C%20%22100%22%2C%20%2292%22%2C%20%22118%22%2C%20%2299%22%2C%20%22102%22%2C%20%22121%22%2C%20%22129%22%2C%20%22136%22%2C%20%22141%22%2C%20%22130%22%2C%20%22110%22%2C%20%22105%22%2C%20%22133%22%2C%20%22126%22%2C%20%22142%22%2C%20%22123%22%2C%20%22146%22%2C%20%22115%22%2C%20%22116%22%2C%20%22134%22%2C%20%22323%22%2C%20%22234%22%2C%20%22229%22%2C%20%22230%22%2C%20%22233%22%2C%20%22231%22%2C%20%22232%22%2C%20%22235%22%2C%20%22227%22%2C%20%22228%22%2C%20%22207%22%2C%20%22236%22%2C%20%22225%22%2C%20%22226%22%2C%20%22329%22%2C%20%22242%22%2C%20%22243%22%2C%20%22244%22%2C%20%22245%22%2C%20%22284%22%'

            content.appendChild(iframe);
            item.appendChild(content);
            
            carouselInner.appendChild(item);
          });
        
          if (data.features.length > 0) {
            offcanvas.show(); // Show the offcanvas
          }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
};

export { handleFeatureInfo };
