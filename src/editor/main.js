define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Instance = require('../../render/instance');
  var RenderGraph = require('../../render/rendergraph');
  var CanvasRender = require('../../render/canvasrender');
  var PackagedResources = require('../../resources/packagedresources');
  var Camera = require('../../scene/camera');
  var Character = require('../../entities/character');
  var Scene = require('../../scene/scene');
  var InputEmitter = require('../../input/inputemitter');
  var Controller = require('../../entities/controller');
  var Scenery = require('../../static/scenery');
  var Debug = require('../../entities/debug');
  var $ = require('jquery');
  

  var Editor = function() {
  
  };
  
  Editor.prototype = {
  
  };
  
  return Editor;
});
