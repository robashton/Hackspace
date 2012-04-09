define(function(require) {
  var _ = require('underscore');
  var Item = require('../../scripting/item');

  var Carrier = function() {
    this.items = {};
  };
  
  Carrier.prototype = {
    countOfItemType: function(itemType) {
      var count = 0;
      for(var i in this.items) {
        if(this.items[i].type === itemType)
          count++;       
      }
      return count;
    },
    getItemWithId: function(id) {
      return this.items[id];
    },
    removeItemWithId: function(id) {
      var item = this.items[id];
      if(item)
        this.removeInventoryItem(item);
    },
    addInventoryItem: function(id, data) {
      this.items[id]  = new Item(id, data);
      this.parent.raise('ItemPickedUp', {
        id: id,
        data: data
      });
    },
    removeInventoryItem: function(item) {
      delete this.items[item.id];
      this.parent.raise('ItemRemoved', {
        id: item.id
      });
    },
    removeItemsOfType: function(itemType) {
     for(var i in this.items) {
        if(this.items[i].type === itemType)
          this.removeInventoryItem(this.items[i]);
      }
    },
    _setInventoryData: function(data) {
      for(var key in data) {
        var itemData = data[key];
        var item = new Item(key, itemData);
        this.items[item.id] = item;
      }
      this.parent.raise('InventoryDataUpdated', data);
    }
  };
  
  return Carrier;
});
