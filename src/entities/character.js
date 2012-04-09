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
  var Talker = require('./components/talker');
  var Fighter = require('./components/fighter');
  var Factionable = require('./components/factionable');
  var Damageable = require('./components/damageable');
  var HasHealth = require('./components/hashealth');
  var Animatable = require('./components/animatable');
  var StandardAnimations = require('./components/standardanimations');
  var Quester = require('./components/quester');
  var Equippable = require('./components/equippable');
  var EquipmentTypes = require('../scripting/equipmenttypes');
  
  var Character = function(id, data) {
    Entity.call(this, id);
    
    this.attach(new Physical());
    this.attach(new Renderable('character', true));
    this.attach(new Tangible(data.x, data.y, 12, 18));
    this.attach(new Directable(1.5));
    this.attach(new Actionable());
    this.attach(new Carrier());
    this.attach(new Talker());
    this.attach(new Fighter());
    this.attach(new Factionable('player'));
    this.attach(new Damageable());
    this.attach(new HasHealth(100));
    this.attach(new Animatable('character'));
    this.attach(new StandardAnimations());
    this.attach(new Quester());
    this.attach(this.createEquippable());
  };
  
  Character.prototype = {
    createEquippable: function() {
      var equippable = new Equippable();
      equippable.defineSlot(EquipmentTypes.boots);
      equippable.defineSlot(EquipmentTypes.trousers);
      equippable.defineSlot(EquipmentTypes.belt);
      equippable.defineSlot(EquipmentTypes.body);
      equippable.defineSlot(EquipmentTypes.weapon);
      equippable.defineSlot(EquipmentTypes.hat);
      return equippable;
    }    
  };  
  _.extend(Character.prototype, Entity.prototype);
  
  return Character;
});
