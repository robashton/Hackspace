define(function(require) {
  var swallow = require('swallow');

  return function(_in, out, cb) {
    swallow.build({
      in:  './main',
      out: out,
      root: _in
    }, function(err) {
      if(err) throw err;
      cb();
    });
  };
});