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
    "esri/widgets/LayerList",
    "esri/widgets/Popup"
], function (
    esriConfig,
    Map,
    MapView,
    SceneView,
    FeatureLayer,
    Home,
    Compass,
    BasemapGallery,
    LayerList,
    Popup
) {
    // AGOL Application API Key
    esriConfig.apiKey = "AAPK28bbd625223944fda166a8e0a8254aefSG3RhDzAVGDPJhKABYkM6niDY74cl7GrhgpmWGBYEyWj_gn0eCiL-0HicgVsUG-s";

    const expPopup = {
        title: "Explore",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "Exp_Type",
                        label: "Experience"
                    },
                    {
                        fieldName: "Description",
                        label: "Description"
                    },
                    {
                        fieldName: "Latitude",
                        label: "Latitude"
                    },
                    {
                        fieldName: "Longitude",
                        label: "Longitude"
                    },
                ]
            },
            {
                type: "attachments"
            }
        ]
    };
    const expSymbol = {
        type: "unique-value",
        field: "Exp_Type",
        uniqueValueInfos: [
            {
                value: "wildlife",
                symbol: {
                    type: "picture-marker",
                    url: "data:image/png;base64,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",
                    height: "20px",
                    width: "20px"
                }
            },
            {
                value: "scenery",
                symbol: {
                    type: "picture-marker",
                    url: "data:image/png;base64,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",
                    height: "20px",
                    width: "20px"
                }
            }
        ]
    };
    const expLyr = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Explore/FeatureServer/0",
        renderer: expSymbol,
        elevationInfo: "on-the-ground"
    });
    expLyr.popupTemplate = expPopup;

    const trailheadsPopup = {
        title: "{Name}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "name",
                        label: "Name"
                    },
                    {
                        fieldName: "description",
                        label: "Description"
                    },
                    {
                        fieldName: "hours",
                        label: "Parking/Entrance Hours"
                    }
                ]
            }
        ]
    };
    const trailheadsSymbol = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB5CAYAAADyOOV3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NjY5OTBGRjZDM0QxMUU0QTM3RThDNzNCRDk3QTcyQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NjY5OTEwMDZDM0QxMUU0QTM3RThDNzNCRDk3QTcyQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU2Njk5MEZENkMzRDExRTRBMzdFOEM3M0JEOTdBNzJBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU2Njk5MEZFNkMzRDExRTRBMzdFOEM3M0JEOTdBNzJBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+CCHG+QAACjJJREFUeF7tnQtVJDEQRVcCEpCABCQgAQlIwAESkIAEJCABCUiYzctnSNdUd5LKp5Jh7jmvD2c36an0I//08O90Ot10xXKX6+Pe6NHr2eh1R/i/kA55roprMPjBKBj4afRthALVCPfAvcIvAD5jSVY0GLXsxejD6McoNqan8Fn4THz2MjV9FYNRg96MWtTOVkIsiGnq2j2zwXdGqC0zmbonxIhYEfNUzGgwasS7UfwAVxJin6ZWz2QwRrEY2MQPa2WhLCiTKjMYjN/2azKWCmVTq9GaBqO/WrkpLhXKOryP1jIYA5KRU5xZhDKj7MMYbTDmj9fcHOcKz2DIXHqkwVgR+ou1dk94FngmXRlh8F/ra0vVtW/ubTBGj19GcYFuuhSeUZeRdk+DMQe8Ncn5wrNqPm/uZTD6ljj4m/LVtF/uYfDN3Ho1M7m1wTdz26mJyS0NXsrcu7u70+vr6+n7+9sU/5efn5/T+/v76f7+ns03WNUmmyL5Sx1Lmfvw8GCNTIFfAC7/YFWZbIrhL3Ku0tzA29sbe5/BEptsiuAvMjB3W2YqhGaZNsk5PD4+svcbKDxj0TzZhO8v5WD1Zal57svLizWslK+vL/Z+g4VnXbziZcL3l3KW2zSAUVLQtHP3HCw88yJM6P5SBo6Txh+8hGp4fn5m76kgPPtsTOj+kg+W0+IPXEY1TDKiDspe0jSh+0se6ANWOOXIqobJDIYHWf2xCd1f8sA54PiDhgiLDi0WHkqmR5QJRtJU8CKJCd1f0gxvmjGt+fz8tA8YYIqDeal0wIMVKgn4xUAs3D2VlWyqTfj+kmb4vu6RIRKzUQslTLLYwQmeHGLC95djcFAsvvEQ5TapMDu3j4RZJeDek9beoMNDfKYI/rKPyoLG09OTfcAl5Na03KYav2CTzH+PdLgAYorhL/uozHml/SV3L05Y1TpqIfD5k9fcWLtzY1MUf+FRqb2QdMTL3SsIfTCa8iDUTrQU8b/B+Em2Cku0W4vtI3HPhUWl9uLBSzhaM95rETBKX6AZzhFbi00R/YVHpfaWDoQCqH3c/XKa+4mWIqWCVxeYovnLJWr7vJItPcA1rSU7SFdg8sW+sSmWv1yicp65ZfMMw0v68kVGzUe62G0yxfKXLXhvJs44TC2bZ8lIHCYvNHrmtHnnyRTJX7aorDlD0uaZ1jzUXiloDRY2ebNGbYrjL1tUdoykpuCXgt6rpO/l+Pj4uLjnIoJ3Z0xR/OUXnP2JMwyT1BRuBavm9EYATTy97yI6n98yxfCXX9SaZ6kpLZtnyqIj63MzbYrgL7+ojJ5nap4pWO2inzG5zrtMJnx/cWC5K044TLM1zzGLTp/s0qUJ318cT0ZxomGSmkJPWrRsnmNyp08Tjb7h5YXBKv0vHooEPHR6L/SZ2iAubFzQ2AbL9sMmHH9xqJx1lprCjXIxvSkFeWBKa5RNtqtaJgx/ccQJhkliCqCDH2lLgP4Vam0y18IM1sZglfmvdvMcj8J7mKw8OMPCvvnJGaxyoF27eaaj8JYmT1CDccrQ/OQMVtncb9U8QxJjMOqm92ll8gQDrVcThvnJGawygo7PPZdApyOSQ3qYmsX3iFVjMvJNYC6ErTnzkzNYZQQt2dJDrW9xH26LUSLKRHNh1B7zk6LBeBilixzc+nCr5lkiCpdGSRuDVdagg2Babn9Ma4jkjQV0DfE9akTh0igJNcf85AyO/0NV6E/R5HK1klt7lpwC4VoBqShcGi3ZcFxMfAJtBbNRu/dMkZwCadlPUrg0WrLhuJj4BLMLo91SuEFajShcGi3ZcFxMfILZpd08QxQujZZsOC4mPsHskmwztp7GULg0WrLhuJj4BDNLuvfLLXPWiMKl0ZINx8XEJ5hZNUdzWi1yQBQujZZsOC4m3XmwRLVHc1r1xRQujZI282CVlSypWh3NabGdR+HSKEl/qVKqVicnsZhSazKFS6OkjcFq56Elkm4zcmChpGZkTeHSKGmzm6SyHywRzGgN+nOpyRQujZI2+8HLfEUhBkc9kE6fKFwaJW1OdKi9k1Sq3OYZTW/pL4PEZAqXRkmbM1kg/s9plUuYBpWaXDp9onBplOS8dTFZph9J5x7Noe8s9TSZwqVRELy8MHj6kTSa0By4laoSk0umTxQujYLYNxvU3k3KVc7RHKTZGxGXHKbLPfVB4dIoiH03Se3twhzlNs+pE40lJnP5qShcGgWxbxeCadekc9aej2pvrFyTubxUFC7NYO2+Hwym7IdzN/ZLziPD5BRcPioKl2awbP8LbDgupjPTzYdzB0e5tTdWCi4PFYVLM1iH39EBpvm7DCX9peRtghRcHioKl2agkt+yA6ZoplEbc/d8JbUXSsHloaJwaQbq3DwDG46LacMUzXTunBdI3wVKweWhonBpBurcPAMbjovpAtXRdOl+r/Q1lBRcHioKl2aQzqPngA3HxXSB2rfN5oxuY7i3HXKVgstDReHSDFLRt82C4d8XjX40d1AF0Edz98lVCi4PFYVLM0DF3xcNhh8CKHlfWDqwipWCy0NF4dIMkOgb37HcNawWl7ylAHPRlHP3KVEKLg8VhUvTWfDILk1SbDgupl2G1OLSN/RL92z3lILLQ0Xh0nQWW3uBDcfFtEv3WowRcEm/WzOookrB5aGicGk6arf2AhuOi+mQbn/5rGQxA/R+M5DC5aGicGk6qvovnwW6LF+WLGbUnHzcUwouDxWFS9NJm2VJDhuOiylJ81OXvU5YlCgFl4eKwqXppKZ/fRS8G8UfIFbpYkavv9+bgstDReHSdBC8SGLDcTFl0WTAhWa25GsXWr4JSJWCy0NF4dI01uHAKsaG42LKprqpLul3JeeUS5SCy0NF4dI0VrJpDthwXExFVG0n5lK7DJmjFFweKgqXpqE224EpbDgupmLEu005tFiGzFEKLg8VhUvTSBe7RSlsOC6mYsT9cYpeI2ZOKbg8VBQuTQNl97sxNhwXkwhsLhebnHq3qNUyZI5ScHkUhGe82cjPxRbBlUNM8b7x0dLkSHOho1U0+vqLoi72eXMxxfCXOopNRv+KEXIwGg+611z3SEffc4kNEC7PYInNBaYY/lJPscmzCEbG8/Lw2imXdrCqzAWmOP7Shm6bEn9Q1eaC1gaDZWvyRGpiLuhhMLiZLFczc0EvgwGW00Tz5D8qPKvsJchcehoMMHdTPV+9iPCMRPPcFL0NBlh9+TCKC3TTr/BsileochlhcAAj7FuT/Ss8i8PjNi0YaTC4NdlO3ZpkymiDA3+1Ng+ptTFaBoN7o2ZHgBYQyooyD0XT4ACmBkt9022hULbm059cZjA4cG1GqxobmMngAB7Kyk03Ylc3NjCjwQH0V3jnZprvCzkQYkSsw/vYFDMbHIMpBQ6bzWQ2YkFMQ6Y7UlYxOAYPFFMNjf4an4nPntrUmBUNpgTDUZtgQIv5Ne6Be+Ge2N1ZxlDKNRi8B0zBYAdC/3ikkG5ZI/c4G3zTter07z8M34EQRmPCKQAAAABJRU5ErkJggg==",
            height: "20px",
            width: "20px"
        }
    }
    const trailheadsLyr = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SouthMountain/FeatureServer/0",
        elevationInfo: "on-the-ground",
        renderer: trailheadsSymbol
    });
    trailheadsLyr.popupTemplate = trailheadsPopup;

    const trailsPopup = {
        title: "{Name}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "name",
                        label: "Name"
                    },
                    {
                        fieldName: "difficulty",
                        label: "Difficulty"
                    },
                    {
                        fieldName: "distance",
                        label: "Distance (miles)"
                    },
                    {
                        fieldName: "elevation_change",
                        label: "Elevation Change (ft)"
                    },
                    {
                        fieldName: "hours",
                        label: "Trail Hours"
                    },
                    {
                        fieldName: "description",
                        label: "Description"
                    }
                ]
            }
        ]
    };
    const trailsSymbol = {
        type: "unique-value",
        field: "difficulty",
        uniqueValueInfos: [
            {
                value: "Easy",
                symbol: {
                    type: "simple-line",
                    color: "green",
                    width: "3px",
                    style: "solid"
                }
            },
            {
                value: "Moderate",
                symbol: {
                    type: "simple-line",
                    color: "yellow",
                    width: "3px",
                    style: "solid"
                }
            },
            {
                value: "Moderate/Difficult",
                symbol: {
                    type: "simple-line",
                    color: "orange",
                    width: "3px",
                    style: "solid"
                }
            },
            {
                value: "Difficult",
                symbol: {
                    type: "simple-line",
                    color: "red",
                    width: "3px",
                    style: "solid"
                }
            }
        ]
    };
    const trailsLyr = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/SouthMountain/FeatureServer/1",
        elevationInfo: "on-the-ground",
        renderer: trailsSymbol
    });
    trailsLyr.popupTemplate = trailsPopup;

    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [trailsLyr, expLyr, trailheadsLyr]
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

    mapView.popup.dockEnabled = true;
    mapView.popup.dockOptions = {
        breakpoint: {
            width: 600,
            height: 1000
        },
        position: "top-center"
    };

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
    const layerList2D = new LayerList({
        view: mapView,
        container: "layers-2d",
        visible: false
    });
    const layerList3D = new LayerList({
        view: sceneView,
        container: "layers-3d",
        visible: false
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

    // Layers
    $("#layers").on("click", (e) => {
        openLayerList();
    });

    function openLayerList () {
        if (appConfig.activeView.type === "3d") {
            layerList3D.visible === false ? layerList3D.visible = true : layerList3D.visible = false;
        } else if (appConfig.activeView.type === "2d") {
            layerList2D.visible === false ? layerList2D.visible = true : layerList2D.visible = false;
        }
    }

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