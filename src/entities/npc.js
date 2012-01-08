define(function(require) {

  var _ = require('underscore');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Directable = require('./components/directable');
  var Trackable = require('./components/trackable');
  var Entity = require('../scene/entity');
  var Conversational = require('./components/conversational');

  var Npc = function(id, x ,y) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable('character'));
    this.attach(new Tangible(x, y, 25, 25));
    this.attach(new Directable(3.0));
    this.attach(new Conversational([]));

  };  
  Npc.prototype = {};  
  _.extend(Npc.prototype, Entity.prototype);
  
  return Npc;
});
