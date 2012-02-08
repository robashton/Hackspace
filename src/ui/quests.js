define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');

  var Quests = function(input, scene, playerId) {
    this.scene = scene;
    this.playerId = playerId;
    this.scene.autoHook(this);
    this.visible = false;
    this.input = input;
    this.questElement = $('#quests');
    this.questContentElement = $('#quests-content');
    this.input.on('QuestsToggleRequest', this.onQuestsToggleRequest, this);
  };
  
  Quests.prototype = {
    onQuestStarted: function(info, sender) {
      if(sender.id !== this.playerId) return;
      this.addItem(info);
    },
    onQuestUpdated: function(info, sender) {     
     if(sender.id !== this.playerId) return;
      var html = this.createHtmlForItem(info);
      $('#' + info.meta.id).replaceWith(html);
    },
    onQuestDataUpdated: function(data, sender) {
      if(sender.id !== this.playerId) return;
      for(var id in data) {
        this.addItem(data[id]);
      }
    },  
    onQuestsToggleRequest: function() {
      if(this.visible)
        this.hide();
      else
        this.show();
    },
    addItem: function(info) {
      var html = this.createHtmlForItem(info);
      this.questContentElement.append(html); 
    },    
    createHtmlForItem: function(item) {
      var html = $('<div/>');
      html.attr('id', item.meta.id);
      html.text(item.meta.title);
      html.addClass('quest');
      if(item.complete)
        html.addClass('complete');
        
      return html;
    },
    show: function() {
      this.questElement.show();
      this.visible = true;
    },
    hide: function() {
      this.questElement.hide();
      this.visible = false;
    }
  };
  
  return Quests;
});
