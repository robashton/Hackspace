define(function(require) {

  var _ = require('underscore');

  var Conversational = function(conversations) {
    this.scene = null;
    this.conversations = conversations;
  };
  
  Conversational.prototype = { 
           
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    canBeSpokenTo: function() {
      return true;
    },
    
    initiateConversationWith: function(entityId) {
      if(this.attemptAutoStart(entityId)) return;
      this.showConversationListTo(entityId);      
    },
    attemptAutoStart: function(entityId) {
      var autoConverse = _(this.conversations).find(function(convo) {
        return convo.autoStartsFor(entityId);
      });
      if(autoConverse) {
        this.startConversation(entityId, autoConverse);
      };
      return !!autoConverse;
    },
    showConversationListTo: function(entityId) {
      var appropriateConversations = _(this.conversations).filter(function(convo) {
        return convo.isAppropriateFor(entityId);
      });      
    },
    startConversation: function(entityId, convo) {
      convo.run(entityId);
    }
  };  
  
  return Conversational;
  
});
