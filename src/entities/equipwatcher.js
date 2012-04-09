define(function(require) {
  var _ = require('underscore');

  var EquipWatcher = function(scene, persistence) {
    this.scene = scene;
    this.persistence = persistence;
    this.equips = {};
    this.scene.autoHook(this);
  };
  EquipWatcher.prototype = {
    onItemEquipped: function(item, sender) {
      this.equips[sender.id][item.equipType] = item;
      this.saveEquipmentForCharacter(sender.id);
    },
    onItemUnequipped: function(item, sender) {
      delete this.equips[sender.id][item.equipType];
      this.saveEquipmentForCharacter(sender.id);
    },
    saveEquipmentForCharacter: function(playerId) {
      this.persistence.saveEquipmentForPlayer(playerId, this.equips[playerId]);
    },
    loadEquipmentForCharacter: function(playerId, callback) {
      var self = this;
      this.persistence.loadEquipmentForPlayer(playerId, function(data) {
        self.equips[playerId] = data; 
        self.scene.dispatch(playerId, '_setEquipData', [
          data
        ]);
        callback();
      });

    }
  };
  return EquipWatcher;
});