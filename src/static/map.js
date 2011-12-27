define(function(require) {

  var Map = function(width, height, tilewidth, tileheight) {
    this.width = width;
    this.height = height;
    this.tilewidth = tilewidth;
    this.tileheight = tileheight;
    this.tileCountWidth = parseInt(this.width / this.tileheight);
    this.tileCountHeight = parseInt(this.height / this.tileheight);
    this.tiles = new Array(this.tileCountWidth * this.tileCountHeight);
    this.templates = {};
  };
  
  Map.prototype = {
    populateGraph: function(graph) {
      
    },
    generateRandom: function() {

      this.templates.tree = {
        width: 25,
        height: 25,
        texture: "/main/tree.png"
      };
      
      for(var x = 0; x < this.tileCountWidth; x++) {
        for(var y = 0; y < this.tileCountHeight ; y++) {
          var index = this.index(x,y);
          this.tiles[index] = [];
          
          var treeCount = Math.random() * 5;
          for(var i = 0 ; i < treeCount; i++) {
            var xloc = Math.random() * this.tilewidth;
            var yloc = Math.random() * this.tileheight;
            this.tiles[index].push({
              x: xloc,
              y: yloc,
              template: "tree"            
            });
          }
        }     
      }    
    },
    index: function(x, y) {
      return x + y * this.tileCountWidth;
    }
  };
  
  return Map;

});
