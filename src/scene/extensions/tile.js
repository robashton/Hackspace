define(function(require) {
  var Tile = function(x, y, width, height, background) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.background = background;
  };
  
  Tile.prototype = {
    renderTo: function(context) {
      context.drawImage(this.background.get(), this.x, this.y, this.width, this.height);
    }  
  };
  
  return Tile;
});
