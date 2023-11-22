const updateJsonWithFetchData = (jsonDefinition) => {
    console.debug("1. Running function to update json definition for geonode")
  
    // Create an array of fetch promises
    const fetchPromises = jsonDefinition.map((layerDef) => {
      if (layerDef.type === 'geonode') {
        return fetch(`${layerDef.url}api/v2/datasets/${layerDef.id}`)
          .then((response) => response.json())
          .then((data) => {
            // Return merged layer definition
            console.debug("- loading data for ", data.dataset.alternate);
            return { ...layerDef, ...data, 
                     url: `${layerDef.url}gs/wms`,
                     dataset: data.dataset,
                     params: {
                       LAYERS: data.dataset.alternate,
                       TILED: true
                     }};
          })
          .catch((error) => {
            console.error(`Error fetching data for layer ID ${layerDef.id}:`, error);
            return layerDef; // Return original definition in case of an error
          });
      } else {
        return Promise.resolve(layerDef); // Non-geonode layer, return as is
      }
    });
  
    // Wait for all promises to resolve and maintain order
    return Promise.all(fetchPromises).then((updatedLayers) => {
      console.debug("2. Following promises finished updating json ", updatedLayers);
      return updatedLayers; // This maintains the original order
    });
  }
  

export {updateJsonWithFetchData};