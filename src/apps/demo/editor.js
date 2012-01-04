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
      var tileCountWidth = 2048 / 128;
      var tileCountHeight = 2048 / 128;
      
      var mapData = {
        width: 2048,
        height: 2048,
        tilewidth: 128,
        tileheight: 128,
        tilecountwidth: tileCountWidth,
        tilecountheight: tileCountHeight,
        templates: {
          tree: {
            id: "tree",
            width: 25,
            height: 25,
            texture: "/main/tree.png"  
          }
        },
        tiledata: new Array(tileCountWidth * tileCountHeight)
      };
      for(var i = 0 ; i < mapData.tiledata.length; i++) {
        mapData.tiledata[i] = [];
      }
      
      this.map = new MapBuilder(mapData);
      this.context.scene.add(this.map);
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
