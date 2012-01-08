define(function(require) {
  var _ = require('underscore');

  var Item = function(id, template) {
    _.extend(this, template);
    this.id = id;    
  };
  
  Item.prototype = {
    
  };
  
  return Item;
});
