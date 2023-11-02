const popupElement = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');

import Overlay from 'ol/Overlay';

const popup = new ol.Overlay({
  element: popupElement,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

popupCloser.onclick = function () {
  popup.setPosition(undefined);
  popupCloser.blur();
  return false;
};

map.addOverlay(popup);

map.on('click', function (event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    const properties = feature.getProperties();
    let content = '<h2>Attributes</h2><ul>';
    for (const key in properties) {
      if (key !== 'geometry') {
        content += `<li><strong>${key}:</strong> ${properties[key]}</li>`;
      }
    }
    content += '</ul>';
    popupContent.innerHTML = content;
    popup.setPosition(event.coordinate);
  } else {
    popup.setPosition(undefined);
  }
});
