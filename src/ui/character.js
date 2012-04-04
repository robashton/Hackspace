define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');

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
