define(function(require) {
  var Package = require('./package');
  var Eventable = require('../shared/eventable');
  var _ = require('underscore');
  var Texture = require('./texture');

  var PackagedResources = function() {  
    Eventable.call(this);
    this.loadedTextures = {};
    this.loadedPackages = [];
    this.pendingPackageCount = 0;  
    this.pendingResourceCount = 0;
  };
  
  PackagedResources.prototype = {
    loadPackage: function(uri) {
      var self = this
      ,   pkg = new Package();

      this.loadedPackages.push(pkg);
      self.notifyPackageLoading();
      pkg.loadFrom(uri, function() {
        self.initializePackage(pkg);
      });
    },
    initializePackage: function(pkg) {
      var self = this;
      pkg.each(function(k) {
        self.preload(k);
      });
      self.notifyPackageLoaded();
    },
    preload: function(k) {
      var self = this;
      this.notifyResourceLoading();
      var texture = new Texture(this, k);
      this.loadedTextures[k] = texture;
      texture.preload(function() {
        self.notifyResourceLoaded();
      });
    },
    notifyResourceLoading: function() {
      this.pendingResourceCount++;
    },
    notifyResourceLoaded: function() {
      this.pendingResourceCount--;
      if(this.pendingPackageCount === 0 && this.pendingResourceCount === 0)
        this.raise('loaded');
    },
    notifyPackageLoading: function() {
      this.raise('loading');
      this.pendingPackageCount++;
    },
    notifyPackageLoaded: function() {
      this.pendingPackageCount--;
    },
    get: function(path) {
      var loadedTexture = this.loadedTextures[path];
      if(!loadedTexture) {
        console.log('Texture requested that does not exist: ' + path);
      }
      return loadedTexture;
    },
    getData: function(path) {
      var pkg = _(this.loadedPackages).find(function(pkg) { return pkg.has(path); });
      return pkg.getData(path);
    }
  };
  _.extend(PackagedResources.prototype, Eventable.prototype);

  return PackagedResources;
});
