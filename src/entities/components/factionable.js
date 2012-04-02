define(function(require) {
  var _ = require('underscore');

  var Factionable = function(faction) {
    this.faction = faction;
  };
  
  Factionable.prototype = {
    getFaction: function() {
      return this.faction;
    },
    getIsEnemyWith: function(other) {
      var otherFaction = other.get('Faction', [], null);
      if(!otherFaction) return false;
      return otherFaction !== this.faction;
    },    
  };
  
  return Factionable;
});
