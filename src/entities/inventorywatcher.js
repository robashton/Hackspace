define(function(require) {
  var _ = require('underscore');

  var InventoryWatcher = function(scene, persistence) {
    this.scene = scene;
    this.persistence = persistence;
    this.inventories = {};
    this.hookSceneEvents();
  };
  
  InventoryWatcher.prototype = {
    hookSceneEvents: function() {
      this.scene.on('ItemPickedUp', this.onEntityPickedUpItem, this);
      this.scene.on('ItemRemoved', this.onEntityRemovedItem, this);
    },
    onEntityPickedUpItem: function(item, sender) {
       this.inventories[sender.id][item.id] = item;
       this.saveInventoryForPlayer(sender.id);
    },
    onEntityRemovedItem: function(item, sender) {
      delete this.inventories[sender.id][item.id];
      this.saveInventoryForPlayer(sender.id);
    },
    saveInventoryForPlayer: function(playerId) {
      this.persistence.saveInventoryForPlayer(playerId, this.inventories[playerId]);
    },
    loadItemsForPlayer: function(playerId, callback) {
      var self = this;
      this.persistence.loadInventoryForPlayer(playerId, function(data) {
        self.inventories[playerId] = data; 
        self.scene.dispatch(playerId, '_setInventoryData', [
          data
        ]);
        callback();
      });
    },
    unloadItemsForPlayer: function(player) {
      delete this.inventories[player.id];
    }
  };
  
  return InventoryWatcher;
});
