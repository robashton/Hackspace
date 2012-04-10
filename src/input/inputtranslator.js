define(function(require) {

  var Eventable = require('../shared/eventable');
  var $ = require('jquery');
  var _ = require('underscore');
  var Hammer = require('hammer');

  var InputTranslator = function(element) {
     Eventable.call(this);
     var self = this;
     
     this.element = $(element);

     this.element.on({
      // click: function(e) {
      //   var offset = self.element.offset();     
      //   self.raisePrimaryAction(e.pageX - offset.left, e.pageY - offset.top);
      // },
      mousemove: function(e) {
        var offset = self.element.offset();     
        self.raiseHover(e.pageX - offset.left, e.pageY - offset.top);
      }
    });

    var hammer = new Hammer(element, {
      prevent_default: true
    });    

    hammer.ontap = function(e) {
      self.raisePrimaryAction(e.position[0].x, e.position[0].y);
    };

    var startScale = 1.0;
    var currentScale = 1.0;
    
    // on start transform
    hammer.ontransformstart = function(ev) {
      startScale = currentScale;
    }

    // on transform
    hammer.ontransform = function(ev) {
      if(ev.scale){
        currentScale = startScale * ev.scale;
        currentScale = currentScale < 1 ? 1 : (currentScale > 2 ? 2 : currentScale);
      }
      self.raiseZoom(currentScale);
    }
    
    $(document).on({
      keydown: function(e) {
        switch(e.keyCode) {
          case 73: 
            self.raiseToggleInventory();
            break;
          case 81:
            self.raiseToggleQuests();
            break;
          case 67:
          self.raiseToggleCharacter();
            break;
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
    },
    raiseToggleCharacter: function() {
      this.raise('CharacterToggleRequest');
    },
    raiseZoom: function(zoom) {
      this.raise('Zoom', zoom);
    }
  };
  _.extend(InputTranslator.prototype, Eventable.prototype);
  
  return InputTranslator;
});
