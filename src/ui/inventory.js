define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var UI = require('./common');
  var Hammer = require('hammer');

  var Inventory = function(input, commander, scene, playerId) {
    this.scene = scene;
    this.commander = commander;
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
      this.removeItem(item);
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
      this.hookTouchEventsForItem(item);      
    },
    hookTouchEventsForItem: function(item) {
      var elem = this.findElementForItem(item);
      var hammer = new Hammer(elem.get(0));
      var self = this;
      hammer.ontap = function(ev){
        self.showItemDialog(elem, item);
      };
    },
    showItemDialog: function(elem, item) {
      var self = this;
      UI.ShowContext({
        Equip: function() {
          self.commander.dispatch('equip', [item.id]);
        }
      },
      elem.offset().left,
      elem.offset().top);
    },
    removeItem: function(item) {
      var elem = this.findElementForItem(item);
      elem.remove();
    },
    findElementForItem: function(item) {
      return this.inventoryContentElement.find('#' + item.id);
    },
    createHtmlForItem: function(item) {
      var html = $('<div/>');
      html.attr('id', item.id);
      html.append(
        $('<img/>')
          .attr('src', this.scene.resources.get('main/' + item.data.pickupTexture + '.png').str())
        );
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