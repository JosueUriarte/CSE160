class Mystery{
  constructor(){
    this.type = 'mystery';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size
    gl.uniform1f(u_Size, size);
    // Draw
    var d = this.size/200.0;
    var rand = Math.floor(Math.random() * 10) + 1

    // pt1(x,y)  pt2(x,y)  pt2(x,y)
    drawMystery([xy[0]/2, xy[1], xy[0]+d/2, xy[1], rand+d/2, xy[1]+d ]); 
    }
}


function drawMystery(vertices){

	var n = 3;

	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create the buffer object');
		return -1;
	}

	//Bind buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	//Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  	//Assign the buffer object to a_Position variable
  	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  	//Enable the assignment to a_Position variable
  	gl.enableVertexAttribArray(a_Position);

  	gl.drawArrays(gl.TRIANGLES, 0, n);
}