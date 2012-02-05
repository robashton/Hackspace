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
    _getInventoryData: function(data) {
      for(var key in this.items) {
        var item = this.items[key];
        data[key] = item.template;
      }
    },
    _setInventoryData: function(data) {
      for(var key in data) {
        var itemData = this.data[key];
        var item = new Item(key, itemData);
        this.items[item.id] = item;
      }
    }
  };
  
  return Carrier;
});
