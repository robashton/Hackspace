define(function(require) {
  
  var $ = require('jquery');
  var _ = require('underscore');
  var Context = require('../../harness/context');
  var MapBuilder = require('../../editor/mapbuilder');
  var Grid = require('../../editor/grid');
  var Eventable = require('../../shared/eventable');
  var Input = require('../../editor/input');
  var Library = require('../../editor/library');
  var Toolbar = require('../../editor/toolbar');
  var TopBar = require('../../editor/topbar');
  
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
      this.topbar = new TopBar(this);
      this.initializeMap();
    },
    initializeMap: function() {

      var mapResource = this.context.resources.get('/main/world.json');      
      this.map = new MapBuilder(mapResource.get(), this.library);
      this.context.scene.add(this.map);
      this.map.initializeEditables(); // TODO: This is probably temporary and an anti-pattern and everything else ;-)

      this.grid = new Grid(this.map);
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
    },
    executeCommand: function(command) {
      command.execute(this);
    }
  };  
  
  _.extend(Editor.prototype, Eventable.prototype);

});
