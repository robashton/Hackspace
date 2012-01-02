define(function(require) {
  var SelectTool = function(editor) {
    this.editor = editor;
  };
  
  SelectTool.prototype = {
    activate: function() {
     this.editor.cursor('crosshair');
      
    },
    deactivate: function() {
       this.editor.cursor('default');
    }
  };
  
  return SelectTool;
});
