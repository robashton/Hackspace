var requirejs = require('requirejs');
var exec = require('child_process').exec;

var SwallowConfig = require('swallow/config').Config;
var Swallow = require('swallow').Runner;

var appName = process.argv[2];

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

try {
requirejs.optimize(config, function(res) {
  console.log(res);
}); }
catch(ex) {
  console.log(ex);
}

var swallow = new Swallow(new SwallowConfig({
  in: './src/apps/' + appName + '/assets',
  out: './site/game/assets.json'
})); 
swallow.run();
