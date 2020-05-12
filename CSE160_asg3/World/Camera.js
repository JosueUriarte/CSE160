class Camera{

	constructor(){
		this.eye = new Vector3([0,0,-1]);
		this.at = new Vector3([0,0,3]);
		this.up = new Vector3([0,1,0]);
	}

	forward(){
		let f = new Vector3([0,0,0]);
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	f.mul(0.2);

    	this.eye.add(f);
    	this.at.add(f);
	}

	backward(){
		let f = new Vector3([0,0,0]);
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	f.mul(0.2);

    	this.eye.sub(f);
    	this.at.sub(f);
	}

	moveLeft(){
		let f = new Vector3([0,0,0]);
    	f.set(this.at);
   		f.sub(this.eye);
    	f.normalize();

    	let left = Vector3.cross(this.up, f);
    	left.mul(0.2);

    	this.eye.add(left);
    	this.at.add(left);
	}

	moveRight(){
		let f = new Vector3([0,0,0]);
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	let right = Vector3.cross(this.up, f);
    	right.mul(0.2);

    	this.eye.sub(right);
    	this.at.sub(right);
	}

	rotateLeft(){
		let f = new Vector3([0,0,0]);
		let tempEye = new Vector3([0,0,0]);
		f.set(this.at);

		let rotateMat = new Matrix4();

		rotateMat.setRotate(3.5, this.up.elements[0], 
							this.up.elements[1], this.up.elements[2]);
    	let f_prime = rotateMat.multiplyVector3(f);

    	tempEye.set(this.eye);
    	this.at = tempEye.add(f_prime);
	}

	rotateRight(){
		let f = new Vector3([0,0,0]);
		let tempEye = new Vector3([0,0,0]);
		f.set(this.at);

		let rotateMat = new Matrix4();

		rotateMat.setRotate(-3.5, this.up.elements[0], 
							this.up.elements[1], this.up.elements[2]);
    	let f_prime = rotateMat.multiplyVector3(f);

    	tempEye.set(this.eye);
    	this.at = tempEye.add(f_prime);
	}
}