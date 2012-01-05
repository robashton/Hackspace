define(function(require) {
  var Package = require('./package');
  var Eventable = require('../shared/eventable');
  var _ = require('underscore');
  var Texture = require('./texture');
  var JsonData = require('./jsondata');

  var PackagedResources = function() {  
    Eventable.call(this);
    this.loadedResources = {};
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
      var resource = this.createResource(k);
      this.loadedResources[k] = resource;
      resource.preload(function() {
        self.notifyResourceLoaded();
      });
    },
    createResource: function(path) {
      if(path.indexOf('.json') > 0) {
        return new JsonData(this, path);
      } else if(path.indexOf('.png') > 0) {
        return new Texture(this, path);
      }
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
      var loadedResource = this.loadedResources[path];
      if(!loadedResource) {
        console.log('Resource requested that does not exist: ' + path);
      }
      return loadedResource;
    },
    getData: function(path) {
      var pkg = _(this.loadedPackages).find(function(pkg) { return pkg.has(path); });
      return pkg.getData(path);
    }
  };
  _.extend(PackagedResources.prototype, Eventable.prototype);

  return PackagedResources;
});
