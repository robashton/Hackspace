define(function(require) {
  
  var $ = require('jquery');
  var Context = require('../../harness/context');
  var Toolbar = require('../../editor/toolbar');
  var MapBuilder = require('../../editor/mapbuilder');
   
  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Editor(canvasElement));  
  }); 
  
  var Editor = function(element) {
    this.element = $(element);
  };
  
  Editor.prototype = {
    start: function(context) {
      this.context = context;
      this.toolbar = new Toolbar(this);
      this.initializeMap();
    },
    cursor: function(value) {
      this.element.css('cursor', value);
    },
    initializeMap: function() {
      this.map = new MapBuilder(2048, 2048, 128, 128);
      this.context.scenery.loadMap(this.map);
    }
  };  

});
