define(function(require) {

  var $ = require('jquery');

  var Toolbar = function(editor) {
    this.editor = editor;
    this.tools = {
      'select': new SelectTool(editor),
      'move': new MoveTool(editor)    
    };
    this.currentTool = null;
    this.setupTools();
  };  
  
  Toolbar.prototype = {
    setupTools: function() {    
      for(var i in this.tools) {
        this.hookTool(i);
      };
    },
    hookTool: function(tool) {
      var self = this;
      $('#' + tool).click(function() {
        self.currentTool.deactivate();
        self.currentTool = this.tools[tool];
        self.currentTool.activate();
      });
    };
  };
  
  return Toolbar;   

});
