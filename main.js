import './style.css';
import './formSubmit.js';
import './attributeTable.js'

import { handleFeatureInfo } from './featureInfo.js';
import { map } from './mapSetup.js';
import { updateLegend } from './legend.js';
import { wmsSource } from './mapSetup.js';

// Initial legend
const resolution = map.getView().getResolution();
updateLegend(resolution, wmsSource);

// Update the legend when the resolution changes
map.getView().on('change:resolution', function (event) {
  const resolution = event.target.getResolution();
  updateLegend(resolution, wmsSource);
});

map.on('singleclick', handleFeatureInfo);



