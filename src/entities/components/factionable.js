define(function(require) {
  var _ = require('underscore');

  var Factionable = function(faction) {
    this.faction = faction;
  };
  
  Factionable.prototype = {
    getFaction: function() {
      return this.faction;
    },
    isEnemyWith: function(other) {
      var otherFaction = other.get('getFaction', [], null);
      if(!otherFaction) return false;
      return otherFaction !== this.faction;
    },    
  };
  
  return Factionable;
});
