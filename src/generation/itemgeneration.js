define(function(require) {
  var _ = require('underscore');
  var EquipmentTypes = require('../scripting/equipmenttypes');

  var ItemGeneration = function() {
    this.equipmentCollection = [];
    for(var i in EquipmentTypes)
      this.equipmentCollection.push(EquipmentTypes[i]);
  };

  ItemGeneration.prototype = {
    createItem: function() {
      var equipType = this.equipmentCollection[Math.floor((Math.random() * this.equipmentCollection.length))];
      var item = {
        id: 'item-' + Math.floor(Math.random() * 1000000),
        type: equipType,      // This would be sword, etc
        equipType: equipType, // This is just the equip type
        pickupWidth: 5,
        pickupHeight: 8,
        pickupTexture: equipType + '-icon'
      };
      return item;
    }
  };

  return ItemGeneration;
});