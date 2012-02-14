define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var ServerContext = require('../harness/servercontext');
  var Collider = require('../entities/collider');
  var God = require('../entities/god');
  var QuestWatcher = require('../entities/questwatcher');
  var QuestFactory = require('../scripting/questfactory');
  var InventoryWatcher = require('../entities/inventorywatcher');
  var EntitySpawner = require('../entities/entityspawner');
  
  var ShardEntry = function(map, persistence) {
    Eventable.call(this);
    this.map = map;
    this.communication = null;
    this.context = null;
    this.persistence = persistence;
    this.quests = null;
    this.inventories = null;
    
    this.setupScene();
  };
  
  ShardEntry.prototype = {
    setupScene: function() {
      var self = this;
      this.context = new ServerContext({
        start: function(context) {
          self.context = context;
          self.initializeScene();
      }});
    },
    
    initializeScene: function() {
      var entities = this.getDefaultSceneData();
      for(var id in entities) {
        var item = entities[id];
        var entity = this.context.createEntity(item.type, id, item.data);
        this.context.scene.add(entity);       
      }
      
      this.context.scene.on('CommandDispatched', this.onSceneCommandDispatched, this);
           
      var collider = new Collider();
      this.context.scene.add(collider);
      var god = new God(this.context.entityFactory);
      this.context.scene.add(god);    
      
      this.quests = new QuestWatcher(this.context.scene, this.persistence, new QuestFactory());
      this.inventories = new InventoryWatcher(this.context.scene, this.persistence);      
      this.persistence.startMonitoring(this.context.scene);   
      
      

      // And the fixed spawners for now
      var spiderSpawner = new EntitySpawner('spiders-one', {
        x: 1000,
        y: 1000,
        z: 0,
        radius: 100,
        type: 'monster',
        rate: 30,
        maxcount: 5,
        template: {
          texture: 'spider'
        } 
      });
      this.context.scene.add(spiderSpawner);
      
      this.raise('SceneLoaded');  
    },
    
    onSceneCommandDispatched: function(data) {
      this.communication.broadcastAll('CommandDispatch', {
        id: data.id,
        command: data.command,
        args: data.args
      });
    },
    
    onStartup: function(communication) {
      this.communication = communication;
    },
    
    onNewSocket: function(socket) {
      this.handleNewSocket(socket);
      var self = this;
      socket.on('CommandDispatch', function(data) {   
        socket.get('Username', function(err, username) {
          self.context.scene.dispatch(username, data.command, data.args);
        });   
      });
    },
    
    onSocketLost:  function(socket) {
      this.handleDisconnectedSocket(socket);
    }, 
        
    handleNewSocket: function(socket) {
      var self = this;
      socket.on('Ready', function() {
        socket.get('Username', function(err, username) {
          self.addPlayerToScene(username, function() {
            self.initializePlayer(socket, username);
          });
        });    
      });
    },
    
    initializePlayer: function(socket, id) {
      var data = {
        playerid: id,
        map: this.map,
        entities: this.context.getSerializedEntities()
      };
      socket.emit('Init', data);
      socket.broadcast.emit('PlayerJoined', this.context.getSerialisedEntity(id));
      this.sendFurtherStateToPlayer(id, function() {
        socket.emit('Start');
      });
    },
    
    sendFurtherStateToPlayer: function(id, callback) {
      var self = this;
      this.quests.loadQuestsForPlayer(id, function() {
          self.inventories.loadItemsForPlayer(id, callback);
      });
    },
    
    handleDisconnectedSocket: function(socket) {
      var self = this;
      socket.get('Username', function(err, username) {
        self.persistence.syncPlayer(username);
        self.inventories.unloadItemsForPlayer(username);
        self.quests.unloadQuestsForPlayer(username);
        self.context.scene.withEntity(username, function(entity) {
          self.context.scene.remove(entity);
        });
        socket.broadcast.emit('PlayerLeft', username);
      });
    },

    addPlayerToScene: function(id, callback) {
      var self = this;
      this.persistence.playerExists(id, function(exists) {    

        if(exists) 
          self.loadExistingPlayerIntoScene(id, callback);
        else
          self.createNewPlayerIntoScene(id, callback);
      });
    },
    
    loadExistingPlayerIntoScene: function(id, callback) {
      var self = this;
      this.persistence.getPlayerData(id, function(data) {
        var entity = self.context.createEntity('character', id, data);
        entity._in(data);
        self.context.scene.add(entity); 
        callback();
      });
    },
    
    createNewPlayerIntoScene: function(id, callback) {
      // Create in tutorial village ;-)
      var self = this;
      this.persistence.createPlayer(id, function(data) {
        data.x = 0;
        data.y = 0;
        var entity = self.context.createEntity('character', id, data);
        self.context.scene.add(entity);
        callback();
      });
    },    
    
    getDefaultSceneData: function() {

     var entities = {
        'quest-giver': {
          type: 'npc',
          data: {
            x: 150,
            y: 100
          }
        }    
      };               

      return entities;   
    }
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
