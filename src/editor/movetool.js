define(function(require) {

  var Coords = require('../shared/coords');

  var MoveTool = function(editor) {
    this.editor = editor;
  };
  
  MoveTool.prototype = {
    activate: function() {
      this.editor.cursor('pointer');
      this.editor.input.on('drag', this.onElementDragEvent, this);
    },
    deactivate: function() {
     this.editor.cursor('default');
     this.editor.input.off('drag', this.onElementDragEvent, this);
    },
    onElementDragEvent: function(e) {
      var translated = Coords.isometricToWorld(e.dx, e.dy);
      this.editor.moveViewer(translated.x * - 1.0, translated.y * -1.0);
    }
  };
  
  return MoveTool;

});
