// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class Projection {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_parent;
	_posX;
	_posY;
	_posZ;
	_targetPosX;
	_targetPosY;
	_targetPosZ;
	_speed;
	_width;
	_height;
	_fontsize;
	_vanishX;
	_vanishY;
	_vanishZ;
	_projectedX;
	_projectedY;
	_projectedWidth;
	_projectedHeight;
	_projectedFontsize;
	_movementVectorX;
	_movementVectorY;
	_movementVectorZ;


	constructor(id, parent, width, height, fontsize, vanishX, vanishY, vanishZ, speed) {
		this._id = id;
		this._parent = parent; // Object that conforms to interface ProjectionUser (see documentation).
		
		// The three-dimensional current position in a virtual space
		this._posX = 0;
		this._posY = 0;
		this._posZ = 0;
		
		// A target point (to move to) in virtual space
		this._targetPosX = 0;
		this._targetPosY = 0;
		this._targetPosZ = 0;
		this._speed = speed;
		
		// Static sizes in virtual space
		this._width = width;
		this._height = height;
		this._fontsize = fontsize;
		
		// TODO: background and font colors could be projected, too, if that doesn't drop performance.
		
		// A vanishing point in a space (Fluchtpunkt) on a per avatar basis for flexibility
		this._vanishX = vanishX;
		this._vanishY = vanishY;
		this._vanishZ = vanishZ;
		
		// The two-dimensional projection to a screen-position and size.
		this._projectedX = 0;
		this._projectedY = 0;
		this._projectedWidth = 0;
		this._projectedHeight = 0;
		this._projectedFontsize = 0;
		this._movementVectorX = 0;
		this._movementVectorY = 0;
		this._movementVectorZ = 0;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	set3DPosition(x, y, z) { 
		this._posX = parseInt(x);
		this._posY = parseInt(y);
		this._posZ = parseInt(z);
		
		this.projection();
	}


	setTargetPosition(x, y, z) {
		this._targetPosX = parseInt(x);
		this._targetPosY = parseInt(y);
		this._targetPosZ = parseInt(z);
	}


	projection() { 
		// Project 3D virtual coordinates to 2D screen-position and object size
		// using vanishing point projection (Fluchtpunktverfahren basierend auf Strahlensaetzen).
		let vanishX = this._vanishX;
		let vanishY = this._vanishY;
		let vanishZ = this._vanishZ;
		
		this._projectedX = parseInt( ( ((this._posX - vanishX) * vanishZ) / (vanishZ - this._posZ) ) + vanishX );
		this._projectedY = parseInt( ( ((this._posY - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		this._projectedWidth = -(this._projectedX) + parseInt( ( ((this._posX + this._width - vanishX) * vanishZ) / (vanishZ - this._posZ) ) + vanishX ); 
		this._projectedHeight = -(this._projectedY) + parseInt( ( ((this._posY + this._height - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		let newFontsize = -(this._projectedY) + parseInt( ( ((this._posY + this._fontsize - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		// Anti-flicker orientation guessing ("normalizes" sizing)
		//if( (newFontsize < this._projectedFontsize  && this._movementVectorZ > 0)
		//		|| (newFontsize > this._projectedFontsize  && this._movementVectorZ < 0)	) {
			this._projectedFontsize = newFontsize;
		//}
		this._parent.updateDOM();
	}


	moveToTarget() {
		this._movementVectorX = (this._targetPosX - this._posX) / (100 / this._speed);
		this._movementVectorY = (this._targetPosY - this._posY) / (100 / this._speed);
		this._movementVectorZ = (this._targetPosZ - this._posZ) / (100 / this._speed);
		
		if(this._movementVectorX > 0 && this._movementVectorX < 1) { this._movementVectorX = 1 };
		if(this._movementVectorY > 0 && this._movementVectorY < 1) { this._movementVectorY = 1 };
		if(this._movementVectorZ > 0 && this._movementVectorZ < 1) { this._movementVectorZ = 1 };
		if(this._movementVectorX < 0 && this._movementVectorX > -1) { this._movementVectorX = -1 };
		if(this._movementVectorY < 0 && this._movementVectorY > -1) { this._movementVectorY = -1 };
		if(this._movementVectorZ < 0 && this._movementVectorZ > -1) { this._movementVectorZ = -1 };
		
		this.set3DPosition(this._posX + this._movementVectorX, this._posY + this._movementVectorY, this._posZ + this._movementVectorZ);
		
		// Check if object has reached its target position
		if( (this._posX == this._targetPosX) && (this._posY == this._targetPosY) && (this._posZ == this._targetPosZ) ) {
			// Let delegation object decide what to do now
			this._parent.reachedTarget();
		}
	}


	stepToTarget() {
		let deltaX = (this._targetPosX - this._posX) / (100 / this._speed);
		let deltaY = (this._targetPosY - this._posY) / (100 / this._speed);
		let deltaZ = (this._targetPosZ - this._posZ) / (100 / this._speed);
		
		if(deltaX > 0 && deltaX < 1) { deltaX = 1 };
		if(deltaY > 0 && deltaY < 1) { deltaY = 1 };
		if(deltaZ > 0 && deltaZ < 1) { deltaZ = 1 };
		if(deltaX < 0 && deltaX > -1) { deltaX = -1 };
		if(deltaY < 0 && deltaY > -1) { deltaY = -1 };
		if(deltaZ < 0 && deltaZ > -1) { deltaZ = -1 };
		
		this.set3DPosition(this._posX + deltaX, this._posY + deltaY, this._posZ + deltaZ);
		
		// Check if object has reached its target position
		if( (this._posX == this._targetPosX) && (this._posY == this._targetPosY) && (this._posZ == this._targetPosZ) ) {
			// Let delegation object decide what to do now
			this._parent.reachedTarget();
		}
	}

} // end class
