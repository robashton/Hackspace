define(function(require) {
  var SelectTool = function(editor) {
    this.editor = editor;
    this.selectedItem = null;
  };
  
  SelectTool.prototype = {
    activate: function() {
     this.editor.cursor('crosshair');
     this.editor.input.on('action', this.onAttemptToSelect, this);
    },
    deactivate: function() {
     this.editor.cursor('default');
     this.deselectCurrent();
    },
    onAttemptToSelect: function(e) {
      var worldItem = this.editor.map.getWorldItemAt(e.x, e.y);
      
      if(worldItem) {
        this.deselectCurrent();
        this.select(worldItem);
      } 
    },
    onEditorDataChanged: function(data) {
      this.selectedItem.updateData(data);
    },    
    select: function(item) {
      this.selectedItem = item;
      this.selectedItem.select();
      this.editor.dataeditor.edit(this.selectedItem.getEditorData());
      this.editor.dataeditor.on('DataChanged', this.onEditorDataChanged, this);
    },
    deselectCurrent: function() {
      if(this.selectedItem) {
        this.selectedItem.deselect();
        this.selectedItem = null;
        this.editor.dataeditor.off('DataChanged', this.onEditorDataChanged, this);
      }
    }
  };
  
  return SelectTool;
});
