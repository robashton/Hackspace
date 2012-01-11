define(function(require) {
  var _ = require('underscore');
  var Entity = require('../scene/entity');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Roamable = require('./components/roamable');
  var Directable = require('./components/directable');
  
  var Monster = function(id, x, y, texture) {
    Entity.call(this, id);
    this.attach(new Physical());
    this.attach(new Renderable(texture, false));
    this.attach(new Tangible(x, y, 25, 25));
    this.attach(new Directable(1.5));
    this.attach(new Roamable(x, y, -100, -100, 100, 100));
  };
  
  Monster.prototype = {
    
  };
  _.extend(Monster.prototype, Entity.prototype);
  
  return Monster;
});
