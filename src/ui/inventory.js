define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  
  var Inventory = function(input, scene, playerId) {
    this.scene = scene;
    this.input = input;
    this.playerId = playerId;
    this.scene.autoHook(this);
    this.inventoryElement = $('#inventory');
    this.inventoryContentElement = $('#inventory-content');
    this.input.on('InventoryToggleRequest', this.onInventoryToggleRequest, this);
    this.visible = false;
  };
  
  Inventory.prototype = {
    onItemPickedUp: function(item, sender) {
      if(sender.id !== this.playerId) return;
      var html = this.createHtmlForItem(item);
      this.inventoryContentElement.append(html);      
    },
    onItemRemoved: function(data, sender) {
      if(sender.id !== this.playerId) return;
      console.log('Removal of item');
      this.inventoryContentElement.find('#' + data.id).remove();
    },
    createHtmlForItem: function(item) {
      var html = $('<div/>');
      html.attr('id', item.id);
      html.text(item.data.type);
      return html;
    },
    onInventoryToggleRequest: function() {
      if(this.visible)
        this.hide();
      else
        this.show();
    },
    show: function() {
      this.inventoryElement.show();
      this.visible = true;
    },
    hide: function() {
      this.inventoryElement.hide();
      this.visible = false;
    }
  };
  
  return Inventory;
});
