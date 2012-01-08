define(function(require) {
  var _ = require('underscore');

  var Carrier = function() {
    this.items = [];
  };
  
  Carrier.prototype = {
    countOfItemType: function(itemType) {
      return _(this.items).count(function(item) {
        return item.type === itemType;
      });
    },
    add: function(item) {
      this.items.push(item);
      this.parent.raise('ItemPickedUp', {
        item: item
      });
    },
    remove: function(item) {
      this.items = _(this.items).without(item);
      this.parent.raise('ItemRemoved', {
        item: item
      });
    }
  };
  
  return Carrier;
});
