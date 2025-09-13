
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { MenuLevel } from "./MenuLevel.js";

export class MenuStack {

	// Private members
	// ---------------


	// Public members
	// --------------

	public menuLevels: Array<MenuLevel>;
	public activeMenuLevelIndex: number;


	constructor() {
		this.menuLevels = new Array();
		this.activeMenuLevelIndex = -1;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public populate(menuLevels: Array<MenuLevel>): void {
		for (let item of menuLevels) {
			this.addMenuLevel(item);
		}
	}


	public addMenuLevel(menuLevel: MenuLevel): void {
		menuLevel.menuLevelIndex = this.activeMenuLevelIndex + 1;
		this.menuLevels.push(menuLevel);
	}


	public dropMenuLevel(): void {
		this.menuLevels.pop();
		this.decreaseActiveMenuLevel();
	}


	public getActiveMenuLevel(): MenuLevel {
		let activeMenuLevel = this.menuLevels[this.activeMenuLevelIndex];
		if(activeMenuLevel == undefined) {
			throw "Exception in MenuStack: Active menu level is undefined for activeMenuLevelIndex \"" + this.activeMenuLevelIndex + "\".";
		}
		return activeMenuLevel;
	}


	public getPreviousMenuLevel(): MenuLevel {
		let prevMenuLevel = this.menuLevels[this.activeMenuLevelIndex - 1];
		if(prevMenuLevel == undefined) {
			throw "Exception in MenuStack: Previous menu level is undefined for current activeMenuLevelIndex \"" + this.activeMenuLevelIndex + "\".";
		}
		return prevMenuLevel;
	}


	public increaseActiveMenuLevel() {
		this.activeMenuLevelIndex = this.activeMenuLevelIndex + 1;
	}


	public decreaseActiveMenuLevel() {
		this.activeMenuLevelIndex = this.activeMenuLevelIndex - 1;
	}

} // end class
