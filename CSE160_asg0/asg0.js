// asg0.js

//--------Global Variables----------
// Retrieve <canvas> element <- (1)
var canvas = document.getElementById('canvas');
// Get the rendering context for 2DCG <- (2)
var ctx = canvas.getContext('2d');

function main() {

	// Retrieve <canvas> element <- (1)
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}

	// Make canvas black
	ctx.fillStyle = 'black'; // Set black color
	ctx.fillRect(0,0,400,400); //Fill it up with black
}

function handleDrawEvent(){

	//Clear the canvas
	ctx.clearRect(0, 0, canvas.height, canvas.width);

	// Make canvas black
	ctx.fillStyle = 'black'; // Set black color
	ctx.fillRect(0,0,canvas.width,canvas.height); //Fill it up with black

	//Get values and set them to a value
	var x1_int = document.getElementById("xinput").value;
	var y1_int = document.getElementById("yinput").value;
	var x2_int = document.getElementById("xinput2").value;
	var y2_int = document.getElementById("yinput2").value;

	//Make the Vector3 objects
	let v1 = new Vector3([0,0,0]); let v2 = new Vector3([0,0,0]);

	//add vector values to the Vector3 objects
	v1.elements[0] = parseFloat(x1_int); v1.elements[1] = parseFloat(y1_int);
	v2.elements[0] = parseFloat(x2_int); v2.elements[1] = parseFloat(y2_int);
	
	//Draw the vectors
	drawVector(v1, "red"); drawVector(v2, "blue");
	
}

function handleDrawOperationEvent(){

	//Clear the canvas
	ctx.clearRect(0, 0, canvas.height, canvas.width);

	// Make canvas black
	ctx.fillStyle = 'black'; // Set black color
	ctx.fillRect(0,0,canvas.width,canvas.height); //Fill it up with black

	//Get values and set them to a value
	var x1_int = document.getElementById("xinput").value;
	var y1_int = document.getElementById("yinput").value;
	var x2_int = document.getElementById("xinput2").value;
	var y2_int = document.getElementById("yinput2").value;

	//Make the Vector3 objects
	let v1 = new Vector3([0,0,0]); let v2 = new Vector3([0,0,0]);
	let v3 = new Vector3([0,0,0]); let v4 = new Vector3([0,0,0]);

	//add vector values to the Vector3 objects
	v1.elements[0] = parseFloat(x1_int); v1.elements[1] = parseFloat(y1_int);
	v2.elements[0] = parseFloat(x2_int); v2.elements[1] = parseFloat(y2_int);

	
	//Grab the operation to do and scalar if needed
	var operation = document.getElementById("operation").value;
	var scalar = parseFloat(document.getElementById("scalar").value);

	//Perform operation given
	if(operation == "add"){
		v3.set(v1);
		v3.add(v2);
	}

	else if(operation == "sub"){
		v3.set(v1);
		v3.sub(v2);
	}

	else if(operation == "mult"){
		v3.set(v1);
		v3.mul(scalar);
		v4.set(v2);
		v4.mul(scalar);
	}

	else if(operation == "div"){
		v3.set(v1);
		v3.div(scalar);
		v4.set(v2);
		v4.div(scalar);
	}

	else if(operation == "mag"){
		console.log("Magnitude v1: " + v1.magnitude().toFixed(2));
		console.log("Magnitude v2: " + v2.magnitude().toFixed(2));
	}

	else if(operation == "norm"){
		v3.set(v1);
		v4.set(v2);
		v3.normalize();
		v4.normalize();
	}

	else if(operation == "angle"){
		console.log("Angle: " + angleBetween(v1,v2).toFixed(2));
	}

	else if(operation == "area"){
		console.log("Area of the triangle: " + areaTriangle(v1,v2).toFixed(2));
	}

	//Draw the vectors
	drawVector(v1, "red"); drawVector(v2, "blue");
	drawVector(v3, "green"); drawVector(v4, "green");

}

function drawVector(vX, color){

	//Move the "center" to the center of canvas
	ctx.translate(200,200);

	//Begin the path and draw the line
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(vX.elements[0] * 20, vX.elements[1] * -20);
	ctx.strokeStyle = color;
	ctx.stroke();

	//Move back to original center
	ctx.translate(-200,-200);
}

function angleBetween(v1, v2){
	let angle = Math.acos((Vector3.dot(v1,v2))/(v1.magnitude() * v2.magnitude()));
	return angle * (180/Math.PI);
}

function areaTriangle(v1, v2){
	let v3 = Vector3.cross(v1,v2);
	return v3.magnitude()*0.5;
}