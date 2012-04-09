define(function(require) {
  var $ = require('jquery');
  
  function createClickAction(cb) {
    return function() {
      var elem = $('#context-menu');
      elem.hide();
      if(cb) cb();
    };
  }

  function addOptionToCollection(items, name, cb) {
    items.append(
      $('<li/>')
      .text(name)
      .on('click', createClickAction(cb))
    );
  };

  function addOptionsToCollection(items, options) {
    for(var name in options){
      addOptionToCollection(items, name, options[name])
    }
  };

  return {
    ShowContext: function(options, x, y) {
      var elem = $('#context-menu');
      var items = elem.find('.items');
      items.html('');
      addOptionsToCollection(items, options);
      addOptionToCollection(items, 'Cancel');      
      elem.css({
        left: x + 'px',
        top: (y + 20) + 'px'
      });
      elem.show();
    }
  };
});