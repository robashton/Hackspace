define(function(require) {

  function zeroFill( number, width )
  {
    width -= number.toString().length;
    if ( width > 0 )
    {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number;
  }
  
  var Paths = {
    filenameForTile: function(x, y) {
      return zeroFill(x, 5) + '_' + zeroFill(y, 5) + '.json';
    }
  };

  return Paths;
});