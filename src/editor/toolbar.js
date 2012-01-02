define(function(require) {

  var $ = require('jquery');
  var SelectTool = require('./selecttool');
  var MoveTool = require('./movetool');

  var Toolbar = function(editor) {
    this.editor = editor;
    this.tools = {
      'select': new SelectTool(editor),
      'move': new MoveTool(editor)    
    };
    this.setupTools();
    this.activateTool('move');
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
        self.activateTool(tool);
      });
    },
    activateTool: function(tool) {
      this.editor.setCurrentTool(this.tools[tool]);
    }
  };
  
  return Toolbar;   

});
