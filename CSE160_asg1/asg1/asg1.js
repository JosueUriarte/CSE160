// asg1.js (2020) Josue Uriarte

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;   // Set the vertex coordinates of the point
    gl_PointSize = u_Size;          // Set the point size
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
      gl_FragColor = u_FragColor; // Set the point color
  }`

function setupWebGL(){
  // Retrieve <canvas> element
  // Get the rendering context for WebGL
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

}

//Global Variables for HTML
let slct_color = [1.0, 1.0, 1.0, 1.0];
let slct_size = 20;
let slct_segment = 20;
let slct_type = 0;

function actionsForHtml(){

  //Clear Canvas Events
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes()};

  //Drawing Mode Events
  document.getElementById('squareButton').onclick = function() {slct_type = 0};
  document.getElementById('triangleButton').onclick = function() {slct_type = 1};
  document.getElementById('circleButton').onclick = function() {slct_type = 2};
  document.getElementById('sprayButton').onclick = function() {slct_type = 3};
  document.getElementById('mysteryButton').onclick = function() {slct_type = 4};

  //Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() {slct_color[0] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() {slct_color[2] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {slct_color[1] = this.value/100;});
  
  //Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {slct_size = this.value;});

  //Segments Slider Events
  document.getElementById('segmentSlide').addEventListener('mouseup', function() {slct_segment = this.value;});
}

//Global Variables for Points and Colors
var g_shapesList = [];

//Global Variables for canvas and GLSL values
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function main() {
  
  setupWebGL();
  connectVariablesToGLSL();
  actionsForHtml();

  //Mouse actions
  canvas.onclick = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) }};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

}

function click(ev){

  let [x,y] = convertCoordinatesEventToGL(ev);
  let point;

  if(slct_type == 0){
    point = new Point();
  }

  else if(slct_type == 1){
    point = new Triangle();
  }

  else if(slct_type == 2){
    point = new Circle();
    point.segments = slct_segment;
  }

  else if(slct_type == 3){
    point = new Spray();
  }

  else if(slct_type == 4){
    point = new Mystery();
  }

  point.position = [x,y];
  point.color = slct_color.slice();
  point.size = slct_size;
  g_shapesList.push(point);

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

}
