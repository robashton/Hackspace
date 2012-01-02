define(function(require) {
  
  var $ = require('jquery');
  var _ = require('underscore');
  var Context = require('../../harness/context');
  var Toolbar = require('../../editor/toolbar');
  var MapBuilder = require('../../editor/mapbuilder');
  var Grid = require('../../editor/grid');
  var Eventable = require('../../shared/eventable');
  var Input = require('../../editor/input');
  var Library = require('../../editor/library');
   
  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Editor(canvasElement));  
  }); 
  
  var Editor = function(element) {
    Eventable.call(this);
    this.input = new Input(element);
    this.element = $(element);
    this.currentTool = null;
  };
  
  Editor.prototype = { 
    start: function(context) {
      this.context = context;
      this.toolbar = new Toolbar(this);
      this.library = new Library(this);
      this.initializeMap();
    },
    initializeMap: function() {
      this.map = new MapBuilder(2048, 2048, 128, 128);
      this.context.scenery.loadMap(this.map);
      this.grid = new Grid(this.context.scenery);
      this.context.scene.add(this.grid); 
    },
    cursor: function(value) {
      this.element.css('cursor', value);
    },
    moveViewer: function(x, y) {
      this.context.scene.camera.move(x, y);
    },
    setCurrentTool: function(tool) {
      if(this.currentTool)
        this.currentTool.deactivate();
      this.currentTool = tool;
      this.currentTool.activate();
    }
  };  
  
  _.extend(Editor.prototype, Eventable.prototype);

});
