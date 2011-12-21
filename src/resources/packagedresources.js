define(function(require) {
  var Package = require('./package');
  var Eventable = require('../shared/eventable');
  var _ = require('underscore');
  var Texture = require('./texture');

  var PackagedResources = function() {  
    this.loadedTextures = {};
    this.loadedPackages = [];
    this.pendingPackageCount = 0;  
  };
  
  PackagedResources.prototype = {
    loadPackage: function(uri) {
      var self = this
      ,   pkg = new Package();

      this.loadedPackages.push(pkg);
      self.notifyPackageLoading();
      pkg.loadFrom(uri, function() {
        self.notifyPackageLoaded();
      });
    },
    notifyPackageLoading: function() {
      this.raise('loading');
      this.pendingPackageCount++;
    },
    notifyPackageLoaded: function() {
      this.pendingPackageCount--;
      if(this.pendingPackageCount === 0)
        this.raise('loaded');
    },
    get: function(path) {
      var loadedTexture = this.loadedTextures[path];
      if(!loadedTexture) {
        this.loadedTextures[path] = new Texture(this, path);
        loadedTexture = this.loadedTextures[path];
      }
      return loadedTexture;
    },
    getData: function(path) {
      var pkg = _(this.loadedPackages).find(function(pkg) { return pkg.has(path); });
      return pkg.getData(path);
    }
  };
  Eventable.call(PackagedResources.prototype);

  return PackagedResources;
});
