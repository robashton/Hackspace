define(function(require) {
  var _ = require('underscore');
  var EquipmentTypes = require('../scripting/equipmenttypes');

  var ItemGeneration = function() {
    this.equipmentCollection = [];
    for(var i in EquipmentTypes)
      this.equipmentCollection.push({
        equipType: EquipmentTypes[i],
        name: i
      });
  };

  ItemGeneration.prototype = {
    createItem: function() {
      var chosen = this.equipmentCollection[Math.floor((Math.random() * this.equipmentCollection.length))];
      var item = {
        id: 'item-' + Math.floor(Math.random() * 1000000),
        type: chosen.equipType,      // This would be sword, etc
        equipType: chosen.equipType, // This is just the equip type
        pickupWidth: 5,
        pickupHeight: 8,
        pickupTexture: chosen.name + '-icon'
      };
      return item;
    }
  };

  return ItemGeneration;
});