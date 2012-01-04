define(function(require) {

  var AddInstanceToMap = function(x, y, template) {
    this.x = x;
    this.y = y;
    this.template = template;  
  };
  
  AddInstanceToMap.prototype = {
    execute: function(editor) {
      editor.map.addStatic(this.template, this.x, this.y);
    }
  };
  
  return AddInstanceToMap;

});
