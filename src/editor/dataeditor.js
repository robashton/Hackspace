define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var $ = require('jquery');
  var FormatJson = require('../libs/formatjson');
  
  var DataEditor = function(editor) {
    Eventable.call(this);
    this.editor = editor;
    this.element = $('#data-editor');
    this.content = $('#data-editor-content');
    this.data = null;
    this.element.hide();
    var self = this;
    this.content.on('keyup', function() { 
      self.onKeyPress();
    });
  };
  
  DataEditor.prototype = {
    edit: function(data) {
      this.data = data;
      var text = FormatJson(this.data);
      this.content.val(text);
      this.element.show();
    },
    cancel: function() {
      this.data = null;
      this.element.hide();
    },
    onKeyPress: function() {
      var newData = null;
      if(this.data) {
        try {
          newData = JSON.parse(this.content.val());
        } catch(ex) {
          console.warn(ex);
        }
        if(newData) {
          this.data = newData;
          this.raise('DataChanged', this.data);
        }
      }
    }
  };
  _.extend(DataEditor.prototype, Eventable.prototype);
  
  return DataEditor;
});
