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
    this.currentTool = null;
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
      if(this.currentTool)
        this.currentTool.deactivate();
      this.currentTool = this.tools[tool];
      this.currentTool.activate();
    }
  };
  
  return Toolbar;   

});
