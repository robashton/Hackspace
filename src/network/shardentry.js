define(function(require) {
  var _ = require('underscore');
  var fs = require('fs');

  var Eventable = require('../shared/eventable');
  var ServerContext = require('../harness/servercontext');
  var Collider = require('../entities/collider');
  var God = require('../entities/god');
  var EquipWatcher = require('../entities/equipwatcher');
  var QuestWatcher = require('../entities/questwatcher');
  var QuestFactory = require('../scripting/questfactory');
  var InventoryWatcher = require('../entities/inventorywatcher');
  var EntitySpawner = require('../entities/entityspawner');
  var Map = require('../static/map');
  var StaticTileSource = require('../static/statictilesource');
  var Paths = require('../shared/paths');
  var ItemGeneration = require('../generation/itemgeneration');

  var ShardEntry = function(map, persistence) {
    Eventable.call(this);
    this.mapPath = map;
    this.communication = null;
    this.context = null;
    this.persistence = persistence;
    this.itemGeneration = new ItemGeneration();
    this.quests = null;
    this.inventories = null;
    this.equips = null;
    
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
      var self = this;
      self.loadMap(function() {
        self.populateScene(function() {

        });
      });
    },

    loadMap: function(cb) {
      this.tileData = [];

      // Obviously this is temporary, we'll do a pre-build
      // of tiles for a shard
      var loadMapTile = function(x, y) {
          var filename = Paths.filenameForTile(x, y);
          filename = 'src/apps/demo/dynamic/world/' + filename; 
          fs.readFile(filename, 'utf8', function(err, data) {
            if(err) throw err;

            var data = JSON.parse(data);
            this.tileData[x + y * 32] = data;
            x++;
            if(x === 32) {
              if(y === 31) {
                var tiles = new StaticTileSource({
                  tiledata: this.tileData,
                  tilecountwidth: 32,
                  tilecountheight: 32
                }, this.context.resources);
                this.map = new Map(tiles);
                this.context.scene.add(this.map);
                cb();
                return;
              } else {
                y++;
                x = 0;
              }
            }
            loadMapTile(x, y);
          }.bind(this));
      }.bind(this);
      loadMapTile(0,0);
    },

    populateScene: function() {
      for(var i in this.tileData) {
        var entities = this.tileData[i].entities;
        for(var id in entities) {
          var item = entities[id];
          var entity = this.context.createEntity(item.type, id, item.data);
          this.context.scene.add(entity);
        }
      } 
      
      this.context.scene.on('CommandDispatched', this.onSceneCommandDispatched, this);
           
      var collider = new Collider();
      this.context.scene.add(collider);
      var god = new God(this.context, this.itemGeneration);
      this.context.scene.add(god);    

      this.equips = new EquipWatcher(this.context.scene, this.persistence);      
      this.quests = new QuestWatcher(this.context.scene, this.persistence, new QuestFactory());
      this.inventories = new InventoryWatcher(this.context.scene, this.persistence);      
      this.persistence.startMonitoring(this.context.scene);
      
      this.raise('SceneLoaded');  
    },
    
    onSceneCommandDispatched: function(data) {
      this.communication.broadcastAll('CommandDispatch', {
        id: data.id,
        command: data.command,
        args: data.args
      });
      if(data.command === 'equip'){
        console.log(data.id, data.command, data.args);
      }
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
        map: this.mapPath,
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
          self.inventories.loadItemsForPlayer(id, function() {
            self.equips.loadEquipmentForCharacter(id, callback);
          });
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
    }
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
