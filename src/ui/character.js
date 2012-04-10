define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var EquipmentTypes = require('../scripting/equipmenttypes');

  var Character = function(input, scene, playerId) {
    this.scene = scene;
    this.playerId = playerId;
    this.scene.autoHook(this);
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
