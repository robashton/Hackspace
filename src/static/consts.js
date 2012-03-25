define(function(require) {
  var Coords = require('../shared/coords');
  var CONSTS = {};

  CONSTS.TILEWIDTH = 128;
  CONSTS.TILEHEIGHT = 128;
      
  var tileBottomRight = Coords.worldToIsometric(CONSTS.TILEWIDTH, CONSTS.TILEHEIGHT);
  var tileTopRight = Coords.worldToIsometric(CONSTS.TILEWIDTH, 0);
  var tileBottomLeft = Coords.worldToIsometric(0, CONSTS.TILEHEIGHT);

  CONSTS.RENDERTILEWIDTH = tileTopRight.x - tileBottomLeft.x;
  CONSTS.RENDERTILEHEIGHT = tileBottomRight.y;

  return CONSTS;
});