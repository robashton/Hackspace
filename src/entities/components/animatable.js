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
    this.playOnce = false;
  };
  
  Animatable.prototype = {
    cancelAnimations: function() {
      this.startAnimation('static');
    },
    startAnimation: function(animation, rate) {
      this.parent.raise('AnimationChanged', {
        animation: animation,
        rate: rate || 100,
        playOnce: false
      });
    },
    onAnimationChanged: function(data) {
      this.currentAnimation = data.animation;
      this.currentAnimationRate = data.rate;
      this.playOnce = data.playOnce;
      this.ticks = 0;
      this.currentMaxFrame = this.meta.frameCountForAnimation(this.currentAnimation);
      this.setCurrentFrameAt(this.currentMaxFrame === 0 ? -1 : 0);
    },
    onTick: function() {
      var totalFrames = parseInt(this.ticks++ / this.currentAnimationRate);
      var frame = -1; 
      
      if(totalFrames > this.currentMaxFrame && this.playOnce) {
        this.cancelAnimations();
        return;
      }
      
      if(this.currentMaxFrame > 0)
        frame = totalFrames % this.currentMaxFrame;
                  
      this.setCurrentFrameAt(frame);
    },
    playAnimation: function(animation, rate) {
      this.parent.raise('AnimationChanged', {
        animation: animation,
        rate: rate || 100,
        playOnce: true
      });
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
      this.meta = scene.resources.get('/main/' + this.textureName + '/meta.json');
    }
  };
  
  return Animatable;
});
