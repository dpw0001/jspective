// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License

import { IProjectionUser } from "./IProjectionUser";

// ------------------------------------------------------------------
export class Projection {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public parent: IProjectionUser;
	public posX: number;
	public posY: number;
	public posZ: number;
	public targetPosX: number;
	public targetPosY: number;
	public targetPosZ: number;
	public speed: number;
	public width: number;
	public height: number;
	public fontsize: number;
	public vanishX: number;
	public vanishY: number;
	public vanishZ: number;
	public projectedX: number;
	public projectedY: number;
	public projectedWidth: number;
	public projectedHeight: number;
	public projectedFontsize: number;
	public movementVectorX: number;
	public movementVectorY: number;
	public movementVectorZ: number;


	constructor(parent: IProjectionUser, width: number, height: number, fontsize: number,
				vanishX: number, vanishY: number, vanishZ: number, speed: number) {
		this.parent = parent; // Object that conforms to interface ProjectionUser (see documentation).
		
		// The three-dimensional current position in a virtual space
		this.posX = 0;
		this.posY = 0;
		this.posZ = 0;
		
		// A target point (to move to) in virtual space
		this.targetPosX = 0;
		this.targetPosY = 0;
		this.targetPosZ = 0;
		this.speed = speed;
		
		// Static sizes in virtual space
		this.width = width;
		this.height = height;
		this.fontsize = fontsize;
		
		// TODO: background and font colors could be projected, too, if that doesn't drop performance.
		
		// A vanishing point in a space (Fluchtpunkt) on a per avatar basis for flexibility
		this.vanishX = vanishX;
		this.vanishY = vanishY;
		this.vanishZ = vanishZ;
		
		// The two-dimensional projection to a screen-position and size.
		this.projectedX = 0;
		this.projectedY = 0;
		this.projectedWidth = 0;
		this.projectedHeight = 0;
		this.projectedFontsize = 0;
		this.movementVectorX = 0;
		this.movementVectorY = 0;
		this.movementVectorZ = 0;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public set3DPosition(x: number, y: number, z: number): void { 
		this.posX = Math.round(x);
		this.posY = Math.round(y);
		this.posZ = Math.round(z);
		
		this.projection();
	}


	public setTargetPosition(x: number, y: number, z: number): void {
		this.targetPosX = Math.round(x);
		this.targetPosY = Math.round(y);
		this.targetPosZ = Math.round(z);
	}


	public projection(): void { 
		// Project 3D virtual coordinates to 2D screen-position and object size
		// using vanishing point projection (Fluchtpunktverfahren basierend auf Strahlensaetzen).
		let vanishX = this.vanishX;
		let vanishY = this.vanishY;
		let vanishZ = this.vanishZ;
		
		this.projectedX = Math.round( ( ((this.posX - vanishX) * vanishZ) / (vanishZ - this.posZ) ) + vanishX );
		this.projectedY = Math.round( ( ((this.posY - vanishY) * vanishZ) / (vanishZ - this.posZ) ) + vanishY );
		this.projectedWidth = -(this.projectedX) + Math.round( ( ((this.posX + this.width - vanishX) * vanishZ) / (vanishZ - this.posZ) ) + vanishX ); 
		this.projectedHeight = -(this.projectedY) + Math.round( ( ((this.posY + this.height - vanishY) * vanishZ) / (vanishZ - this.posZ) ) + vanishY );
		let newFontsize = -(this.projectedY) + Math.round( ( ((this.posY + this.fontsize - vanishY) * vanishZ) / (vanishZ - this.posZ) ) + vanishY );
		// Anti-flicker orientation guessing ("normalizes" sizing)
		//if( (newFontsize < this.projectedFontsize  && this.movementVectorZ > 0)
		//		|| (newFontsize > this.projectedFontsize  && this.movementVectorZ < 0)	) {
			this.projectedFontsize = newFontsize;
		//}
		this.parent.updateDOM();
	}


	public moveToTarget(): void {
		this.movementVectorX = (this.targetPosX - this.posX) / (100 / this.speed);
		this.movementVectorY = (this.targetPosY - this.posY) / (100 / this.speed);
		this.movementVectorZ = (this.targetPosZ - this.posZ) / (100 / this.speed);
		
		if(this.movementVectorX > 0 && this.movementVectorX < 1) { this.movementVectorX = 1 };
		if(this.movementVectorY > 0 && this.movementVectorY < 1) { this.movementVectorY = 1 };
		if(this.movementVectorZ > 0 && this.movementVectorZ < 1) { this.movementVectorZ = 1 };
		if(this.movementVectorX < 0 && this.movementVectorX > -1) { this.movementVectorX = -1 };
		if(this.movementVectorY < 0 && this.movementVectorY > -1) { this.movementVectorY = -1 };
		if(this.movementVectorZ < 0 && this.movementVectorZ > -1) { this.movementVectorZ = -1 };
		
		this.set3DPosition(this.posX + this.movementVectorX, this.posY + this.movementVectorY, this.posZ + this.movementVectorZ);
		
		// Check if object has reached its target position
		if( (this.posX == this.targetPosX) && (this.posY == this.targetPosY) && (this.posZ == this.targetPosZ) ) {
			// Let delegation object decide what to do now
			this.parent.reachedTarget();
		}
	}


	public stepToTarget(): void {
		let deltaX = (this.targetPosX - this.posX) / (100 / this.speed);
		let deltaY = (this.targetPosY - this.posY) / (100 / this.speed);
		let deltaZ = (this.targetPosZ - this.posZ) / (100 / this.speed);
		
		if(deltaX > 0 && deltaX < 1) { deltaX = 1 };
		if(deltaY > 0 && deltaY < 1) { deltaY = 1 };
		if(deltaZ > 0 && deltaZ < 1) { deltaZ = 1 };
		if(deltaX < 0 && deltaX > -1) { deltaX = -1 };
		if(deltaY < 0 && deltaY > -1) { deltaY = -1 };
		if(deltaZ < 0 && deltaZ > -1) { deltaZ = -1 };
		
		this.set3DPosition(this.posX + deltaX, this.posY + deltaY, this.posZ + deltaZ);
		
		// Check if object has reached its target position
		if( (this.posX == this.targetPosX) && (this.posY == this.targetPosY) && (this.posZ == this.targetPosZ) ) {
			// Let delegation object decide what to do now
			this.parent.reachedTarget();
		}
	}

} // end class
