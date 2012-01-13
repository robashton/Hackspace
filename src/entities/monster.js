define(function(require) {
  var _ = require('underscore');
  var Entity = require('../scene/entity');
  
  var Physical = require('./components/physical');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Roamable = require('./components/roamable');
  var Directable = require('./components/directable');
  var Seeker = require('./components/seeker');
  var Fighter = require('./components/fighter');

  
  var Monster = function(id, x, y, texture) {
    Entity.call(this, id);
    this.attach(new Physical());
    this.attach(new Renderable(texture, false));
    this.attach(new Tangible(x, y, 25, 25));
    this.attach(new Directable(1.5));
    this.attach(new Roamable(x, y, -100, -100, 100, 100));
    this.attach(new Seeker('player'));
    this.attach(new Fighter());
    this.on('AddedToScene', this.onMonsterAddedToScene);
    this.on('DestinationTargetChanged', this.onMonsterDestinationTargetChanged);
    this.on('DestinationReached', this.onMonsterDestinationReached);
    this.on('StateChanged', this.onMonsterStateChanged);
    this.on('Tick', this.onMonsterTick);
    this.state = '';
  };
  
  Monster.prototype = {
    onMonsterAddedToScene: function() {
      this.raise('StateChanged', 'Wandering');
    },
    onMonsterDestinationTargetChanged: function() {
      this.raise('StateChanged', 'Seeking');
    },
    onMonsterDestinationReached: function() {
      if(this.state === 'Seeking')
        this.raise('StateChanged', 'Fighting');
    },
    onMonsterStateChanged: function(state) {
      this.state = state;
    },
    onMonsterTick: function() {
     if(this.state === 'Fighting')
        this.dispatch('attack', [ 'player' ]);
    }
  };
  _.extend(Monster.prototype, Entity.prototype);
  
  return Monster;
});
