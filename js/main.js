require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",

    // Widgets
    "esri/widgets/Home",
    "esri/widgets/Compass",
    "esri/widgets/BasemapGallery",
    "esri/widgets/LayerList"
], function (
    esriConfig,
    Map,
    MapView,
    SceneView,
    FeatureLayer,
    Home,
    Compass,
    BasemapGallery,
    LayerList
) {
    // AGOL Application API Key
    esriConfig.apiKey = "AAPK28bbd625223944fda166a8e0a8254aefSG3RhDzAVGDPJhKABYkM6niDY74cl7GrhgpmWGBYEyWj_gn0eCiL-0HicgVsUG-s";

    const expLyr = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Explore/FeatureServer/0"
    });

    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [expLyr]
    });
    const mapView = new MapView({
        container: "map-panel",
        map: map,
        zoom: 12,
        center: [-112.064013, 33.335013]
    });
    const sceneView = new SceneView({
        map: map
    });

    const appConfig = {
        mapView: mapView,
        sceneView: sceneView,
        activeView: null,
        container: "map-panel"
    };
    appConfig.activeView = appConfig.mapView;

    // UI Widgets
    const mapHome = new Home({
        view: mapView
    });
    const sceneHome = new Home({
        view: sceneView
    });
    mapView.ui.add({
        component: mapHome,
        position: "top-left",
        index: 0
    });
    sceneView.ui.add({
        component: sceneHome,
        position: "top-left",
        index: 0
    });
    const compass = new Compass({
        view: mapView
    });
    mapView.ui.add({
        component: compass,
        position: "top-left",
        index: 2
    });
    const basemapGallery2D = new BasemapGallery({
        view: mapView,
        selectionEnabled: true,
        container: "basemaps-2d"
    });
    const basemapGallery3D = new BasemapGallery({
        view: sceneView,
        selectionEnabled: true,
        container: "basemaps-3d"
    });

    // Splash Modal
    $(document).ready(() => {
       $("#splash")[0].open = true;
    });

    $("#splash-btn").on("click", (e) => {
        $("#splash")[0].open = false;
    });

    // Information Modal
    $("#info-btn").on("click", (e) => {
        $("#info")[0].open = true;
    });

    // Form Modal
    $("#contribute").on("click", (e) => {
        $("#form")[0].open = true;
    });

    // Get User Location
    $("#location").on("click", (e) => {
        navigator.geolocation.getCurrentPosition(locSuccess, locError)
    });

    // Successful Position
    const locSuccess = (position) => {
        $("#latitude").val(position.coords.latitude);
        $("#longitude").val(position.coords.longitude);
    };

    // Position Error
    const locError = (error) => {
        $("#location-alert")[0].open = true;
    };

    // Form Submit
    $("#submit").on("click", (e) => {
        validateForm()
    });

    // Viewer
    $("#view2d").on("click", () => {
        switchView();
    });
    $("#view3d").on("click", () => {
        switchView();
    });

    // Basemaps
    $("#basemaps").on("click", (e) => {
        openGallery();
    });

    function openGallery () {
        if (appConfig.activeView.type === "3d") {
            $("#basemaps-3d")[0].hidden === false ? $("#basemaps-3d")[0].hidden = true : $("#basemaps-3d")[0].hidden = false;
        } else if (appConfig.activeView.type === "2d") {
            $("#basemaps-2d")[0].hidden === false ? $("#basemaps-2d")[0].hidden = true : $("#basemaps-2d")[0].hidden = false;
        }
    }

    function switchView () {
        if ($("#basemaps-2d")[0].hidden === false || $("#basemaps-3d")[0].hidden === false) {
            $("#basemaps-2d")[0].hidden = true;
            $("#basemaps-3d")[0].hidden = true;
        }
        const is3D = appConfig.activeView.type === "3d";
        const activeViewpoint = appConfig.activeView.viewpoint.clone();
        appConfig.activeView.container = null;

        if (is3D) {
            appConfig.mapView.viewpoint = activeViewpoint;
            appConfig.mapView.container = appConfig.container;
            appConfig.activeView = appConfig.mapView;

            $("#view3d")[0].hidden = false;
            $("#view2d")[0].hidden = true;

        } else {
            appConfig.sceneView.viewpoint = activeViewpoint;
            appConfig.sceneView.container = appConfig.container;
            appConfig.activeView = appConfig.sceneView;

            $("#view3d")[0].hidden = true;
            $("#view2d")[0].hidden = false;
        }
    }

    function validateForm () {
        try {
            const lat = $("#latitude").val();
            const lon = $("#longitude").val();
            const img = $("#img-upload")[0].value;
            const exp = $("#exp-type")[0].selectedItem.value;
            const items = [lat,lon,img,exp];
            for (const i of items) {
                if (i === "") {
                    throw 500;
                }
            }
            // send items to database

            // close and clear form
            $("#form")[0].open = false;
            $("#latitude").val("");
            $("#longitude").val("");
            $("#img-upload").val("");
            $("#scenery")[0].checked = false;
            $("#wildlife")[0].checked = false;
        } catch (error) {
            $("#form-alert")[0].open = true;
        }

    }
});