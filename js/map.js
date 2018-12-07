'use strict';

import {Position} from './model/Position.js';
import {Path} from './model/Path.js';
import {Area} from './model/Area.js';
import {Areas} from './model/Areas.js';
import {PolyArea} from './model/PolyArea.js';

// Import controls
import {CollectionControl} from './controls/collection_control.js';
import {CoordinatesControl} from './controls/coordinates_control.js';
import {LocalCoordinatesControl} from './controls/local_coordinates_control.js';
import {RegionBaseCoordinatesControl} from './controls/region_base_coordinates_control.js';
import {GridControl} from './controls/grid_control.js';
import {LocationLookupControl} from './controls/location_lookup_control.js';
import {MapLabelControl} from './controls/map_label_control.js';
import {PlaneControl} from './controls/plane_control.js';
import {RegionLabelsControl} from './controls/region_labels_control.js';
import {RegionLookupControl} from './controls/region_lookup_control.js';
import {TitleLabel} from './controls/title_label.js';
import {SkyboxControl} from './controls/skybox_control.js'


$(document).ready(function () {
    var map = L.map('map', {
        //maxBounds: L.latLngBounds(L.latLng(-40, -180), L.latLng(85, 153))
        zoomControl: false,
        renderer: L.canvas()
    }).setView([-82, -138], 7);
	window.map=map;
    map.plane = 0;

    map.updateMapPath = function() {
        if (map.tile_layer !== undefined) {
            map.removeLayer(map.tile_layer);
        }
        map.tile_layer = L.tileLayer('https://raw.githubusercontent.com/Explv/osrs_map_full_20180601/master/' + map.plane + '/{z}/{x}/{y}.png', {
            minZoom: 4,
            maxZoom: 11,
            attribution: 'Map data',
            noWrap: true,
            tms: true
        });
        map.tile_layer.addTo(map);
		
		if (map.skybox !== undefined) {
			map.removeLayer(map.skybox);
		}
		var bounds = "bounds 18 39 61 163";
		bounds=bounds.split(" ").slice(1).map(i=>~~i);
		bounds=[bounds.slice(0,2),bounds.slice(2,4)];
		bounds=bounds.map(i=>new Position(i[0]*64, i[1]*64).toLatLng(map));
		map.skybox = L.imageOverlay("skybox_export.png",bounds, {
			opacity:.5,
			interactive:true,
		});
		map.skybox.addTo(map);
		map.skybox.bringToFront();
		
        map.invalidateSize();
    }

    map.updateMapPath();
    map.getContainer().focus();

    map.addControl(new TitleLabel());
    map.addControl(new CoordinatesControl());
    map.addControl(new RegionBaseCoordinatesControl());
    map.addControl(new LocalCoordinatesControl());
    map.addControl(L.control.zoom());
    map.addControl(new PlaneControl());
    map.addControl(new LocationLookupControl());
    map.addControl(new MapLabelControl());
    map.addControl(new CollectionControl());
    map.addControl(new RegionLookupControl());
    map.addControl(new GridControl());
    map.addControl(new RegionLabelsControl());
	map.addControl(new SkyboxControl());
    
    var prevMouseRect, prevMousePos;
    map.on('mousemove', function(e) {
        var mousePos = Position.fromLatLng(map, e.latlng, map.plane);

        if (prevMousePos !== mousePos) {

            prevMousePos = mousePos;

            if (prevMouseRect !== undefined) {
                map.removeLayer(prevMouseRect);
            }

            prevMouseRect = mousePos.toLeaflet(map);
            prevMouseRect.addTo(map);
        }
    });
});
