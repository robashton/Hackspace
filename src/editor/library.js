define(function(require) {
  var LibraryItemTool = require('./libraryitemtool');
  var StaticElement = require('./staticelement');
  var EntityElement = require('./entityelement');
  var $ = require('jquery');

  var Library = function(editor) {
    this.editor = editor;
    this.element = $('#library');
    this.ConstLibraryElements = {};
    this.loadLibrary();
  };
  
  Library.prototype = {
    loadLibrary: function() {
      $.getJSON('services/getlibrary', this.populateLibrary.bind(this));
    },
    populateLibrary: function(data) {
      for(var i in data) {
        var item = data[i];
        switch(item.type) {
          case 'static':
            this.ConstLibraryElements[i] = new StaticElement(item.template);
            break;
          case 'entity':
            this.ConstLibraryElements[i] = new EntityElement(this.editor, item.template);
            break;
          default:
            throw "Unrecognised library item type";
        }
      }
      this.populateDisplay();
    },
    getLibraryElement: function(id) {
      return this.ConstLibraryElements[id];
    },
    populateDisplay: function() {
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
