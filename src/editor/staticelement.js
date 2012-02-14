define(function(require) {
  var _ = require('underscore');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');
  
  var StaticElement = function(template) {
    this.template = template;
  };
  
  StaticElement.prototype = {
    execute: function(x, y) {
      this.editor.map.addStatic(this.template, x, y);
    },
    displayTexture: function() {
      return this.template.texture;
    },
    activate: function(editor) {
      this.editor = editor;
      if(!this.instance)
        this.createModel();
    },
    deactivate: function() {
      // Might clean up, might not
    },
    
    show: function() {
      this.update();
      this.editor.context.scene.graph.add(this.instance);
    },
    
    hide: function() {
      this.editor.context.scene.graph.remove(this.instance);
    },

    update: function() {
      var coords = this.editor.input.getInputPageCoords();
      coords = this.editor.context.pageCoordsToWorldCoords(coords.x, coords.y);
      this.instance.translate(coords.x, coords.y, 0);
    },

    createModel: function() {
      this.material = new Material();
      this.material.diffuseTexture = this.editor.context.resources.get(this.template.texture);
      this.quad = new Quad(this.material);
      this.instance = new Instance(this.quad);
      this.instance.scale(this.template.size[0], this.template.size[1], this.template.size[2]);
    }
  };
  
  return StaticElement;
});
