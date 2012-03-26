(function() {
  var requirejs = require('./bootstrap');
  var exec = require('child_process').exec;
  var packageEntryPoint = requirejs('./build/packageentrypoint');
  var packageResources = requirejs('./build/packageresources');
  var packageTemplates = requirejs('./build/packagetemplates');
  var runTests = requirejs('./build/runtests');

  function build(cb) {
    packageEntryPoint('demo', 'app', function() {
      packageEntryPoint('demo', 'editor', function() {
        packageTemplates('./src/apps/demo/library', './src/apps/demo/assets/main/templates.json', function(){
          packageResources('./src/apps/demo/assets', './site/game/assets.json', function() {
            runTests(cb);
          });
        })
      });
    });
  };
  module.exports = build;

}).call(this);




