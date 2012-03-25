var requirejs = require('./bootstrap');

var when = require('when').when;

requirejs('./tests/entitytests');
requirejs('./tests/actiontests');
requirejs('./tests/factiontests');
requirejs('./tests/healthtests');
requirejs('./tests/scenetests');
requirejs('./tests/sharding');

when.allTestsFinished(function() {
  when.printReport();
});
