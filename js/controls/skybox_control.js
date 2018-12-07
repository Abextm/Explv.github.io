'use strict';

import {Position} from '../model/Position.js';

export var SkyboxControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {

        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.id = 'skybox-container';
        container.style.height = 'auto';
        L.DomEvent.disableClickPropagation(container);

        var coordinatesForm = L.DomUtil.create('form', 'leaflet-bar leaflet-control leaflet-control-custom form-inline', container);
        
        var formGroup = L.DomUtil.create('div', 'form-group', coordinatesForm);
        
		this._set = () => map.skybox.setOpacity(Number.parseFloat(this._opacity.value));
        this._opacity = this._createInput("opacity", "opacity", formGroup);
		this._opacity.value = map.skybox.options.opacity;

        return container;
    },

    _createInput: function(id, title, container, keyupFunc) {
        var coordInput = L.DomUtil.create('input', 'form-control coord', container);
        coordInput.type = 'text';
        coordInput.id = id;

        L.DomEvent.disableClickPropagation(coordInput);
        L.DomEvent.on(coordInput, 'keyup', this._set, this);
		coordInput.addEventListener('wheel', ev=>{
			ev.preventDefault();
			ev.stopPropagation();
			this._opacity.value = Number.parseFloat(this._opacity.value)+(ev.deltaY/25);
			this._set();
			return false;
		});

        return coordInput;
    },
});