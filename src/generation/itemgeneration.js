define(function(require) {
  var _ = require('underscore');
  var EquipmentTypes = require('../scripting/equipmenttypes');

  var ItemGeneration = function() {
    this.equipmentCollection = [];
    for(var i in EquipmentTypes)
      this.equipmentCollection.push(i);
  };

  ItemGeneration.prototype = {
    createItem: function() {
      var template = {
        type: 'item',
        equipType: this.equipmentCollection[Math.floor((Math.random() * this.equipmentCollection.length))],
        pickupWidth: 5,
        pickupHeight: 8,
        pickupTexture: 'placeholder'
      };
      var id = 'item-' + Math.floor(Math.random() * 1000000);
      return {
        id: id,
        template: template
      };
    }
  };

  return ItemGeneration;
});