define(function(require) {
  var requirejs = require('requirejs');

  var buildConfig = function(appName, entryPoint, cb) {
    var config = {
      baseUrl: './src',
      name: 'apps/' + appName + '/' + entryPoint,
      out: './site/game/' + entryPoint + '.js',
      optimize: 'none',
      paths: {
        'glmatrix': './libs/glmatrix',
        'underscore': '../node_modules/underscore/underscore',
        'jquery': './libs/jquery',
        "hammer": './libs/hammer'
      }
    };
    cb(config);
  };

  return function(appName, entryPoint, cb) {
    buildConfig(appName, entryPoint, function(config) {
      requirejs.optimize(config, function() {
        console.log('Built', appName, entryPoint);
        cb();
      });
    });
  };
});