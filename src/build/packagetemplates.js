define(function(require) {
  var library = require('./library');
  var fs = require('fs');
  
  var saveTemplates = function(file, templates, cb) {
    fs.writeFile(file, JSON.stringify(templates), function(err) {
      if(err) throw err;
      cb();
    });
  };

  var buildTemplates = function(directory, cb) {
    var templates = {};
    library.visitLibrary(directory, function(str, visited) {
      var data = JSON.parse(str);
      if(data.type === 'static') {
        templates[data.template.id] = data.template;
      }
      visited();
    }, function(){
      cb(templates);
    });
  };

  return function(_in, out, cb) {
    buildTemplates(_in, function(templates) {
      saveTemplates(out, templates, function(){
        cb();
      })
    });
  };
});