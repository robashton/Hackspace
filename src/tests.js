var requirejs = require('requirejs');

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require,
  paths: {
    'glmatrix': './libs/glmatrix'
  }
});

var when = require('when').when;

requirejs('./tests/entitytests');
requirejs('./tests/actiontests');
requirejs('./tests/factiontests');
requirejs('./tests/healthtests');
requirejs('./tests/scenetests');

when.allTestsFinished(function() {
  when.printReport();
});
