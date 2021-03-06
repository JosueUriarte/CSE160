class Cube{

	constructor(){
		this.type = 'cube';
		this.color = [1.0,1.0,1.0,1.0];
		this.matrix = new Matrix4();
		this.textureNum = -1;
	}

	render(){
		var rgba = this.color;
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		gl.uniform1i(u_TextureNum, this.textureNum);

		//Front face
		drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0 ],  [0,0, 1,1, 1,0]);
		drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0 ],  [0,0, 0,1, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

		//Top face
		drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1 ],  [0,0, 0,1, 1,1]);
		drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0 ],  [0,0, 1,1, 1,0]);

		gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);

		//Right Face
		drawTriangle3DUV( [1,0,0, 1,1,0, 1,1,1 ],  [0,0, 0,1, 1,1]);
		drawTriangle3DUV( [1,0,0, 1,0,1, 1,1,1 ],  [0,0, 1,0, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);

		//Left Face
		drawTriangle3DUV( [0,0,0, 0,0,1, 0,1,1 ],  [1,0, 0,0, 0,1]);
		drawTriangle3DUV( [0,0,0, 0,1,0, 0,1,1 ],  [1,0, 1,1, 0,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .6, rgba[1] * .6, rgba[2] * .6, rgba[3]);

		//Bottom face
		drawTriangle3DUV( [0,0,0, 1,0,1, 1,0,0 ],  [0,1, 1,0, 1,1]);
		drawTriangle3DUV( [0,0,0, 0,0,1, 1,0,1 ],  [0,1, 0,0, 1,0]);

		gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);

		//Back face
		drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1 ],  [1,0, 1,1, 0,1]);
		drawTriangle3DUV( [0,0,1, 1,1,1, 1,0,1 ],  [1,0, 0,1, 0,0]);
	}

	renderFast(){
		var rgba = this.color;
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		gl.uniform1i(u_TextureNum, this.textureNum);
		//gl.disableVertexAttribArray(a_UV);

		var allverts=[];
		var vertsUV= [];

		//Front face
		allverts=allverts.concat( [0,0,0, 1,1,0, 1,0,0 ] ); vertsUV=vertsUV.concat([0,0, 1,1, 1,0]);
		allverts=allverts.concat( [0,0,0, 0,1,0, 1,1,0 ] ); vertsUV=vertsUV.concat([0,0, 0,1, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);

		//Top face
		allverts=allverts.concat( [0,1,0, 0,1,1, 1,1,1 ] ); vertsUV=vertsUV.concat([0,0, 0,1, 1,1]);
		allverts=allverts.concat( [0,1,0, 1,1,1, 1,1,0 ] ); vertsUV=vertsUV.concat([0,0, 1,1, 1,0]);

		gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);

		//Right Face
		allverts=allverts.concat( [1,0,0, 1,1,0, 1,1,1 ] ); vertsUV=vertsUV.concat([0,0, 0,1, 1,1]);
		allverts=allverts.concat( [1,0,0, 1,0,1, 1,1,1 ] ); vertsUV=vertsUV.concat([0,0, 1,0, 1,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);

		//Left Face
		allverts=allverts.concat( [0,0,0, 0,0,1, 0,1,1 ] ); vertsUV=vertsUV.concat([1,0, 0,0, 0,1]);
		allverts=allverts.concat( [0,0,0, 0,1,0, 0,1,1 ] ); vertsUV=vertsUV.concat([1,0, 1,1, 0,1]);

		gl.uniform4f(u_FragColor, rgba[0] * .6, rgba[1] * .6, rgba[2] * .6, rgba[3]);

		//Bottom face
		allverts=allverts.concat( [0,0,0, 1,0,1, 1,0,0 ] ); vertsUV=vertsUV.concat([0,1, 1,0, 1,1]);
		allverts=allverts.concat( [0,0,0, 0,0,1, 1,0,1 ] ); vertsUV=vertsUV.concat([0,1, 0,0, 1,0]);

		gl.uniform4f(u_FragColor, rgba[0] * .5, rgba[1] * .5, rgba[2] * .5, rgba[3]);

		//Back face
		allverts=allverts.concat( [0,0,1, 0,1,1, 1,1,1 ] ); vertsUV=vertsUV.concat([1,0, 1,1, 0,1]);
		allverts=allverts.concat( [0,0,1, 1,1,1, 1,0,1 ] ); vertsUV=vertsUV.concat([1,0, 0,1, 0,0]);
		drawTriangle3DUV(allverts, vertsUV);
	}
}