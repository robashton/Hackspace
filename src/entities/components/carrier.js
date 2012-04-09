define(function(require) {
  var _ = require('underscore');

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
    addInventoryItem: function(item) {
      this.items[item.id] = item;
      this.parent.raise('ItemPickedUp', item);
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
        this.items[key] = data[key];
      }
      this.parent.raise('InventoryDataUpdated', data);
    }
  };
  
  return Carrier;
});
