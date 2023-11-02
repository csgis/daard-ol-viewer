
const updateLegend = function(resolution, wmsSource) {
    console.log(wmsSource);

    const graphicUrl = wmsSource.getLegendUrl(resolution);
    const img = document.getElementById('legend');
    img.src = graphicUrl;
  };
  
  export { updateLegend };
  