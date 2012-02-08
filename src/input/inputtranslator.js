define(function(require) {

  var Eventable = require('../shared/eventable');
  var $ = require('jquery');
  var _ = require('underscore');

  var InputTranslator = function(element) {
     Eventable.call(this);
     var self = this;
     
     this.element = $(element);
     
     this.element.on({
      click: function(e) {
        var offset = self.element.offset();     
        self.raisePrimaryAction(e.pageX - offset.left, e.pageY - offset.top);
      },
      mousemove: function(e) {
        var offset = self.element.offset();     
        self.raiseHover(e.pageX - offset.left, e.pageY - offset.top);
      }
    });
    $(document).on({
      keydown: function(e) {
        switch(e.keyCode) {
          case 73: 
            self.raiseToggleInventory();
            break;
          case 81:
            self.raiseToggleQuests();
          default:
            return;
        }     
      }    
    });
  };
  
  InputTranslator.prototype = {
    raisePrimaryAction: function(x, y) {
      this.raise('PrimaryAction', {
        x: x,
        y: y
      });
    },
    raiseHover: function(x, y) {
      this.raise('Hover', {
        x: x,
        y: y
      });
    }, 
    raiseToggleInventory: function() {
      this.raise('InventoryToggleRequest');
    },
    raiseToggleQuests: function() {
      this.raise('QuestsToggleRequest');
    }
  };
  _.extend(InputTranslator.prototype, Eventable.prototype);
  
  return InputTranslator;
});
