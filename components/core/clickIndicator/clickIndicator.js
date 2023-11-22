import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {basemapLayers, map, source, vector} from '../mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {easeOut} from 'ol/easing.js';
import {getVectorContext} from 'ol/render.js';
import {unByKey} from 'ol/Observable.js';

const duration = 2000;

const addClickIndicator = (evt, flash_times = 1) =>{
    if (!evt.coordinate) {
        return; 
    }

    const coordinate = evt.coordinate;
    const geom = new Point([coordinate[0], coordinate[1]]);
    const feature = new Feature(geom);

    // Set the style with transparency
    feature.setStyle(new Style({
        image: new CircleStyle({
            radius: 5, 
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0)' 
            }),
            stroke: new Stroke({
                color: 'rgba(255, 255, 255, 0)',
                width: 1
            })
        })
    }));

    source.addFeature(feature);

    flash(feature, flash_times); 
}



const flash = (feature, flash_times) => {
    let flash_counter = 0;

    let start = Date.now(); 

    let flashGeom = feature.getGeometry().clone(); 

    function animate(event) {
        const frameState = event ? event.frameState : false;
        if (!frameState || !frameState.time) {
            return; 
        }

        const elapsed = frameState.time - start;

        if (elapsed >= duration) {
            start = Date.now(); 
            flashGeom = feature.getGeometry().clone(); 

            if (flash_counter < flash_times) {
                flash_counter++;
                setTimeout(animate, 0);
            } else {
                unByKey(listenerKey);
            }
        }

        const vectorContext = getVectorContext(event);
        const elapsedRatio = elapsed / duration;
        const radius = easeOut(elapsedRatio) * 25 + 5;
        const opacity = easeOut(1 - elapsedRatio);

        const style = new Style({
            image: new CircleStyle({
                radius: radius,
                stroke: new Stroke({
                    color: 'rgba(255, 0, 0, ' + opacity + ')',
                    width: 0.25 + opacity,
                }),
            }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        map.render();
    }

    const active_layer = basemapLayers.find(layer => layer.getVisible());
    const listenerKey = vector.on('postrender', animate);

}


// Initialize the plugin
const initialize = () => {
    // if (map) {
    //     map.on('singleclick', addClickIndicator);
    // }
    Alpine.store('pluginStatus').increasePluginLoadingStatus();


};

export { initialize, addClickIndicator };
