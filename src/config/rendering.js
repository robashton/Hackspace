define(function(require) {
  var $ = require('jquery');
  var Eventable = require('../shared/eventable');

  var RenderingSettings = function(canvas) {
    Eventable.call(this);

    this.canvas = canvas;
    this.aspectRatio = 0;
    this.availableWidth = 0;
    this.availableHeight = 0;
    this.resolutionWidth = 0;
    this.resolutionHeight = 0;
    this.quality = 0.99;
    this.update();
    this.hookEvents();
  };

  RenderingSettings.prototype = {
    update: function() {
      this.updateAvailableDimensions();
      this.updateAspectRatio();
      this.findAppropriateRenderingResolution();
      this.updateCanvasCss();
    },
    updateAvailableDimensions: function() {
      var rawWidth = this.canvas.parent().width();
      var rawHeight = this.canvas.parent().height();

      // TODO: Maybe only support a range
      this.availableWidth = rawWidth;
      this.availableHeight = rawHeight;
    },
    updateAspectRatio: function() {
      this.aspectRatio = this.availableWidth / this.availableHeight;
    },
    findAppropriateRenderingResolution: function() {
      this.resolutionWidth = this.availableWidth * this.quality;
      this.resolutionHeight = this.resolutionWidth / this.aspectRatio;
    },
    updateCanvasCss: function() {
      this.canvas.css({
        'width': this.resolutionWidth + 'px',
        'height': this.resolutionHeight + 'px',
        // TODO: Other browsers
        '-webkit-transform-origin-x': '0px',
        '-webkit-transform-origin-y': '0px',
        '-webkit-transform': 'scale(' + this.outputScaleFactor() + ',' + this.outputScaleFactor() + ')'
      });
    },
    outputScaleFactor: function() {
      return 0.99 / this.quality;
    },

    backgroundScaleFactor: function() {
      return this.quality * 0.75;
    },
    scaledCanvasWidth: function() {
      return this.resolutionWidth * this.outputScaleFactor();
    },
    scaledCanvasHeight: function() {
      return this.resolutionHeight * this.outputScaleFactor();
    },
    hookEvents: function() {
      var self = this;

      /*
      this.canvas.parent().resize(function(){
        console.log('ag');
        self.update();
      });

      // this.canvas.parent().resize(function() {
      //      self.update();
      // }); */ // TODO: Google
    }
  };
  _.extend(RenderingSettings.prototype, Eventable.prototype);

  return RenderingSettings;
});