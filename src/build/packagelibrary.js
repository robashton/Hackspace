define(function(require) {

  var buildLibrary = function(directory, cb) {
    
  };

  var saveLibrary = function(file, library, cb) {

  };

  return function(in, out, cb) {
    buildLibrary(in, function(library) {
      saveLibrary(out, library, function(){
        cb();
      })
    });
  };
});