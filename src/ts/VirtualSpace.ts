// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
export class VirtualSpace {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public insightWidth: number;
	public insightHeight: number;
	public insightDepth: number;
	public insightOriginX: number;
	public insightOriginY: number;
	public insightOriginZ: number;
	public insightRotateX: number;
	public insightRotateY: number;
	public insightRotateZ: number;
	public gloVanishX: number;
	public gloVanishY: number;
	public gloVanishZ: number;


	constructor(insightWidth: number, insightHeight: number, insightDepth: number,
				insightOriginX: number, insightOriginY: number, insightOriginZ: number,
				gloVanishX: number, gloVanishY: number, gloVanishZ: number) {
		// Position and dimensions of the "in-sight region" in the "universe" of this VirtualSpace.
		// A 3D-viewport: Only avatars inside are rendered to the user interface.
		this.insightWidth = insightWidth;
		this.insightHeight = insightHeight;
		this.insightDepth = insightDepth;
		this.insightOriginX = insightOriginX;
		this.insightOriginY = insightOriginY;
		this.insightOriginZ = insightOriginZ;

		// NOTE: "outer-regions" of the virtual space are limited to the javascript variable-type let integer.
		// IF CRITICAL - TODO ! WARNINGS and fail-saves should be implemented before avatars leave the maximum/minimum of the outer-region !
		//this.outerRegionMin = -1000000;
		//this.outerRegionMax = 1000000;

		// Rotate axis to give the orientation of the in-sight region box.
		this.insightRotateX = 0; 
		this.insightRotateY = 0;
		this.insightRotateZ = 0;

		// The general vanishing point (Fluchtpunkt) for 2D-projections of in-sight avatars.
		// (Can be overwritten for individual avatars.)
		// Relative to the origin and orientation of the in-sight viewport.
		this.gloVanishX = gloVanishX;
		this.gloVanishY = gloVanishY;
		this.gloVanishZ = gloVanishZ;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

} // end class
