(function() {
  var requirejs = require('requirejs');
  var SwallowConfig = require('swallow/config').Config;
  var Swallow = require('swallow').Runner;

  module.exports = function(appName) {
    var config = {
        baseUrl: './src',
        name: 'apps/' + appName + '/app',
        out: './site/game/app.js',
        optimize: 'none',
        paths: {
          'glmatrix': './libs/glmatrix',
          'underscore': '../node_modules/underscore/underscore',
          'jquery': './libs/jquery'
        }
    };

    requirejs.optimize(config, function(res) {});
    
    config.name = 'apps/' + appName + '/editor';
    config.out = './site/game/editor.js';
    
    requirejs.optimize(config, function(res) {});

    var swallow = new Swallow(new SwallowConfig({
      in: './src/apps/' + appName + '/assets',
      out: './site/game/assets.json'
    }));
    swallow.run();
  };

}).call(this);




