require(["esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/widgets/Popup",
    "dojo/domReady!"], function (
        Map,
        MapView,
        TileLayer,
        MapImageLayer,
        FeatureLayer,
        Legend,
        LayerList,
        Search,
        Locator,
        Popup,
        ) {

    //my code starts here

      

 //   var myMap = new Map(mapConfig);

        var myMap = new Map({
          //  basemap: 'satellite'
        });
        var mapView = new MapView({
        map: myMap,
        container: "viewDiv",
        center: [-118.2438934, 34.058481],
        zoom: 12,
        basemap: 'streets'
    });
    var fwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#FFAA00",
        width: 10,
        style: "solid"
    };
    // Symbol for U.S. Highways
    var hwySym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#DF73FF",
        width: 7,
        style: "solid"
    };
    // Symbol for other major highways
    var otherSym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#EBEBEB",
        width: 3,
        style: "short-dot"
    };
    var hwyRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        defaultSymbol: otherSym,
        defaultLabel: "Other major roads",
        field: "CLASS",
        uniqueValueInfos: [
            { value: "I", symbol: fwySym, label:'Interstates' },
            { value: "U", symbol: hwySym, label:'US Highways' }]

    };

    hwyRenderer.legendOptions = {
        title: 'Classification (high/low)'
    }

    var template = { // autocasts as new PopupTemplate()
        title: "USA Major Highways",
        content: "<p>This is Highway, <b>{ROUTE_NUM}</b> which has a length of {DIST_MILES} miles.</p>",
    };

    var baseMapLayer = new TileLayer({
        url: "https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer"
    });
        // Add layer to map
    myMap.add(baseMapLayer);

    var layer = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer"
    });
    myMap.add(layer);  // adds the layer to the map

    var myFeatureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
        renderer: hwyRenderer
    });
    myMap.add(myFeatureLayer);

    var legend = new Legend({
        view: mapView,
        layerInfos: [{ layer: myFeatureLayer, title: 'My Highway Layer' }]
    });
    mapView.ui.add(legend, "bottom-left");

    var layerList = new LayerList({
        view: mapView
    });
    // Adds widget below other elements in the top left corner of the view
    mapView.ui.add(layerList, {
        position: "top-left"
    });
    
    var searchWidget = new Search({
        view: mapView,
        sources: [{
            locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
            singleLineFieldName: "SingleLine",
            name: "Custom Geocoding Service",
            localSearchOptions: {
                minScale: 300000,
                distance: 50000
            },
            placeholder: "Search Geocoder",
            maxResults: 3,
            maxSuggestions: 6,
            suggestionsEnabled: false,
            minSuggestCharacters: 0
        }, {
            featureLayer: myFeatureLayer,
            searchFields: ["ROUTE_NUM"],
            displayField: "ROUTE_NUM",
            exactMatch: false,
            outFields: ["*"],
            name: "My Custom Search",
            placeholder: "example: C18",
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            minSuggestCharacters: 0
        }]
    });
        // Adds the search widget below other elements in
        // the top right corner of the view
    mapView.ui.add(searchWidget, {
        position: "top-right",
        index: 2
    });

    //my code ends here
});