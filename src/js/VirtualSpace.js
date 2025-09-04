// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class VirtualSpace {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_insightWidth;
	_insightHeight;
	_insightDepth;
	_insightOriginX;
	_insightOriginY;
	_insightOriginZ;
	_insightRotateX;
	_insightRotateY;
	_insightRotateZ;
	_gloVanishX;
	_gloVanishY;
	_gloVanishZ;


	constructor(id, insightWidth, insightHeight, insightDepth, insightOriginX, insightOriginY, insightOriginZ, gloVanishX, gloVanishY, gloVanishZ) {
		this._id = id;

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
		this._outerRegionMin = -1000000;
		this._outerRegionMax = 1000000;

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
