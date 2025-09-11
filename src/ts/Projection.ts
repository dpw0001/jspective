// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
export class Projection {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _parent: any;
	public _posX: number;
	public _posY: number;
	public _posZ: number;
	public _targetPosX: number;
	public _targetPosY: number;
	public _targetPosZ: number;
	public _speed: number;
	public _width: number;
	public _height: number;
	public _fontsize: number;
	public _vanishX: number;
	public _vanishY: number;
	public _vanishZ: number;
	public _projectedX: number;
	public _projectedY: number;
	public _projectedWidth: number;
	public _projectedHeight: number;
	public _projectedFontsize: number;
	public _movementVectorX: number;
	public _movementVectorY: number;
	public _movementVectorZ: number;


	constructor(id: number, parent: any, width: number, height: number, fontsize: number,
				vanishX: number, vanishY: number, vanishZ: number, speed: number) {
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

	public set3DPosition(x: number, y: number, z: number): void { 
		this._posX = Math.round(x);
		this._posY = Math.round(y);
		this._posZ = Math.round(z);
		
		this.projection();
	}


	public setTargetPosition(x: number, y: number, z: number): void {
		this._targetPosX = Math.round(x);
		this._targetPosY = Math.round(y);
		this._targetPosZ = Math.round(z);
	}


	public projection(): void { 
		// Project 3D virtual coordinates to 2D screen-position and object size
		// using vanishing point projection (Fluchtpunktverfahren basierend auf Strahlensaetzen).
		let vanishX = this._vanishX;
		let vanishY = this._vanishY;
		let vanishZ = this._vanishZ;
		
		this._projectedX = Math.round( ( ((this._posX - vanishX) * vanishZ) / (vanishZ - this._posZ) ) + vanishX );
		this._projectedY = Math.round( ( ((this._posY - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		this._projectedWidth = -(this._projectedX) + Math.round( ( ((this._posX + this._width - vanishX) * vanishZ) / (vanishZ - this._posZ) ) + vanishX ); 
		this._projectedHeight = -(this._projectedY) + Math.round( ( ((this._posY + this._height - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		let newFontsize = -(this._projectedY) + Math.round( ( ((this._posY + this._fontsize - vanishY) * vanishZ) / (vanishZ - this._posZ) ) + vanishY );
		// Anti-flicker orientation guessing ("normalizes" sizing)
		//if( (newFontsize < this._projectedFontsize  && this._movementVectorZ > 0)
		//		|| (newFontsize > this._projectedFontsize  && this._movementVectorZ < 0)	) {
			this._projectedFontsize = newFontsize;
		//}
		this._parent.updateDOM();
	}


	public moveToTarget(): void {
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


	public stepToTarget(): void {
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
