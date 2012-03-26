define(function(require) {
  var spawn = require('child_process').spawn;

  return function(cb) {
    var tests = spawn('node', ['./src/tests']);
    tests.on('exit', function (code) {
      cb();
    });
    
    tests.stdout.on('data', function (data) {
      console.log('' + data);
    });

    tests.stderr.on('data', function (data) {
      console.log('' + data);
    });
  };

});