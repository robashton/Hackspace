(function() {
  var requirejs = require('requirejs');
  requirejs.config({
    baseUrl: __dirname
  });
  
  var EditorServices = requirejs('./editor/services');
  var editorServices = new EditorServices(__dirname);
  
  var Tooling = {
    handle: function(req, res) {
      return editorServices.handle(req, res);
    }  
  };
  
   module.exports = Tooling;
}).call(this);




