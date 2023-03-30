require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",

    // Widgets
    "esri/widgets/Home",
    "esri/widgets/Compass"
], function (
    esriConfig,
    Map,
    MapView,
    SceneView,
    FeatureLayer,
    Home,
    Compass
) {
    // AGOL Application API Key
    esriConfig.apiKey = "AAPK28bbd625223944fda166a8e0a8254aefSG3RhDzAVGDPJhKABYkM6niDY74cl7GrhgpmWGBYEyWj_gn0eCiL-0HicgVsUG-s";

    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"
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

    // Splash Modal
    $(document).ready(() => {
       // $("#splash")[0].open = true;
    });
    $(document).ready(function(){

        var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var isPortrait = viewportHeight > viewportWidth;

        $( window ).resize(onresize);

        function onresize() {
            var newViewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var newViewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var hasOrientationChanged = (newViewportHeight > newViewportWidth) != isPortrait;
            var addressbarHeight = 130;

            if (!hasOrientationChanged && (newViewportHeight != viewportHeight)) {
                addressbarHeight = Math.abs(newViewportHeight - viewportHeight);
                if (newViewportHeight < viewportHeight) {
                    // Android Chrome address bar has appeared
                } else {
                    // Android Chrome address bar has disappeared
                }
            } else if(hasOrientationChanged) {
                // Orientation change
            }

            viewportHeight = newViewportHeight;
            viewportWidth = newViewportWidth;
            isPortrait = viewportHeight > viewportWidth;
        }
    });

    function switchView () {
        const is3D = appConfig.activeView.type === "3d";
        const activeViewpoint = appConfig.activeView.viewpoint.clone();
        appConfig.activeView.container = null;

        if (is3D) {
            appConfig.mapView.viewpoint = activeViewpoint;
            appConfig.mapView.container = appConfig.container;
            appConfig.activeView = appConfig.mapView;
        } else {
            appConfig.sceneView.viewpoint = activeViewpoint;
            appConfig.sceneView.container = appConfig.container;
            appConfig.activeView = appConfig.sceneView;
            appConfig.sceneView.map.basemap = "satellite";
        }
    }
})