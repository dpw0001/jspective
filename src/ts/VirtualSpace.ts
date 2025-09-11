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

	public _insightWidth: number;
	public _insightHeight: number;
	public _insightDepth: number;
	public _insightOriginX: number;
	public _insightOriginY: number;
	public _insightOriginZ: number;
	public _insightRotateX: number;
	public _insightRotateY: number;
	public _insightRotateZ: number;
	public _gloVanishX: number;
	public _gloVanishY: number;
	public _gloVanishZ: number;


	constructor(insightWidth: number, insightHeight: number, insightDepth: number,
				insightOriginX: number, insightOriginY: number, insightOriginZ: number,
				gloVanishX: number, gloVanishY: number, gloVanishZ: number) {
		// Position and dimensions of the "in-sight region" in the "universe" of this VirtualSpace.
		// A 3D-viewport: Only avatars inside are rendered to the user interface.
		this._insightWidth = insightWidth;
		this._insightHeight = insightHeight;
		this._insightDepth = insightDepth;
		this._insightOriginX = insightOriginX;
		this._insightOriginY = insightOriginY;
		this._insightOriginZ = insightOriginZ;

		// NOTE: "outer-regions" of the virtual space are limited to the javascript variable-type let integer.
		// IF CRITICAL - TODO ! WARNINGS and fail-saves should be implemented before avatars leave the maximum/minimum of the outer-region !
		//this._outerRegionMin = -1000000;
		//this._outerRegionMax = 1000000;

		// Rotate axis to give the orientation of the in-sight region box.
		this._insightRotateX = 0; 
		this._insightRotateY = 0;
		this._insightRotateZ = 0;

		// The general vanishing point (Fluchtpunkt) for 2D-projections of in-sight avatars.
		// (Can be overwritten for individual avatars.)
		// Relative to the origin and orientation of the in-sight viewport.
		this._gloVanishX = gloVanishX;
		this._gloVanishY = gloVanishY;
		this._gloVanishZ = gloVanishZ;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

} // end class
