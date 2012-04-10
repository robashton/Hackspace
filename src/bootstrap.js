(function() {

  var requirejs = require('requirejs');
    requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require,
    paths: {
      'glmatrix': './libs/glmatrix'
    }
  });
  module.exports = requirejs;
 

}).call(this);
