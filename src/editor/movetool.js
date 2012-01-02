define(function(require) {

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
      this.editor.moveViewer(e.dx * -2.0, e.dy * -2.0);
    }
  };
  
  return MoveTool;

});
