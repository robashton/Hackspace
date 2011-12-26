define(function(require) {

  var Eventable = require('../shared/eventable');
  var $ = require('jquery');
  var _ = require('underscore');

  var InputTranslator = function(element) {
     Eventable.call(this);
     var self = this;
     
     this.element = $(element);
 
     this.element.click(function(e) {
      self.onMouseClick(e);
     });
  };
  
  InputTranslator.prototype = {
    onMouseClick: function(e) {
      this.raisePrimaryAction(e.clientX, e.clientY);
    },
    
    raisePrimaryAction: function(x, y) {
      this.raise('PrimaryAction', {
        x: x,
        y: y
      });
    }
  };
  _.extend(InputTranslator.prototype, Eventable.prototype);
  
  return InputTranslator;
});
