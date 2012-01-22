define(function(require) {

  var _ = require('underscore');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Directable = require('./components/directable');
  var Trackable = require('./components/trackable');
  var QuestGiver = require('./components/questgiver');
  var Entity = require('../scene/entity');
  
  var FetchDucks = require('../scripting/quests/fetchducks');

  var Npc = function(id, data) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable('character', true));
    this.attach(new Tangible(data.x, data.y, 12, 18));
    this.attach(new Directable(3.0));
    this.attach(new QuestGiver(FetchDucks));

  };  
  Npc.prototype = {};  
  _.extend(Npc.prototype, Entity.prototype);
  
  return Npc;
});
