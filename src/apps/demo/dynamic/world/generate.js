var fs = require('fs');

var width = 32;
var height = 32;


var empty = {
  collision: [],
  items: []
};

var emptyString = JSON.stringify(empty);

for(var x = 0; x < width; x++){
  for(var y = 0; y < height; y++){
    var xstr = zeroFill(x.toString(10), 5);
    var ystr = zeroFill(y.toString(10), 5);
    var filename = xstr + '_' + ystr + '.json';
    verifyFileExists(filename);
  }
}

function verifyFileExists(filename) {
  fs.stat(filename, function(err, st) {
      if(err)
        createEmpty(filename);
    });
}

function createEmpty(filename) {
  fs.writeFile(filename, emptyString);
}

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number;
}
