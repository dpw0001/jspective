// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class MenuItemRecord {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_itemType; // One of: "menu", "page", "link"
	_label;
	_hideLabel;
	_contentUrl;
	_width;
	_height;
	_imageUrl;
	_defaultMenuMode; // For submenus - one of: "wheel", "shuffle"


	constructor(itemType, label, hideLabel, contentUrl, width, height, imageUrl, defaultMenuMode) {
		this._itemType = itemType;
		this._label = label;
		this._hideLabel = hideLabel;
		this._contentUrl = contentUrl;
		this._width = width;
		this._height = height;
		this._imageUrl = imageUrl;
		this._defaultMenuMode = defaultMenuMode;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

} // end class
