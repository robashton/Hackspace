define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var EquipmentTypes = require('../scripting/equipmenttypes');
  var Hammer = require('hammer');
  var UI = require('./common');

  var Character = function(input, commander, scene, playerId) {
    this.scene = scene;
    this.playerId = playerId;
    this.scene.autoHook(this);
    this.commander = commander;
    this.visible = false;
    this.input = input;
    this.characterElement = $('#character');
    this.characterContentElement = $('#character-content');
    this.input.on('CharacterToggleRequest', this.onCharacterToggleRequest, this);
    this.charactersButton = $('#toolbar-character');
    this.charactersButton.click(_.bind(this.onCharacterToggleRequest, this));
  };
  
  Character.prototype = {
    onCharacterToggleRequest: function() {
      if(this.visible)
        this.hide();
      else
        this.show();
    },
    onItemEquipped: function(item, sender) {
      if(sender.id !== this.playerId) return;
      this.equipItem(item);    
    },
    onItemUnequipped: function(item, sender) {
      if(sender.id !== this.playerId) return;
      this.unequipItem(item);
    },
    equipItem: function(item) {
      var target = this.targetForItem(item);
      target.append(
        $('<img/>')
          .attr('src', this.scene.resources.get('main/' + item.pickupTexture + '.png').str())
          .addClass('equipped-item')
        );
      this.hookEventsForEquippedItem(target, item);
    },
    hookEventsForEquippedItem: function(container, item) {
      var img = container.find('img').get(0);
      var hammer = new Hammer(img);
      var self = this;
      hammer.ontap = function() {
        self.showItemDialog(container, item);
      };
    },
    showItemDialog: function(elem, item) {
      var self = this;
      UI.ShowContext({
          Unequip: function() {
            self.commander.dispatch('unequip', [item.equipType]);
          }
        },
        elem.offset().left,
        elem.offset().top
      );
    },
    unequipItem: function(item) {
      var target = this.targetForItem(item);
      target.html('');
    },
    targetForItem: function(item) {
      for(var key in EquipmentTypes) {
        var value = EquipmentTypes[key];
        if(value === item.equipType)
          return $('#character-' + key);
      }
    },
    show: function() {
      this.characterElement.show();
      this.visible = true;
    },
    hide: function() {
      this.characterElement.hide();
      this.visible = false;
    }
  };
  
  return Character;
});
