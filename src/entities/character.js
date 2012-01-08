define(function(require) {

  var _ = require('underscore');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Directable = require('./components/directable');
  var Trackable = require('./components/trackable');
  var Actionable = require('./components/actionable');
  var Entity = require('../scene/entity');
  var Carrier = require('./components/carrier');

  var Character = function(id, x ,y) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable('character'));
    this.attach(new Tangible(x, y, 25, 25));
    this.attach(new Directable(3.0));
    this.attach(new Trackable());
    this.attach(new Actionable());
    this.attach(new Carrier());

  };  
  Character.prototype = {};  
  _.extend(Character.prototype, Entity.prototype);
  
  return Character;
});
