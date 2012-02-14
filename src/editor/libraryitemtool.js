define(function(require) {

  var LibraryItemTool = function(editor, element) {
    this.editor = editor;
    this.element = element;
  };
  
  LibraryItemTool.prototype = {
    activate: function() {
      this.editor.cursor('none');      
      this.editor.input.on('move', this.oninputmove, this);
      this.editor.input.on('enter', this.oninputenter, this);
      this.editor.input.on('leave', this.oninputleave, this);
      this.editor.input.on('action', this.oninputaction, this);
      this.element.activate(this.editor);
    },
    deactivate: function() {
     this.editor.cursor('default');
     this.editor.input.off('move', this.oninputmove, this);
     this.editor.input.off('enter', this.oninputenter, this);
     this.editor.input.off('leave', this.oninputleave, this);
     this.editor.input.off('action', this.oninputaction, this);
     this.element.deactivate(this.editor);
    },
    oninputmove: function(e) {
      this.element.update();
    },  
    oninputenter: function() {
     this.element.show();
    },
    oninputleave: function() {
     this.element.hide();
    },
    oninputaction: function() {
      var coords = this.editor.input.getInputPageCoords();
      coords = this.editor.context.pageCoordsToWorldCoords(coords.x, coords.y);
      this.addInstanceToMapAt(coords.x, coords.y);
    },
    addInstanceToMapAt: function(x, y) {
      this.element.execute(x, y, this.editor);  
    }
  };
  
  return LibraryItemTool;

});
