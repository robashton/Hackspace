define(function(require) {
  var swallow = require('swallow');
  var handlers = swallow.handlers;

  return function(_in, out, cb) {
    swallow.build({
      in:  './main',
      out: out,
      root: _in,
      extraHandlers: [
        handlers.byExtension('.shader', handlers.text),
        handlers.byExtension('.fragment', handlers.text)
      ]
    }, function(err) {
      if(err) throw err;
      cb();
    });
  };
});