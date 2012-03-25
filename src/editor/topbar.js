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
      var waiting = 0;
      this.editor.map.eachLoadedTile(function(i, j, tile) {
         var data = tile.getData();
         waiting++;
         $.ajax({
          type: 'POST',
          url: 'services/savetile',
          data: { map: JSON.stringify(data), x: i, y: j},
          success: function() {
            waiting--;
            if(waiting === 0)
              alert('Saved');
          },
          dataType: 'json'
         });
      });
    }
  };
  
  return TopBar;   

});
