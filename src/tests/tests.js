var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    paths: {
      'glmatrix': '../libs/glmatrix',
      'jquery': '../libs/jquery'
    }
});

var entities = requirejs('./entities');
