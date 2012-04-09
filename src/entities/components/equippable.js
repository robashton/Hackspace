define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../../shared/eventable');  

  var EquipmentSlot = function(equipType) {
    Eventable.call(this);
    this.item = null;
    this.equipType = equipType;
  };
  EquipmentSlot.prototype = {
    setItem: function(item) {
      if(item.equipType !== this.equipType)
        return this.raiseEquipFailed(item);
      if(this.item)
        this.clear();
      this.item = item;
      this.raiseEquipped(item);
    },
    getItem: function() {
      return this.item;
    },
    clear: function() {
      var item = this.item;
      this.item = null;
      this.raiseUnequipped(item);
    },
    raiseEquipped: function(item) {
      this.raise('Equipped', item);
    },
    raiseUnequipped: function(item) {
      this.raise('Unequipped', item)
    },
    raiseEquipFailed: function(item) {
      this.raise('EquipFailed', item);
    }
  };
  _.extend(EquipmentSlot.prototype, Eventable.prototype);

  var Equippable = function() {
    this.slots = {};
  };

  Equippable.prototype = {
    defineSlot: function(type) {
      this.slots[type] = new EquipmentSlot(type);
      this.slots[type].on('Equipped', this.onItemSlotEquipped, this);
      this.slots[type].on('Unequipped', this.onItemSlotUnequipped, this);
      this.slots[type].on('EquipFailed', this.onItemSlotEquipFailed, this);
    },
    equip: function(itemId) {
      // Get the item from our inventory
      // Remove the item from our inventory
      // Now equip it
      // Note: If any if you scallywags attempt to dupe using this stuff, I will hunt
      // you down and tell your mother - that'll show you.
      var item = this.parent.get('ItemById', [itemId]);
      if(!item) return;

      // Atomic plsthx lol
      this.parent.dispatch('removeItemWithId', [itemId]);
      this.slots[item.equipType].setItem(item);
    },
    unequip: function(itemType) {
      this.slots[item.equipType].clear();
    },
    getItemInSlot: function(itemType) {
      return this.slots[itemType].getItem();
    },
    onItemSlotEquipped: function(data, sender) {
      this.parent.raise('ItemEquipped', item);
    },
    onItemSlotUnequipped: function(data, sender) {
      this.parent.raise('ItemUnequipped', item);
    },
    onItemSlotEquipFailed: function(data, sender) {
      this.parent.raise('ItemEquipFailed', item);
    },
    onItemUnequipped: function(item, sender) {
      this.parent.dispatch('addInventoryItem', [item.id, item.data]);
    },
    onItemSlotEquipFailed: function(item, sender) {
      this.parent.dispatch('addInventoryItem', [item.id, item.data]);
    }
  };

  return Equippable;
});