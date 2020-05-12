// asg2.js (2020) Josue Uriarte

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_Rotate2;
  void main() {
    gl_Position = u_Rotate2 * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;   // Set the vertex coordinates of the point
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
      gl_FragColor = u_FragColor; // Set the point color
  }`

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

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix2 = gl.getUniformLocation(gl.program, 'u_Rotate2');
  if (!u_GlobalRotateMatrix2) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

//Global Variables for HTML
let slct_color = [1.0, 1.0, 1.0, 1.0];
let slct_size = 20;
let slct_type = 0;
let g_globalAngle = 0;
let g_globalAngle2 = 0;
let g_rotate = 1;
let g_rotate2 = 0;
let g_rotate3 = 1;
let g_rotate4 = 1;
let legSpeed = 1;
let g_animation = false;

function actionsForHtml(){

  //Button Animation Events
  document.getElementById('ON').onclick = function() {g_animation = true;};
  document.getElementById('OFF').onclick = function() {g_animation = false;};

  //Rotate Slider Events
  document.getElementById('rotateSlide').addEventListener('input', function() {g_rotate = this.value; renderAllShapes();});
  document.getElementById('rotateSlide2').addEventListener('input', function() {g_rotate2 = this.value; renderAllShapes();});
 
  //Camera Angle Events
  document.getElementById('cameraAngle').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('cameraAngle2').addEventListener('mousemove', function() {g_globalAngle2 = this.value; renderAllShapes(); });

  //Leg Speed Events
  document.getElementById('speed').addEventListener('input', function() {legSpeed = this.value; renderAllShapes();});

}

let a_Position;
let u_FragColor;
let u_Size;
let u_GlobalRotateMatrix;
let u_GlobalRotateMatrix2;

function main() {
  
  debugger;
  setupWebGL();
  connectVariablesToGLSL();
  actionsForHtml();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //renderAllShapes();
  requestAnimationFrame(tick);

}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){

  g_seconds = legSpeed * performance.now()/600.0 - g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);

}

function updateAnimationAngles(){
  if(g_animation){
    g_rotate = (5 * Math.sin(g_seconds*2));
    g_rotate2 = (8 * Math.sin(g_seconds));
    g_rotate3 = (45 * Math.sin(g_seconds/1.85));
    g_rotate4 = (-45 * Math.sin(g_seconds/1.85));
  }
}

function renderAllShapes(){

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,-1,0);
  var globalRotMat2 = new Matrix4().rotate(g_globalAngle2,-1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix2,false,globalRotMat2.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  drawBody();
  drawLeftEye();
  drawRightEye();
  drawLeftLeg();
  drawRightLeg();

}

function drawBody(){

  var base = new Cube();
  base.color = [0.3922, .9137, .5255, 1];
  base.matrix.translate(-.2,-.5,g_rotate/500);
  base.matrix.scale(0.4,.06,.9);
  base.render();

  var blue_base = new Cube();
  blue_base.color = [0, .1765, .9804, .55];
  blue_base.matrix.translate(-.175,-.45,0.05);
  blue_base.matrix.scale(.35,.085,.8);
  blue_base.render();

  drawShell();
}

function drawLeftEye(){

  var l_stem = new Cube();
  l_stem.color = [0, .1765, .9804, .55];
  l_stem.matrix.translate(-.12,-.37,0.08);
  l_stem.matrix.rotate(g_rotate2,0,0,1);
  var stem_matrix = new Matrix4(l_stem.matrix);
  l_stem.matrix.scale(.04,.2,0.05);
  l_stem.render();

  var l_stem2 = new Cube();
  l_stem2.color = [0, .1765, .9804, .55];
  l_stem2.matrix = stem_matrix;
  l_stem2.matrix.translate(-.001,.2,0.001);
  l_stem2.matrix.rotate(g_rotate,0,0,1);
  var l_stem2_matrix = new Matrix4(l_stem2.matrix);
  l_stem2.matrix.scale(.04,.1,0.05);
  l_stem2.render();

  var l_eyeball = new Cube();
  l_eyeball.color = [1, 1, 1, 1];
  l_eyeball.matrix = l_stem2_matrix;
  l_eyeball.matrix.translate(-.035,.05,-0.03);
  var l_eyeball_matrix = new Matrix4(l_eyeball.matrix);
  l_eyeball.matrix.scale(.1,.1,.1);
  l_eyeball.render();

  var l_pupil = new Cube();
  l_pupil.color = [1, 0.5, 0.3, 1];
  l_pupil.matrix = l_eyeball_matrix;
  l_pupil.matrix.translate(.02,.02,-.001);
  var l_pupil_matrix = new Matrix4(l_pupil.matrix);
  l_pupil.matrix.scale(.05,.05,.05);
  l_pupil.render();

  var l_pupil2 = new Cube();
  l_pupil2.color = [0, 0, 0, 1];
  l_pupil2.matrix = l_pupil_matrix;
  l_pupil2.matrix.translate(.015,.015,-.001);
  l_pupil2.matrix.scale(.025,.025,.025);
  l_pupil2.render();

}

function drawRightEye(){
  var r_stem = new Cube();
  r_stem.color = [0, .1765, .9804, .55];
  r_stem.matrix.translate(.08,-.37,0.08);
  r_stem.matrix.rotate(g_rotate2,0,0,1);
  var r_stem_matrix = new Matrix4(r_stem.matrix);
  r_stem.matrix.scale(.04,.2,0.05);
  r_stem.render();

  var r_stem2 = new Cube();
  r_stem2.color = [0, .1765, .9804, .55];
  r_stem2.matrix = r_stem_matrix;
  r_stem2.matrix.translate(-.001,.2,0.001);
  r_stem2.matrix.rotate(g_rotate,0,0,1);
  var r_stem2_matrix = new Matrix4(r_stem2.matrix);
  r_stem2.matrix.scale(.04,.1,0.05);
  r_stem2.render();

  var r_eyeball = new Cube();
  r_eyeball.color = [1, 1, 1, 1];
  r_eyeball.matrix = r_stem2_matrix;
  r_eyeball.matrix.translate(-.035,.05,-0.03);
  var r_eyeball_matrix = new Matrix4(r_eyeball.matrix);
  r_eyeball.matrix.scale(.1,.1,.1);
  r_eyeball.render();

  var r_pupil = new Cube();
  r_pupil.color = [1, 0.5, 0.3, 1];
  r_pupil.matrix = r_eyeball_matrix;
  r_pupil.matrix.translate(.02,.02,-.001);
  var r_pupil_matrix = new Matrix4(r_pupil.matrix);
  r_pupil.matrix.scale(.05,.05,.05);
  r_pupil.render();

  var r_pupil2 = new Cube();
  r_pupil2.color = [0, 0, 0, 1];
  r_pupil2.matrix = r_pupil_matrix;
  r_pupil2.matrix.translate(.015,.015,-.001);
  r_pupil2.matrix.scale(.025,.025,.025);
  r_pupil2.render();

}

function drawLeftLeg(){
  var l_legBase = new Cube();
  l_legBase.color = [0.3922, .9137, .5255, 1];
  l_legBase.matrix.translate(-.07,-.389,.4);
  l_legBase.matrix.rotate(g_rotate3,5,0,1);
  l_legBase.matrix.rotate(180,0,0,1);
  var l_legBase_matrix = new Matrix4(l_legBase.matrix);
  l_legBase.matrix.scale(.08,.3,.03);
  l_legBase.render();

  var l_leg2 = new Cube();
  l_leg2.color = [0.3922, .9137, .5255, 1];
  l_leg2.matrix = l_legBase_matrix;
  l_leg2.matrix.translate(0,.3,0);
  l_leg2.matrix.rotate(g_rotate3*1.2,g_rotate3*1.2,0,1);
  l_leg2.matrix.rotate(15,15,0,1);
  var l_leg2_matrix = new Matrix4(l_leg2.matrix);
  l_leg2.matrix.scale(.08,.15,.03);
  l_leg2.render();

  var l_foot = new Cube();
  l_foot.color = [0.3922, .75, .5255, 1];
  l_foot.matrix = l_leg2_matrix;
  l_foot.matrix.translate(-0.005,.15,-0.08);
  l_foot.matrix.rotate(15,15,0,1);
  l_foot.matrix.scale(.09,.05,.12);
  l_foot.render();
}

function drawRightLeg(){
  var r_legBase = new Cube();
  r_legBase.color = [0.3922, .9137, .5255, 1];
  r_legBase.matrix.translate(.15,-.38,.4);
  r_legBase.matrix.rotate(-g_rotate4,-5,0,1);
  r_legBase.matrix.rotate(180,0,0,1);
  var r_legBase_matrix = new Matrix4(r_legBase.matrix);
  r_legBase.matrix.scale(.08,.3,.03);
  r_legBase.render();

  var r_leg2 = new Cube();
  r_leg2.color = [0.3922, .9137, .5255, 1];
  r_leg2.matrix = r_legBase_matrix;
  r_leg2.matrix.translate(0,.3,0);
  r_leg2.matrix.rotate(g_rotate4*1.2,g_rotate4*1.2,0,1);
  r_leg2.matrix.rotate(15,15,0,1);
  var r_leg2_matrix = new Matrix4(r_leg2.matrix);
  r_leg2.matrix.scale(.08,.15,.03);
  r_leg2.render();

  var r_foot = new Cube();
  r_foot.color = [0.3922, .75, .5255, 1];
  r_foot.matrix = r_leg2_matrix;
  r_foot.matrix.translate(-0.005,.15,-0.08);
  r_foot.matrix.rotate(15,15,0,1);
  r_foot.matrix.scale(.09,.05,.12);
  r_foot.render();

}

function drawShell(){

  var shell = new Cube();
  var redLine = new Cube();
  var spot1 = new Cube();
  var spot2 = new Cube();
  var spot3 = new Cube();
  var redLine2 = new Cube();
  var redLine3 = new Cube();
  var redLine4 = new Cube();
  var redLine5 = new Cube();

  redLine.matrix = shell.matrix;
  spot1.matrix = shell.matrix;
  spot2.matrix = shell.matrix;
  spot3.matrix = shell.matrix;
  redLine2.matrix = shell.matrix;
  redLine3.matrix = shell.matrix;
  redLine4.matrix = shell.matrix;
  redLine5.matrix = shell.matrix;

  shell.color = [1,.6863 , .7569, .88 ];
  shell.matrix.translate(-.15,-.45,0.3);
  shell.matrix.rotate(g_rotate2/8,0,0,1);
  shell.matrix.scale(.30,.5,.5);
  shell.render();
  
  redLine.color = [1,0 , 0, 1];
  redLine.matrix.translate(-0.02,0,.45);
  redLine.matrix.scale(1.05,.35,.08);
  redLine.render();

  spot1.color = [.8431,.5059 , .7529, 1];
  spot1.matrix.translate(-0.02,2.3,0.5);
  spot1.matrix.scale(1.02,.3,.8);
  spot1.render();

  spot2.color = [.8431,.5059 , .7529, 1];
  spot2.matrix.translate(0,-1.5,-5);
  spot2.render();

  spot3.color = [.8431,.5059 , .7529, 1];
  spot3.matrix.translate(0,0,10);
  spot3.render();

  redLine2.color = [1,0 , 0, 1];
  redLine2.matrix.translate(0.01,-3,-6.5);
  spot1.matrix.scale(1,2.5,1.2);
  redLine2.render();

  redLine3.color = [1,0 , 0, 1];
  redLine3.matrix.translate(0,1,1);
  redLine4.matrix.scale(1,.3,2);
  redLine3.render();

  redLine4.color = [1,0 , 0, 1];
  redLine4.matrix.translate(0,-2,1);
  redLine4.matrix.scale(1,2,.5);
  redLine4.render();

  redLine5.color = [1,0 , 0, 1];
  redLine4.matrix.translate(0,-.5,-1);
  redLine4.matrix.scale(1,.5,1);
  redLine5.render();

}
