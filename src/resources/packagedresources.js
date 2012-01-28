define(function(require) {
  var Eventable = require('../shared/eventable');
  var _ = require('underscore');

  var PackagedResources = function(packageFactory) {  
    Eventable.call(this);
    this.loadedResources = {};
    this.loadedPackages = [];
    this.pendingPackageCount = 0;  
    this.pendingResourceCount = 0;
    this.packageFactory = packageFactory;
  };
  
  PackagedResources.prototype = {
    loadPackage: function(uri) {
      var self = this
      ,   pkg = this.packageFactory();

      this.loadedPackages.push(pkg);
      self.notifyPackageLoading();
      pkg.loadFrom(uri, function() {
        self.initializePackage(pkg);
      });
    },
    initializePackage: function(pkg) {
      var self = this;
      pkg.each(function(k) {
        self.preload(k, pkg);
      });
      self.notifyPackageLoaded();
    },
    preload: function(k, pkg) {
      var self = this;
      this.notifyResourceLoading();
      var resource = pkg.createResource(k);
      this.loadedResources[k] = resource;
      resource.preload(function() {
        self.notifyResourceLoaded();
      });
    },
    notifyResourceLoading: function() {
      this.pendingResourceCount++;
    },
    notifyResourceLoaded: function() {
      this.pendingResourceCount--;
      this.checkIfLoaded();
    },
    notifyPackageLoading: function() {
      this.raise('loading');
      this.pendingPackageCount++;
    },
    notifyPackageLoaded: function() {
      this.pendingPackageCount--;
      this.checkIfLoaded();
    },
    checkIfLoaded: function() {
      if(this.pendingPackageCount === 0 && this.pendingResourceCount === 0)
        this.raise('loaded');
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
