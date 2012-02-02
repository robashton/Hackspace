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
  var Factionable = require('./components/factionable');
  var Damageable = require('./components/damageable');
  var HasHealth = require('./components/hashealth');
  var StandardAnimations = require('./components/standardanimations');
  var Animatable = require('./components/animatable');
  
  var Monster = function(id, data) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable(data.texture, true));
    this.attach(new Tangible(data.x, data.y, 12, 18));
    this.attach(new Directable(1.5));
    this.attach(new Roamable(data.x, data.y, -100, -100, 100, 100));
    this.attach(new Seeker('player'));
    this.attach(new Fighter());
    this.attach(new Factionable('monster'));
    this.attach(new Damageable());
    this.attach(new HasHealth(2));
    this.attach(new Animatable(data.texture));
    this.attach(new StandardAnimations());
       
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
    onCancelledAttackingTarget: function() {
      this.raise('StateChanged', 'Wandering');
      this.dispatch('resetSeekState');
    },
    onMonsterDestinationTargetChanged: function(targetId) {
      this.targetId = targetId;
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
        this.dispatch('attack', [ this.targetId ]);
    }
  };
  _.extend(Monster.prototype, Entity.prototype);
  
  return Monster;
});
