define(function(require) {
  var fs = require('fs');
  var path = require('path');

  var processLibraryItem = function(root, children, current, processor, cb) {
    if(current === children.length) 
      return cb();
    var file = path.join(root, children[current]);
    fs.readFile(file, 'utf8', function(err, str) {
      if(err) throw err;
      processor(children[current], str, function() {
        processLibraryItem(root, children, ++current, processor, cb);
      });      
    });
  };

  var visitLibrary = function(directory, processor, cb) {
    var templates = {};
    fs.readdir(directory, function(err, children) {
      if(err) throw err;
      processLibraryItem(directory, children, 0, processor, cb);
    });
  };

  return {
    visitLibrary: visitLibrary
  };
});