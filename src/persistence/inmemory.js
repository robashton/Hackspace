define(function(require) {
  var _ = require('underscore');
  var fs = require('fs');
  var path = require('path');
   

  var InMemory = function() {
    this.scene = null;
    this.baseDir = 'data';
    this.loadedCharacters = {};
  };
  
  InMemory.prototype = {
  
    startMonitoring: function(scene) {
      var self = this;
      this.scene = scene;
      setInterval(function() {
        self.syncPlayersToDisk();
      }, 5000);
    },
    
    retrieveQuestsForPlayer: function(id, callback) {
      fs.readFile(this.pathToQuestsForPlayer(id), 'utf8', function(err, data) {
        if(err) { callback({}); return; }
        var quests = JSON.parse(data);
        callback(quests);
      });
    },
    
    saveQuestsForPlayer: function(id, quests, callback) {
      fs.writeFile(this.pathToQuestsForPlayer(id), JSON.stringify(quests), 'utf8', callback);
    },
    
    syncPlayersToDisk: function() {
      for(var i in this.loadedCharacters) {
        this.syncPlayer(i);
      }
    },
    
    syncPlayer: function(i) {
      var characterData = this.loadedCharacters[i];
      var entity = this.scene.get(i);
      if(!entity) {
        delete this.loadedCharacters[i];
        return;
      }      
      entity._out(characterData);
      fs.writeFile(this.pathToPlayer(i), JSON.stringify(characterData), 'utf8'); 
    },
  
    createPlayer: function(id, callback) {
      var data = { id: id };
      this.loadedCharacters[id] = data;
      fs.writeFile(this.pathToPlayer(id), JSON.stringify(data), 'utf8', function() {
        callback(data);
      });
    },
    
    playerExists: function(id, callback) {
      this.getPlayerData(id, function(data) {
        if(data)
          callback(true);
        else
          callback(false);
      });
    },
    
    getPlayerData: function(id, callback) {
      var self = this;
      if(this.loadedCharacters[id]) {
        process.nextTick(function() {
          callback(self.loadedCharacters[id]);
        });
        return;
      }
      fs.readFile(this.pathToPlayer(id), 'utf8', function(err, data) {
        if(err) { callback(null); return; }
        var character = JSON.parse(data);
        self.loadedCharacters[id] = character;
        callback(character);
      });
    },
    
    pathToPlayer: function(id) {
      return path.join(path.join(this.baseDir, 'characters'), id + '.json');
    },
    
    pathToQuestsForPlayer: function(id) {
      return path.join(path.join(this.baseDir, 'quests'), id + '.json');
    }
  }
  
  return InMemory;
  
});
