define(function(require) {
  var $ = require('jquery');

  var RenderingSettings = function(container) {
    this.container = container;
    this.aspectRatio = 0;
    this.availableWidth = 0;
    this.availableHeight = 0;
    this.resolutionWidth = 0;
    this.resolutionHeight = 0;
    this.quality = 0.5;
    this.update();
  };

  RenderingSettings.prototype = {
    update: function() {
      this.updateAvailableDimensions();
      this.updateAspectRatio();
      this.findAppropriateResolution();
    },
    updateAvailableDimensions: function() {
      this.availableWidth = this.container.width();
      this.availableHeight = this.container.height();
    },
    updateAspectRatio: function() {
      this.aspectRatio = this.availableWidth / this.availableHeight;
    },
    findAppropriateResolution: function() {
      this.resolutionWidth = this.availableWidth * this.quality;
      this.resolutionHeight = this.resolutionWidth / this.aspectRatio;
    },

    outputScaleFactor: function() {
      return 1.0 / this.quality;
    },

    backgroundScaleFactor: function() {
      return this.quality * 0.75;
    }
  };

  return RenderingSettings;
});