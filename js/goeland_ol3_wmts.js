/*global ol*/
/*jshint
 expr: true
 */

/**
 * allow to initialize base map rendreing inside a given div id
 * @param {string} str_map_id  the div id to use ro render the map
 * @param {array} position  [x,y] position of the center of the map
 * @param {number} zoom_level
 * @return {ol.Map} an OpenLayers Map object
 */
function init_map(str_map_id, position, zoom_level) {
    'use strict';
    var base_wmts_url = 'https://map.lausanne.ch/tiles'; //valid on internet
    var RESOLUTIONS = [50, 20, 10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];

    /**
     * Allow to retrieve a valid OpenLayers WMTS source object
     * @param {string} layer  the name of the WMTS layer
     * @param {object} options
     * @return {ol.source.WMTS} a valid OpenLayers WMTS source
     */
    function wmtsLausanneSource(layer, options) {
        var resolutions = RESOLUTIONS;
        if (Array.isArray(options.resolutions)) {
            resolutions = options.resolutions;
        }
        var tileGrid = new ol.tilegrid.WMTS({
            origin: [420000, 350000],
            resolutions: resolutions,
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
        var extension = options.format || 'png';
        var timestamp = options.timestamps;
        var url = base_wmts_url + '/1.0.0/{Layer}/default/' + timestamp +
            '/swissgrid_05/{TileMatrix}/{TileRow}/{TileCol}.' + extension;
        url = url.replace('http:', location.protocol);
        //noinspection ES6ModulesDependencies
        return new ol.source.WMTS(/** @type {olx.source.WMTSOptions} */{
            //crossOrigin: 'anonymous',
            attributions: [new ol.Attribution({
                html: '&copy;<a ' +
                "href='http://www.lausanne.ch/cadastre>Cadastre'>" +
                'SCC Lausanne</a>'
            })],
            url: url,
            tileGrid: tileGrid,
            layer: layer,
            requestEncoding: 'REST'
        });
    }


    function init_wmts_layers() {
        var array_wmts = [];
        array_wmts.push(new ol.layer.Tile({
            title: 'Plan ville couleur',
            type: 'base',
            visible: true,
            source: wmtsLausanneSource('fonds_geo_osm_bdcad_couleur', {
                timestamps: [2015],
                format: 'png'
            })
        }));
        array_wmts.push(new ol.layer.Tile({
            title: 'Plan cadastral (gris)',
            type: 'base',
            visible: false,
            source: wmtsLausanneSource('fonds_geo_osm_bdcad_gris', {
                timestamps: [2015],
                format: 'png'
            })
        }));
        array_wmts.push(new ol.layer.Tile({
            title: 'Orthophoto 2012',
            type: 'base',
            visible: false,
            source: wmtsLausanneSource('orthophotos_ortho_lidar_2012', {
                timestamps: [2012],
                format: 'png'
            })
        }));
        array_wmts.push(new ol.layer.Tile({
            title: 'Carte Nationale',
            type: 'base',
            visible: false,
            source: wmtsLausanneSource('fonds_geo_carte_nationale_msgroup', {
                timestamps: [2014],
                format: 'png'
            })
        }));
        return array_wmts;
    }
    var MAX_EXTENT_LIDAR = [532500, 149000, 545625, 161000]; // lidar 2012
    var swissProjection = new ol.proj.Projection({
        code: 'EPSG:21781',
        extent: MAX_EXTENT_LIDAR,
        units: 'm'
    });
    var vdl_wmts = init_wmts_layers();

    var my_view = new ol.View({
        projection: swissProjection,
        center: position,
        zoom: zoom_level,
        minZoom: 1,
        maxZoom: 10,
        extent: MAX_EXTENT_LIDAR
    });
    var mouse_position_control = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(2),
        projection: 'EPSG:21781'
    });
    return new ol.Map({
        target: str_map_id,
        controls: [
            new ol.control.Zoom(),
            mouse_position_control,
            new ol.control.Rotate(),
            new ol.control.ZoomSlider(),
            new ol.control.ScaleLine()
        ],
        layers: vdl_wmts,
        view: my_view
    });
}
