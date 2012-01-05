define(function(require) {

  var _ = require('underscore');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Directable = require('./components/directable');
  var Trackable = require('./components/trackable');
  var Entity = require('../scene/entity');

  var Character = function(id, x ,y, width, height, model) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable(model));
    this.attach(new Tangible(x, y, width, height));
    this.attach(new Directable(3.0));
    this.attach(new Trackable());

  };  
  Character.prototype = {};  
  _.extend(Character.prototype, Entity.prototype);
  
  return Character;
});
