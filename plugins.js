const pluginsConfig = {
  "plugins": [
    {
      "name": "myButton",
      "component": () => import("./components/debug/myButton/myButton.js"),
      "enabled": true,
      "buttonDomOrder": 2
    },
    {
      "name": "zoomToWorld",
      "component": () => import("./components/core/zoomToWorld/zoomToWorld.js"),
      "enabled": true,
      "buttonDomOrder": 5
    },
    {
      "name": "layerPanelContainer",
      "component": () => import("./components/core/layerPanelContainer/layerPanelContainer.js"),
      "enabled": true,
      "buttonDomOrder": 1,
      "createsParentDOM": true
    },
    {
      "name": "mapSourceWarning",
      "component": () => import("./components/contrib/mapSourceWarning/mapSourceWarning.js"),
      "enabled": false,
      "buttonDomOrder": 2
    },
    {
      "name": "DAARDFilterButton",
      "component": () => import("./components/contrib/DAARDFilterButton/DAARDFilterButton.js"),
      "enabled": true,
      "buttonDomOrder": 8
    },
    {
      "name": "legend",
      "component": () => import("./components/legend/legend.js"),
      "enabled": true,
      "buttonDomOrder": 2
    },
    {
      "name": "aboutLayer",
      "component": () => import("./components/core/aboutLayer/aboutLayer.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "filterLayer",
      "component": () => import("./components/core/filterLayer/filterLayer.js"),
      "enabled": false,
      "buttonDomOrder": false
    },
    {
      "name": "geonodeCustomLayerFilter",
      "component": () => import("./components/core/geonodeCustomLayerFilter/geonodeCustomLayerFilter.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "attributeTable",
      "component": () => import("./components/core/attributeTable/attributeTable.js"),
      "enabled": true,
      "buttonDomOrder": 3
    },
    {
      "name": "compareTool",
      "component": () => import("./components/contrib/compareTool/compareTool.js"),
      "enabled": true,
      "buttonDomOrder": 4
    },
    {
      "name": "featureInfo",
      "component": () => import("./components/core/featureInfo/featureInfo.js"),
      "enabled": false,
      "buttonDomOrder": false
    },
    {
      "name": "featureInfo",
      "component": () => import("./components/contrib/featureInfoDAARD/featureInfo.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "mapMarker",
      "component": () => import("./components/core/mapMarker/mapMarker.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "backgroundSwitcher",
      "component": () => import("./components/core/backgroundSwitcher/backgroundSwitcher.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "layerPanel",
      "component": () => import("./components/core/layerPanel/layerPanel.js"),
      "enabled": true,
      "buttonDomOrder": 1,
      "dependsOn": "layerPanelContainer"
    },
    {
      "name": "layerStyle",
      "component": () => import("./components/core/layerStyle/layerStyle.js"),
      "enabled": true,
      "buttonDomOrder": 2,
      "dependsOn": "layerPanelContainer"
    },
    {
      "name": "debug",
      "component": () => import("./components/debug/catchEvents.js"),
      "enabled": true,
      "buttonDomOrder": false
    },
    {
      "name": "afterMarkupFinish",
      "component": () => import("./components/core/afterMarkupFinish/afterMarkupFinish.js"),
      "enabled": true,
      "buttonDomOrder": false
    }
  ]
}

export {pluginsConfig}