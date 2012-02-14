define(function(require) {
  var _ = require('underscore');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  
  var ModelProvider = function(templates) {
    this.templates = templates;
    this.models = {};  
  };
  
  ModelProvider.prototype = {
    createModels: function(resources) {
      this.models = {};
      for(var t in this.templates) {
        var template = this.templates[t];
        this.createModelForTemplate(resources, template);     
      }
      this.createModelForTemplate(resources, {
        id: 'testtile',
        texture: '/main/testtile.png'
      });
    },
    createModelForTemplate: function(resources, template) {
      var material = new Material();
      material.diffuseTexture = resources.get(template.texture);
      this.models[template.id] = new Quad(material);
      return this.models[template.id];
    },
    getModel: function(id) {
      return this.models[id];
    },
    getTemplate: function(id) {
      return this.templates[id];
    }
  };
  
  return ModelProvider;
});
