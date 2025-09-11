// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
export class MenuItemRecord {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _itemType: string; // One of: "menu", "page", "link"
	public _label: string;
	public _hideLabel: boolean;
	public _contentUrl: string;
	public _width: number;
	public _height: number;
	public _imageUrl: string;
	public _defaultMenuMode: string|null; // For submenus - one of: "wheel", "shuffle"


	constructor(itemType: string, label: string, hideLabel: boolean, contentUrl: string,
				width: number, height: number, imageUrl: string, defaultMenuMode: string|null) {
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
