define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var $ = require('jquery');
  
  var DataEditor = function(editor) {
    Eventable.call(this);
    this.editor = editor;
    this.element = $('#data-editor');
    this.content = $('#data-editor-content');
    this.data = null;
    this.element.hide();
  };
  
  DataEditor.prototype = {
    edit: function(data) {
      this.data = data;
      this.content.text(JSON.stringify(this.data));
      this.element.show();
    },
    cancel: function() {
      this.data = null;
      this.element.hide();
    }
  };
  _.extend(DataEditor.prototype, Eventable.prototype);
  
  return DataEditor;
});
