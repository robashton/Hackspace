define(function(require) {
  var LibraryItemTool = require('./libraryitemtool');
  var StaticElement = require('./staticelement');
  var DynamicElement = require('./dynamicelement');
  
  var ConstLibraryElements = {
   tree: new StaticElement({
      id: "tree",
      size: [ 25, 25, 50 ],
      collision: [12, 12],    
      texture: "/main/tree.png",
      solid: true
    }),
   spawnzone: new DynamicElement({
      id: "spawnzone",
      size: [ 12, 12, 25 ],
      collision: [12, 12],    
      texture: "/main/spider.png",
      data: {
        z: 0,
        radius: 100,
        type: 'monster',
        rate: 30,
        maxcount: 5,
        template: {
          texture: 'spider'
        } 
      }
   })
  };

  var Library = function(editor) {
    this.editor = editor;
    this.element = $('#library');
    this.populate();
  };
  
  Library.prototype = {
    getLibraryElement: function(id) {
      return ConstLibraryElements[id];
    },
    populate: function() {
      var self = this;
      
      this.element.html('');
      
      for(var i in ConstLibraryElements) {
        var item = ConstLibraryElements[i];
        
        var itemElement = $('<div/>')
            .addClass('library-element')
            .append(
              $('<img />')
                .attr('src', "data:image/png;base64," + this.editor.context.resources.getData(item.displayTexture()))
            )
            .data('element', item);
        this.element.append(itemElement);
       
      }
      
      $('.library-element').on('click', function() {
        var element = $(this).data('element');
        self.setCurrentElement(element);      
      });     
    },
    setCurrentElement: function(element) {
      var tool = new LibraryItemTool(this.editor, element);
      this.editor.setCurrentTool(tool);
    }
  };
  
  return Library;
  
});
