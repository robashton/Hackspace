define(function(require) {

  var MoveTool = function(editor) {
    this.editor = editor;
  };
  
  MoveTool.prototype = {
    activate: function() {
      this.editor.cursor('pointer');
    },
    deactivate: function() {
     this.editor.cursor('default');
    }
  };
  
  return MoveTool;

});
