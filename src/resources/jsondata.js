define(function(require) {
  var JsonData = function(factory, path) {
    this.path = path;
    this.factory = factory;
    this.data = null;
  };
  
  JsonData.prototype = {
    get: function() {
      return this.data;
    },
    
    preload: function(callback) {
     this.data = this.factory.getData(this.path);
     callback();
    },
  };
  
  return JsonData;
});
