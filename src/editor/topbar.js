define(function(require) {

  var $ = require('jquery');
  var TopBar = function(editor) {
    this.editor = editor;
    this.setupTools();
  };  
  
  TopBar.prototype = {
    setupTools: function() {   
      var self = this; 
      $('#save-map').click(function() {
        self.saveMap();
      });
    },
    saveMap: function() {
      var data = this.editor.map.getMapData();
      
    }
  };
  
  return TopBar;   

});
