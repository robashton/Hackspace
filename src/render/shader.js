define(function() {
  
  var Shader = function(context, shader, fragment) {
    this.rawshader = shader;
    this.rawfragment = fragment;
    this.context = context;
    this.buildProgram();
    this.extractInputs();
  };

  Shader.prototype = {
    activate: function() {
      this.context.useProgram(this.program);
    },
    buildProgram: function() {
      var vertexShader = this.context.createShader(this.context.VERTEX_SHADER);
      this.context.shaderSource(vertexShader, this.rawshader);
      this.context.compileShader(vertexShader);
      
      var fragmentShader = this.context.createShader(this.context.FRAGMENT_SHADER);
      this.context.shaderSource(fragmentShader, this.rawfragment);
      this.context.compileShader(fragmentShader);
      
      var program = this.context.createProgram(); 

      this.context.attachShader(program, vertexShader);
      this.context.attachShader(program, fragmentShader);
      this.context.linkProgram(program);
      this.program = program;
    },
    extractInputs: function() {
      this.aVertexPosition = this.context.getAttribLocation(this.program, 'aVertexPosition');
      this.aTextureCoords = this.context.getAttribLocation(this.program, 'aTextureCoords');
      this.uTextureOne = this.context.getUniformLocation(this.program, 'uTextureOne');
      this.uProjection = this.context.getUniformLocation(this.program, 'uProjection');
      this.uView = this.context.getUniformLocation(this.program, 'uView');
      this.uWorld = this.context.getUniformLocation(this.program,'uWorld');
    },
    uploadWorldTransform: function(transform) {
      this.context.uniformMatrix4fv(this.uWorld, false, transform);
           
    },
    uploadProjectionTransform: function(projection) {
      this.context.uniformMatrix4fv(this.uProjection, false, projection);
    },
    uploadViewTransform: function(view) {
      this.context.uniformMatrix4fv(this.uView, false, view);
    },
    uploadTextureOne: function(texture) {
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D, texture);
      this.context.uniform1i(this.uTextureOne, 0);
    },
    uploadVertices: function(vertices) {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, vertices);
      this.context.vertexAttribPointer(this.aVertexPosition, 3, this.context.FLOAT, false, 0, 0);
      this.context.enableVertexAttribArray(this.aVertexPosition);   
    },
    uploadTextureCoords: function(textureCoords) {
      this.context.bindBuffer(this.context.ARRAY_BUFFER, textureCoords);
      this.context.vertexAttribPointer(this.aTextureCoords, 2, this.context.FLOAT, false, 0, 0);
      this.context.enableVertexAttribArray(this.this.aTextureCoords);
    }
  };

  return Shader;
});