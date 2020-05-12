// asg3.js (2020) Josue Uriarte

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_Rotate2;
  uniform mat4 u_Rotate3;

  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_Rotate2 * u_GlobalRotateMatrix * u_ModelMatrix * (a_Position);
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_TextureNum;
  varying vec2 v_UV;
  void main(){

      if(u_TextureNum == -2){
        gl_FragColor = u_FragColor;
      }
      else if(u_TextureNum == -1){
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
      }
      else if(u_TextureNum == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
      }
      else if(u_TextureNum == 1){
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      }
      else if(u_TextureNum == 2){
        gl_FragColor = vec4(0.0,1.0, 1.0, 1.0);
      }
      else if(u_TextureNum == 3){
        gl_FragColor = texture2D(u_Sampler2, v_UV);
      }
      
  }`


//Global Variables for HTML
let slct_color = [1.0, 1.0, 1.0, 1.0];
let slct_size = 20;
let slct_type = 0;
let g_globalAngle = 0;
let g_globalAngle2 = 0;
let g_globalAngle3 = 0;
let g_FOV = 50;

function actionsForHtml(){

  //Camera Angle Events
  document.getElementById('cameraAngle').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('cameraAngle2').addEventListener('mousemove', function() {g_globalAngle2 = this.value; renderAllShapes(); });
  document.getElementById('FOV').addEventListener('mousemove', function() {g_FOV = this.value; renderAllShapes(); });

}

//Global Variables for canvas and GLSL values
let canvas;
let gl;

function setupWebGL(){
  // Retrieve <canvas> element
  // Get the rendering context for WebGL
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST)

}

//Global Variables for GLSL
let a_Position;
let a_UV;
let u_TextureNum;
let u_FragColor;
let u_ModelMatrix;
let u_Size;
let u_GlobalRotateMatrix;
let u_GlobalRotateMatrix2;

let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_TextureNum = gl.getUniformLocation(gl.program, 'u_TextureNum');
  if (!u_TextureNum) {
    console.log('Failed to get the storage location of u_TextureNum');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix2 = gl.getUniformLocation(gl.program, 'u_Rotate2');
  if (!u_GlobalRotateMatrix2) {
    console.log('Failed to get the storage location of u_Rotate2');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0){
    console.log("Failed to get storage location of u_Sampler0");
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler0){
    console.log("Failed to get storage location of u_Sampler1");
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2){
    console.log("Failed to get storage location of u_Sampler2");
    return false;
  }

  g_cam = new Camera();
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function main() {
  
  setupWebGL();
  connectVariablesToGLSL();
  actionsForHtml();

  document.onkeydown = keydown;

  initTextures(gl, 0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);

}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){

  g_seconds = performance.now()/600.0 - g_startTime;
  renderAllShapes();
  requestAnimationFrame(tick);

}

function initTextures(gl, n){

  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if(!image0 || !image1){
    console.long("Failed to create image object");
    return false;
  }

  image0.onload = function(){ sendTextureToGLSL(image0, u_Sampler0, 0); }
  image0.src = 'wall.jpg';

  image1.onload = function(){ sendTextureToGLSL(image1, u_Sampler1, 1); }
  image1.src = 'sky.jpg';

  image2.onload = function(){ sendTextureToGLSL(image2, u_Sampler2, 2); }
  image2.src = 'floor.png';

  return true;
}

function sendTextureToGLSL(image, Sampler, texUnit){

  var texture = gl.createTexture();
  var texture1 = gl.createTexture();
  var texture2 = gl.createTexture();
  if(!texture){
    console.long("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  if(texUnit == 0){
    gl.activeTexture(gl.TEXTURE0);

  }
  else if(texUnit == 1){
    gl.activeTexture(gl.TEXTURE1);
  }
  else if(texUnit == 2){
    gl.activeTexture(gl.TEXTURE2);
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(Sampler, texUnit);

  console.log('finished loadTexture');
}

var g_cam;

function renderAllShapes(){
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,-1,0);
  var globalRotMat2 = new Matrix4().rotate(g_globalAngle2,-1,0,0);
  //var globalRotMat3 = new Matrix4().rotate(g_globalAngle3,-1,0,0);

  var projMat = new Matrix4();
  projMat.setPerspective(g_FOV, canvas.width/canvas.height, .1, 1000)

  var viewMat = new Matrix4();
  //g_cam.eye.add(g_cam.at);
  viewMat.setLookAt(g_cam.eye.elements[0], g_cam.eye.elements[1], g_cam.eye.elements[2],
                    g_cam.at.elements[0],g_cam.at.elements[1],g_cam.at.elements[2],
                    g_cam.up.elements[0],g_cam.up.elements[1],g_cam.up.elements[2]);

  gl.uniformMatrix4fv(u_ProjectionMatrix,false,projMat.elements);
  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMat.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix2,false,globalRotMat2.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  drawCube();
  drawMap();
}

function keydown(ev){

  //Forward movement W-Key
  if(ev.keyCode == 87){
    g_cam.forward();
  }

  //Backwards movement S-key
  else if(ev.keyCode == 83){
    g_cam.backward();
  }

  //Left movement A-key
  else if(ev.keyCode == 65){
    g_cam.moveLeft();
  }

  //Right movement D-key
  else if(ev.keyCode == 68){
    g_cam.moveRight();
  }

  //Rotate left Q-key
  if(ev.keyCode == 81){
    g_cam.rotateLeft();
  }

  //Rotate right E-key
  if(ev.keyCode == 69){
    g_cam.rotateRight();
  }

  renderAllShapes();
}

function drawCube(){

  var floor = new Cube();
  floor.textureNum = 3;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(32, 0, 32);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  var sky = new Cube();
  sky.textureNum = 1;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -0.2, -.5);
  sky.render();
  
}

var g_map= [
[1, 1, 3, 1, 1, 1, 1, 1, 1, 4, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 4, 1, 3, 1, 1, 2, 1, 3, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 3, 0, 0, 0, 4, 0, 0, 0, 4, 0, 2, 0, 1, 3, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 4, 0, 5, 1],
[5, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
[1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0, 0, 3, 0, 4, 0, 1],
[1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
[1, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
[1, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 2],
[2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 1],
[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
[1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 3],
[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
[3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 2],
[1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 4],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 3, 0, 2, 0, 4, 5, 0, 2, 0, 3, 0, 6, 0, 6, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 3],
[1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
[1, 1, 1, 3, 1, 4, 1, 1, 2, 1, 3, 1, 2, 1, 2, 1, 4, 1, 1, 4, 1, 2, 1, 3, 1, 4, 1, 3, 1, 2, 1, 1],

];

function drawMap(){


  for (x=0 ;x<32; x++){

    for(y=0;y<32;y++){

      if(g_map[x][y] > 0){
        var body = new Cube();
        body.textureNum = 0;
        body.matrix.translate(0, -0.75, 0);
        body.matrix.translate(x-16, 0, y-16);
        body.renderFast();

        for(z=g_map[x][y] - 1; z != 0; z--){
          body.textureNum = 0;
          body.matrix.translate(0, 1, 0);
          body.renderFast();
        }
      }

    }
  }
}