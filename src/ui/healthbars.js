define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Coords = require('../shared/coords');
   

  var Healthbars = function(context) {
    this.context = context;
    this.scene = context.scene;
    this.healthbars = {};
    this.scene.autoHook(this);
  };
  
  Healthbars.prototype = {
    onHealthLost: function(amount, sender) {
      this.registerHealthBar(sender.id);
    },
    onPostRender: function() {
      for(var i in this.healthbars)
        this.updateHealthBar(i);  
    },
    onDeath: function(data, sender) {
      this.removeHealthBar(sender.id);
    },
    registerHealthBar: function(id) {
      if(this.healthbars[id])
        this.updateHealthBar(id);
      else
        this.createHealthBar(id);
    },
    updateHealthBar: function(id) {
      var entity = this.scene.get(id);
      if(!entity) {
        this.removeHealthBar(id);
        return;
      }
      var currentHealth = entity.get('CurrentHealth');
      var maxHealth = entity.get('MaxHealth');
      var percentage = (currentHealth / maxHealth);
      var bounds = entity.get('Bounds');
      var screen = this.context.worldCoordsToPageCoords(bounds.x - bounds.width / 4.0, bounds.y + bounds.height / 4.0);
      var size = this.context.worldScaleToPage(bounds.width, bounds.height);
      var colour = ''
      
      if(percentage > 0.75)
        colour = '#00FF00';
      else if (percentage > 0.30)
        colour = '#FFFF00';
      else
        colour = '#FF0000';            
      
      var bar = this.healthbars[id];
      bar.css('left', screen.x)
         .css('top', screen.y + 2)
         .css('width', size.width * percentage)
         .css('background-color', colour);
      
    },
    removeHealthBar: function(id) {
      var bar = this.healthbars[id];
      bar.remove();
      delete this.healthbars[id];
    },
    createHealthBar: function(id) {
      var bar = $('<div/>')
                  .addClass('healthbar')
                  .attr('id', 'healthbar-' + id)
                  .appendTo('#container');
                  
      this.healthbars[id] = bar;
      this.updateHealthBar(id);
    }
  };
  
  return Healthbars;
});
