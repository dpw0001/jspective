// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
export class Projection {
    constructor(parent, width, height, fontsize, vanishX, vanishY, vanishZ, speed) {
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
    set3DPosition(x, y, z) {
        this.posX = Math.round(x);
        this.posY = Math.round(y);
        this.posZ = Math.round(z);
        this.projection();
    }
    setTargetPosition(x, y, z) {
        this.targetPosX = Math.round(x);
        this.targetPosY = Math.round(y);
        this.targetPosZ = Math.round(z);
    }
    projection() {
        // Project 3D virtual coordinates to 2D screen-position and object size
        // using vanishing point projection (Fluchtpunktverfahren basierend auf Strahlensaetzen).
        let vanishX = this.vanishX;
        let vanishY = this.vanishY;
        let vanishZ = this.vanishZ;
        this.projectedX = Math.round((((this.posX - vanishX) * vanishZ) / (vanishZ - this.posZ)) + vanishX);
        this.projectedY = Math.round((((this.posY - vanishY) * vanishZ) / (vanishZ - this.posZ)) + vanishY);
        this.projectedWidth = -(this.projectedX) + Math.round((((this.posX + this.width - vanishX) * vanishZ) / (vanishZ - this.posZ)) + vanishX);
        this.projectedHeight = -(this.projectedY) + Math.round((((this.posY + this.height - vanishY) * vanishZ) / (vanishZ - this.posZ)) + vanishY);
        let newFontsize = -(this.projectedY) + Math.round((((this.posY + this.fontsize - vanishY) * vanishZ) / (vanishZ - this.posZ)) + vanishY);
        // Anti-flicker orientation guessing ("normalizes" sizing)
        //if( (newFontsize < this.projectedFontsize  && this.movementVectorZ > 0)
        //		|| (newFontsize > this.projectedFontsize  && this.movementVectorZ < 0)	) {
        this.projectedFontsize = newFontsize;
        //}
        this.parent.updateDOM();
    }
    moveToTarget() {
        this.movementVectorX = (this.targetPosX - this.posX) / (100 / this.speed);
        this.movementVectorY = (this.targetPosY - this.posY) / (100 / this.speed);
        this.movementVectorZ = (this.targetPosZ - this.posZ) / (100 / this.speed);
        if (this.movementVectorX > 0 && this.movementVectorX < 1) {
            this.movementVectorX = 1;
        }
        ;
        if (this.movementVectorY > 0 && this.movementVectorY < 1) {
            this.movementVectorY = 1;
        }
        ;
        if (this.movementVectorZ > 0 && this.movementVectorZ < 1) {
            this.movementVectorZ = 1;
        }
        ;
        if (this.movementVectorX < 0 && this.movementVectorX > -1) {
            this.movementVectorX = -1;
        }
        ;
        if (this.movementVectorY < 0 && this.movementVectorY > -1) {
            this.movementVectorY = -1;
        }
        ;
        if (this.movementVectorZ < 0 && this.movementVectorZ > -1) {
            this.movementVectorZ = -1;
        }
        ;
        this.set3DPosition(this.posX + this.movementVectorX, this.posY + this.movementVectorY, this.posZ + this.movementVectorZ);
        // Check if object has reached its target position
        if ((this.posX == this.targetPosX) && (this.posY == this.targetPosY) && (this.posZ == this.targetPosZ)) {
            // Let delegation object decide what to do now
            this.parent.reachedTarget();
        }
    }
    stepToTarget() {
        let deltaX = (this.targetPosX - this.posX) / (100 / this.speed);
        let deltaY = (this.targetPosY - this.posY) / (100 / this.speed);
        let deltaZ = (this.targetPosZ - this.posZ) / (100 / this.speed);
        if (deltaX > 0 && deltaX < 1) {
            deltaX = 1;
        }
        ;
        if (deltaY > 0 && deltaY < 1) {
            deltaY = 1;
        }
        ;
        if (deltaZ > 0 && deltaZ < 1) {
            deltaZ = 1;
        }
        ;
        if (deltaX < 0 && deltaX > -1) {
            deltaX = -1;
        }
        ;
        if (deltaY < 0 && deltaY > -1) {
            deltaY = -1;
        }
        ;
        if (deltaZ < 0 && deltaZ > -1) {
            deltaZ = -1;
        }
        ;
        this.set3DPosition(this.posX + deltaX, this.posY + deltaY, this.posZ + deltaZ);
        // Check if object has reached its target position
        if ((this.posX == this.targetPosX) && (this.posY == this.targetPosY) && (this.posZ == this.targetPosZ)) {
            // Let delegation object decide what to do now
            this.parent.reachedTarget();
        }
    }
} // end class
//# sourceMappingURL=Projection.js.map