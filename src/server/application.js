var requirejs = require('requirejs');
requirejs.config({
  nodeRequire: require,
  paths: {
    'glmatrix': '../libs/glmatrix'
  }
});

var app = requirejs('../share/test');
app.test();
