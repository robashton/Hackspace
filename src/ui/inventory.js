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
    this.inventoryButton = $('#toolbar-inventory');
    this.input.on('InventoryToggleRequest', this.onInventoryToggleRequest, this);
    this.visible = false;
    this.inventoryButton.click(_.bind(this.onInventoryToggleRequest, this));
  };
  
  Inventory.prototype = {
    onItemPickedUp: function(item, sender) {
      if(sender.id !== this.playerId) return;
      this.addItem(item);     
    },
    onItemRemoved: function(data, sender) {
      if(sender.id !== this.playerId) return;
      this.inventoryContentElement.find('#' + data.id).remove();
    },
    onInventoryDataUpdated: function(data, sender) {
      if(sender.id !== this.playerId) return;
      for(var id in data) {
        this.addItem(data[id]);
      }
    },    
    onInventoryToggleRequest: function() {
      if(this.visible)
        this.hide();
      else
        this.show();
    },
    addItem: function(item) {
      var html = this.createHtmlForItem(item);
      this.inventoryContentElement.append(html); 
    },
    createHtmlForItem: function(item) {
      var html = $('<div/>');
      html.attr('id', item.id);
      html.text(item.data.type);
      html.addClass('inventory-item');
      return html;
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
