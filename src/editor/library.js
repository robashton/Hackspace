define(function(require) {
  var LibraryItemTool = require('./libraryitemtool');
  var StaticElement = require('./staticelement');
  var EntityElement = require('./entityelement');
  
  var Library = function(editor) {
    this.editor = editor;
    this.element = $('#library');
    this.ConstLibraryElements = {
     tree: new StaticElement({
        id: "tree",
        size: [ 25, 25, 50 ],
        collision: [12, 12],    
        texture: "/main/tree.png",
        solid: true
      }),
     spawner: new EntityElement(editor, {
        id: "spawnzone",
        size: [ 12, 12, 25 ],
        collision: [12, 12],    
        texture: "/main/spider.png",
        type: 'spawner',
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
     }),
     npc: new EntityElement(editor, {
      id: "npc",
      size: [12, 12, 18],
      collision: [12, 12],
      texture: "/main/character/static-down.png",
      type: "npc",
      data: {
        quest: 'fetchducks' 
        z: 0      
      } 
     })
    };
    this.populate();
  };
  
  Library.prototype = {
    getLibraryElement: function(id) {
      return this.ConstLibraryElements[id];
    },
    populate: function() {
      var self = this;
      
      this.element.html('');
      
      for(var i in this.ConstLibraryElements) {
        var item = this.ConstLibraryElements[i];
        
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
    },
    createInstanceForEntityType: function(type) {
      var libraryElement = this.ConstLibraryElements[type];
      if(!libraryElement) {
        console.error('Could not find library element', type);
      }
      return libraryElement.createEditorInstance();
    }
  };
  
  return Library;
  
});
