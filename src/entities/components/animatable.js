define(function(require) {
  var _ = require('underscore');

  var Animatable = function(textureName) {
    this.currentAnimation = 'static';
    this.currentAnimationRate = 15;
    this.currentFrame = -1;
    this.textureName = textureName;
    this.currentMaxFrame = 0;
    this.meta = null;
    this.scene = null;
    this.ticks = 0;
  };
  
  Animatable.prototype = {
    cancelAnimations: function() {
      this.startAnimation('static');
    },
    startAnimation: function(animation, rate) {
      this.parent.raise('AnimationChanged', {
        animation: animation,
        rate: rate || 100
      });
    },
    onAnimationChanged: function(data) {
      this.currentAnimation = data.animation;
      this.currentAnimationRate = data.rate;
      this.ticks = 0;
      this.currentMaxFrame = this.meta[this.currentAnimation].frameCount;
      this.setCurrentFrameAt(this.currentMaxFrame === 0 ? -1 : 0);
    },
    onTick: function() {
      var totalFrames = parseInt(this.ticks++ / this.currentAnimationRate);
      var frame = -1; 
      
      if(this.currentMaxFrame > 0)
        frame = totalFrames % this.currentMaxFrame;
                  
      this.setCurrentFrameAt(frame);
    },
    setCurrentFrameAt: function(frame) {
      if(frame !== this.currentFrame)
        this.parent.raise('AnimationFrameChanged', frame); 
    },
    onAnimationFrameChanged: function(frame) {
      this.currentFrame = frame;
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.meta = scene.resources.get('/main/' + this.textureName + '/meta.json').get();
    }
  };
  
  return Animatable;
});
