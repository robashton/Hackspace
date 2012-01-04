define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Character = require('../../entities/character');
  var Scene = require('../../scene/scene');
  var InputEmitter = require('../../input/inputemitter');
  var Controller = require('../../entities/controller');
  var Debug = require('../../entities/debug');
  var Map = require('../../static/map');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var Demo = function(element) {
    this.element = element;
  };
  
  
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
    tiles: new Array(tileCountWidth * tileCountHeight)
  };
  
  for(var x = 0; x < tileCountWidth; x++) {
    for(var y = 0; y < tileCountHeight ; y++) {
      var index = x + y * mapData.tilecountwidth;
      mapData.tiles[index] = [];
      
      var tilex = x * mapData.tilewidth;
      var tiley = y * mapData.tileheight;          
      var treeCount = Math.random() * 5;
      
      for(var i = 0 ; i < treeCount; i++) {
        var xloc = Math.random() * mapData.tilewidth;
        var yloc = Math.random() * mapData.tileheight;
           
        mapData.tiles[index].push({
          x: xloc,
          y: yloc,
          template: "tree"
        });
      }
    }     
  }    

  Demo.prototype = {
    start: function(context) {          
      this.context = context;
      var material = new Material();
      material.diffuseTexture =  context.resources.get('/main/testtile.png');
      var quad = new Quad(material);
      
      var character = new Character("player", 0, 0, 25, 25, quad);
      var controller = new Controller();
      var debug = new Debug();
      var map = new Map(mapData);
      
      context.scene.add(debug);
      context.scene.add(character);
      context.scene.add(controller);
      context.scene.add(map);
            
      var input = new InputEmitter(context.scene, this.element);

    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
