
  const getUniqueValues = function(row, filterName, valuesSelect, baseurl, layername) {
    // if (Alpine.store('filterLayer').currentLayer !== layername) {
    //   valuesSelect.innerHTML = 'loading'; 
    //   Alpine.store('filterLayer').currentLayer = layername;
    // }
  
    fetch(`${baseurl}/wps?service=WPS&outputFormat=json`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "de-DE,de;q=0.5",
        "content-type": "application/xml",
      },
      "referrer": "https://geoserver.dainst.org/catalogue/",
      "body": `
      <wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">gs:PagedUnique</ows:Identifier>
        <wps:DataInputs>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">features</ows:Title>
            <wps:Data />
            <wps:Reference xmlns:xlink="http://www.w3.org/1999/xlink" mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
              <wps:Body>
                <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.0.0">
                  <wfs:Query typeName="${layername}">
                    <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc">
                      <ogc:SortProperty>
                        <ogc:PropertyName>${filterName}</ogc:PropertyName>
                      </ogc:SortProperty>
                    </ogc:SortBy>
                  </wfs:Query>
                </wfs:GetFeature>
              </wps:Body>
            </wps:Reference>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">fieldName</ows:Title>
            <wps:Data>
              <wps:LiteralData>${filterName}</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">maxFeatures</ows:Title>
            <wps:Data>
              <wps:LiteralData>200</wps:LiteralData>
            </wps:Data>
          </wps:Input>
          <wps:Input>
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Identifier>
            <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">startIndex</ows:Title>
            <wps:Data>
              <wps:LiteralData>0</wps:LiteralData>
            </wps:Data>
          </wps:Input>
        </wps:DataInputs>
        <wps:ResponseForm>
          <wps:RawDataOutput mimeType="application/json">
            <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">result</ows:Identifier>
          </wps:RawDataOutput>
        </wps:ResponseForm>
      </wps:Execute>
      `,
      "method": "POST"
    })
    .then(response => response.json())
    .then(data => {
      if (!valuesSelect.classList.contains('updated')) {
        valuesSelect.innerHTML = ''; 
  
        data.values.forEach(value => {
          if (value !== "") {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            valuesSelect.appendChild(option);
            valuesSelect.classList.add('updated');
          }
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  export { getUniqueValues };
  