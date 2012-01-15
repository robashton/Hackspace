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
  var Quester = require('./components/quester');
  var Talker = require('./components/talker');
  var Fighter = require('./components/fighter');
  var Factionable = require('./components/factionable');
  var Damageable = require('./components/damageable');
  var HasHealth = require('./components/hashealth');

  var Character = function(id, x ,y) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable('character', true));
    this.attach(new Tangible(x, y, 12, 18));
    this.attach(new Directable(3.0));
    this.attach(new Trackable());
    this.attach(new Actionable());
    this.attach(new Carrier());
    this.attach(new Quester());
    this.attach(new Talker());
    this.attach(new Fighter());
    this.attach(new Factionable('player'));
    this.attach(new Damageable());
    this.attach(new HasHealth(100));
  };  
  Character.prototype = {};  
  _.extend(Character.prototype, Entity.prototype);
  
  return Character;
});
