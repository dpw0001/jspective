// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { MenuLevel } from "./MenuLevel.js";

export interface IMenuItem {

	// Public members
	// --------------

	menuItemId: number;
	dataUrl: string;
	parentMenuLevel: MenuLevel;
	isSelfTargeting: boolean;
	isOpened: boolean;
	isParked: boolean;
	isClosing: boolean;
	isMouseOver: boolean;

	// Public methods
	// --------------

	openItem(): void;

	closeItem(): void;

} // end class
