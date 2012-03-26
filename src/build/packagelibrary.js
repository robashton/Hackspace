define(function(require) {
  var library = require('./library');
  var fs = require('fs');
  
  var saveLibrary = function(file, library, cb) {
    fs.writeFile(file, JSON.stringify(library), function(err) {
      if(err) throw err;
      cb();
    });
  };

  var buildLibrary = function(directory, cb) {
    var libraryData = {};
    library.visitLibrary(directory, function(filename, str, visited) {
      var data = JSON.parse(str);
      var key = filename.substr(0, filename.lastIndexOf('.'));
      libraryData[key] = data;
      visited();
    }, function(){
      cb(libraryData);
    });
  };

  return function(_in, out, cb) {
    buildLibrary(_in, function(library) {
      saveLibrary(out, library, function(){
        cb();
      })
    });
  };
});