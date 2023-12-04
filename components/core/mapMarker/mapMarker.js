// import './mapMarker.css'

import { Icon, Style } from 'ol/style';
import { boundingExtent, extend } from 'ol/extent';
import {map, view} from '../mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import feather from 'feather-icons';
import { vector } from '../mapSetup/mapSetup.js';

const createPinStyle = () => {
    // Get the SVG content from Feather Icons
    const svg = feather.icons['map-pin'].toSvg({ 
        class: 'custom-pin', 
        width: 36, 
        height: 36,
        stroke: 'black',
        fill: 'yellow'
    });

    // Convert SVG string to an icon style with an adjusted anchor
    return new Style({
        image: new Icon({
            imgSize: [36, 36],
            anchor: [0.5, 1], // Anchor at the bottom center of the icon
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
        })
    });
};

const convertVhToPixels = (vh) => {
    const numericVh = parseFloat(vh.replace(/vh$/, ''));
    return numericVh * document.documentElement.clientHeight / 100;
}

const createMarkers = (coordinates, fitView = false, moveCenterLeft = false, moveCenterRight = false, bottomPadding) => {

    vector.getSource().clear();
    const pinStyle = createPinStyle();
    let extents = [];

    coordinates.forEach(coord => {
        const marker = new Feature({
            geometry: new Point(coord)
        });
        marker.setStyle(pinStyle);
        vector.getSource().addFeature(marker);
        extents.push(marker.getGeometry().getExtent());
    });

    if (fitView) {
        if (extents.length === 1) {
            const singlePinLocation = coordinates[0];
            let finalCenter = singlePinLocation; 
    
            const currentZoomLevel = view.getZoom()
            if (moveCenterLeft || moveCenterRight) {
                const zoomLevel = currentZoomLevel;
                finalCenter = calculateFinalCenter(map, singlePinLocation, zoomLevel, moveCenterLeft, moveCenterRight);
            }
    
            view.animate({
                center: finalCenter,
                zoom: currentZoomLevel,
                duration: 500
            });
        } else if (extents.length > 1) {
            // Check if bottomPadding is a string and includes 'vh', then convert it
            const attributeTableHeightPx = typeof bottomPadding === 'string' && bottomPadding.includes('vh') 
                                        ? convertVhToPixels(bottomPadding) 
                                        : bottomPadding;   
            bottomPadding = attributeTableHeightPx + 150;                          

            const boundingBox = boundingExtent(extents);
            const padding = [100, 100, bottomPadding, 100];
            view.fit(boundingBox, { padding: padding, duration: 500 });
        }
    }
};


function calculateFinalCenter(map, pinLocation, zoomLevel, moveCenterLeft, moveCenterRight) {
    const size = map.getSize();
    const view = map.getView();
    view.setZoom(zoomLevel); // Temporarily set the zoom level for calculation
    const resolution = view.getResolutionForZoom(zoomLevel);

    const shiftX = size[0] / 4 * resolution;
    const adjustedLocation = moveCenterRight 
        ? [pinLocation[0] - shiftX, pinLocation[1]] 
        : [pinLocation[0] + shiftX, pinLocation[1]];

    view.setZoom(view.getZoom()); // Reset the zoom level to current
    return adjustedLocation;
}




const deleteMarkers = () => {
    vector.getSource().clear();
};

const initialize = async (coordinates) => {
    Alpine.store('mapMarker', {
        markers: coordinates,
        addMarkers: function(fitView = false, moveCenterLeft, moveCenterRight, bottomPadding) {
            createMarkers(this.markers, fitView, moveCenterLeft, moveCenterRight, bottomPadding);
        },
        removeMarkers: function() {
            deleteMarkers();
        }
    });

    // Catch the custom event and execute a function to update the legend
    document.addEventListener('addMapPins', function (event) {
        console.debug('Custom event "addMapPins" caught in mapMarker/mapMarker.js');
        const pin_coordinates = event.detail.pin_coordinates;
        const fitView = event.detail.fitView || false;
        const moveCenterLeft = event.detail.moveCenterLeft || false;
        const moveCenterRight = event.detail.moveCenterRight || false;
        const bottomPadding = event.detail.bottomPadding || 600;

       console.log("Event padding", bottomPadding)

        Alpine.store('mapMarker').markers = pin_coordinates;
        Alpine.store('mapMarker').addMarkers(fitView, moveCenterLeft, moveCenterRight, bottomPadding);
      });


          // Catch the custom event and execute a function to update the legend
    document.addEventListener('deleteMapPins', function (event) {
        console.debug('Custom event "deleteMapPins" caught in mapMarker/mapMarker.js');
        Alpine.store('mapMarker').removeMarkers();
      });


      Alpine.store('pluginStatus').increasePluginLoadingStatus();



};

export { initialize };
