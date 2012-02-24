define(function(require) {

  var Eventable = require('../shared/eventable');
  var _ = require('underscore');
  var $ = require('jquery');

  var Input = function(element, context) {
    Eventable.call(this);
    this.element = $(element);
    this.context = context;
    this.hookElementEvents();
    this.mouseDown = false;
    this.mouseIn = false;
    this.lastPageX = 0;
    this.lastPageY = 0;
  };
  
  Input.prototype = {
    mouseInBounds: function(x, y) {
      if(x < this.element.left) return false;
      if(y < this.element.top) return false;
      if(x > this.element.left + this.element.width) return false;
      if(y > this.element.top + this.element.height) return false;
      return true;
    },
    getInputPageCoords: function() {
      return {
        x: this.lastPageX,
        y: this.lastPageY
      };
    },
    hookElementEvents: function() {
      var self = this;
      
      this.element.on({
        mousemove: function(e) {
          var deltaX = e.pageX - self.lastPageX;
          var deltaY = e.pageY - self.lastPageY;  
          if(self.mouseDown) {      
            self.raise('drag', {
              dx: deltaX,
              dy: deltaY,
              x: e.pageX,
              y: e.pageY
            });  
          } else {
            self.raise('move', {
              dx: deltaX,
              dy: deltaY,
              x: e.pageX,
              y: e.pageY
            }); 
          }
          self.lastPageX = e.pageX;
          self.lastPageY = e.pageY;
          return false;  
        },
        mouseleave: function(e) {
          self.mouseDown = false;
          self.mouseIn = false;
          self.raise('leave', {});  
          return false;  
        },
        mouseenter: function(e) {
          self.mouseDown = false;
          self.mouseIn = true;
          self.raise('enter', {});  
          return false;
        },
        click: function(e) {
          var offset = self.element.offset();     
          var transformed = self.context.pageCoordsToWorldCoords(e.pageX - offset.left, e.pageY - offset.top);
          self.raise('action', transformed);
        },
        mousedown: function(e) {
          self.mouseDown = true;
          return false;      
        },
        mouseup: function(e) {
          self.mouseDown = false;
          return false;      
        } 
      });
    }
  };
  
  _.extend(Input.prototype, Eventable.prototype);

  return Input;

});
