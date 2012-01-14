var requirejs = require('requirejs');

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require,
  paths: {
    'glmatrix': './libs/glmatrix'
  }
});

var when = require('when').when;
var entities = requirejs('./tests/entities');
var directabletests = requirejs('./tests/directabletests');

when.allTestsFinished(function() {
  when.printReport();
});
