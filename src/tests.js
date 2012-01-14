var requirejs = require('requirejs');

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require,
  paths: {
    'glmatrix': './libs/glmatrix'
  }
});

var when = require('when').when;
requirejs('./tests/entities');
requirejs('./tests/actiontests');
requirejs('./tests/factiontests');
requirejs('./tests/health');
when.allTestsFinished(function() {
  when.printReport();
});
