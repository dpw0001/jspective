// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
import { EnumAnimationMode, EnumMenuItemType } from "./Enums.js";

// ------------------------------------------------------------------
export class MenuItemRecord {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public itemType: EnumMenuItemType;
	public label: string;
	public hideLabel: boolean;
	public contentUrl: string;
	public width: number;
	public height: number;
	public imageUrl: string;
	public defaultAnimationMode: EnumAnimationMode|null;


	constructor(itemType: EnumMenuItemType, label: string, hideLabel: boolean, contentUrl: string,
				width: number, height: number, imageUrl: string, defaultAnimationMode: EnumAnimationMode|null) {
		this.itemType = itemType;
		this.label = label;
		this.hideLabel = hideLabel;
		this.contentUrl = contentUrl;
		this.width = width;
		this.height = height;
		this.imageUrl = imageUrl;
		this.defaultAnimationMode = defaultAnimationMode;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

} // end class
