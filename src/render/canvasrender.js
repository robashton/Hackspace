define(function(require) {
  var Shader = require('./shader');

  var CanvasRender = function(context, defaultShader) {
    this.context = context;
    this.context.clearColor(0.0, 1.0, 0.0, 1.0);
    this.defaultShader = defaultShader;
    this.createDefaultBuffers();
  };
  CanvasRender.prototype = {
    clear: function() {
      this.context.viewport(0, 0, this.context.width, this.context.height);
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    },
    draw: function(graph) {
      var self = this;

      this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);
      this.context.enable(this.context.BLEND);
      this.context.depthMask(false);

      // Upload the view/projection things
      this.defaultShader.activate();
      graph.uploadTransforms(this.defaultShader);

      // Upload the standard buffers
      this.defaultShader.uploadVertices(this.defaultVertexBuffer);
      this.defaultShader.uploadTextureCoords(this.defaultTextureBuffer);

      graph.pass(function(item) {
        item.render(self.defaultShader, self.context);
      });
    },
    createDefaultBuffers: function() {
      var vertexBuffer = this.context.createBuffer();
      this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(vertices), this.context.STATIC_DRAW);  
      
      var textureBuffer = this.context.createBuffer();
      this.context.bindBuffer(this.context.ARRAY_BUFFER, textureBuffer);
      this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(texcoords), this.context.STATIC_DRAW);

      this.defaultVertexBuffer = vertexBuffer;
      this.defaultTextureBuffer = textureBuffer;
    }
  };

  var vertices = [
     0.0, 0.0, 0.0,
     1.0, 0.0, 0.0,
     0.0, 1.0, 0.0,
     1.0, 1.0, 0.0
  ];

  var texcoords = [
     0.0, 0.0,
     1.0, 0.0,
     0.0, 1.0,
     1.0, 1.0
  ];        
        
  return CanvasRender;
});
