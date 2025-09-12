// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Projection } from "./Projection.js";

export interface IProjectionUser {

	// Public members
	// --------------

	projection: Projection;
	domId: string;
	domElement: any; // TODO: Test browser compatibility for type HTMLElement instead of any


	// Public methods
	// --------------

	createDOM(): void;

	updateDOM(): void;

	removeDOM(): void;

	showDOM(): void;

	hideDOM(): void;

	reachedTarget(): void;

} // end interface
