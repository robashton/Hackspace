define(function(require) {

  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');

  var LibraryItemTool = function(editor, element) {
    this.editor = editor;
    this.element = element;
    this.material = new Material();
    this.material.diffuseTexture = editor.context.resources.get(element.texture);
    this.quad = new Quad(this.material);
    this.instance = new Instance(this.quad);
    this.instance.scale(element.width, element.height);
    this.instance.translate(30, 30);
  };
  
  LibraryItemTool.prototype = {
    activate: function() {
      this.editor.cursor('none');      
      this.editor.input.on('move', this.oninputmove, this);
      this.editor.input.on('enter', this.oninputenter, this);
      this.editor.input.on('leave', this.oninputleave, this);
    },
    deactivate: function() {
     this.editor.cursor('default');
     this.editor.input.off('move', this.oninputmove, this);
     this.editor.input.off('enter', this.oninputenter, this);
     this.editor.input.off('leave', this.oninputleave, this);
     this.hideModel();
    },
    oninputmove: function(e) {
      this.updateModel();
    },  
    oninputenter: function() {
     this.showModel();
    },
    oninputleave: function() {
     this.hideModel();
    },
    showModel: function() {
      this.updateModel();
      this.editor.context.scene.graph.add(this.instance);
    },
    hideModel: function() {
      this.editor.context.scene.graph.remove(this.instance);
    },
    updateModel: function() {
      var coords = this.editor.input.getInputPageCoords();
      coords = this.editor.context.pageCoordsToWorldCoords(coords.x, coords.y);
      this.instance.translate(coords.x, coords.y, 0);
    }
  };
  
  return LibraryItemTool;

});
