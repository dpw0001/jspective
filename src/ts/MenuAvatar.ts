// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Avatar } from "./Avatar.js";
import { EnumAnimationMode } from "./Enums.js";
import { IMenuItem } from "./IMenuItem.js";
import { JSpective } from "./JSpective.js";
import { MenuLevel } from "./MenuLevel.js";

export class MenuAvatar extends Avatar implements IMenuItem {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	// Implements interface IMenuItem
	public menuItemId: number;
	public dataUrl: string;
	public parentMenuLevel: MenuLevel;
	public isSelfTargeting: boolean;
	public isOpened: boolean;
	public isParked: boolean;
	public isClosing: boolean;
	public isMouseOver: boolean;

	public defaultAnimationMode: EnumAnimationMode;
	
	constructor(jspective: JSpective, menuItemId: number, label: string, hideLabel: boolean, dataUrl: string, parentMenuLevel: MenuLevel,
				width: number, height: number, baseCssClass: string, imageUrl: string, defaultAnimationMode: EnumAnimationMode) {
		
		let domId = "Avatar_" + parentMenuLevel.menuLevelId + "_" + menuItemId;
		super(jspective, domId, label, hideLabel, width, height, baseCssClass, imageUrl);
		
		this.menuItemId = menuItemId;
		this.dataUrl = dataUrl;
		this.parentMenuLevel = parentMenuLevel;
		this.isSelfTargeting = false;
		this.isOpened = false;
		this.isParked = false;
		this.isClosing = false;
		this.isMouseOver = false;
		
		this.defaultAnimationMode = defaultAnimationMode;
		
		// Bind event handlers to this
		// ---------------------------
		// Note: Done in superclass - seems to work fine
		//this.handleClick = this.handleClick.bind(this);
		//this.handleMouseOver = this.handleMouseOver.bind(this);
		//this.handleMouseOut = this.handleMouseOut.bind(this);
		
		this.createDOM();
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Implements interface IProjectionUser
	public reachedTarget(): void {
		if(this.isOpened) {
			// Switch to next menu level (exactly now on menu avatars arrival!)
			this.jspective.activeMenuId = this.jspective.activeMenuId + 1;
			
			// Retry interval: show avatars of submenu if request has finished (MenuLevel.isLoaded)
			// (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
			this.jspective.openMenuInterval = window.setInterval(this.jspective.handleOpenMenuInterval, this.jspective.openMenuPeriod);
			
			//position menu toolbar
			this.jspective.uniqueMenuToolbar.warpToActiveMenu();
		}
		this.projection.speed = this.jspective.defaultSpeed;
		this.isSelfTargeting = false;
	}


	// Implements interface IMenuItem
	public openItem(): void {
		this.isMouseOver = false; // Free from mouseover effects
		this.isOpened = true;
		this.isSelfTargeting = true;
		this.projection.speed = 35;
		let targetX = -100;
		let targetY = (this.jspective.menuStack[this.jspective.activeMenuId].groundLevel) - (this.jspective.levelHeight * 0.8);
		let targetZ = 0;
		this.projection.setTargetPosition(targetX, targetY, targetZ);
		
		$("div#" + this.domId).addClass("opened");
	}


	// Implements interface IMenuItem
	public closeItem(): void {
		this.isMouseOver = false; //free from mouse over effects
		
		let activeMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId];
		
		// Unload menu
		activeMenuLevel.isLoaded = false;
		
		// Remove related avatars
		for(let item of activeMenuLevel.items) {
			item.isParked = true;
			item.isSelfTargeting = false;
			item.removeDOM();
		}
		
		//---------- ACTIVE LEVEL SWITCH ---------------------------------------------------
		// Drop menu from stack
		this.jspective.menuStack.pop();
		// Decrease menu level count
		this.jspective.activeMenuId = this.jspective.activeMenuId - 1;
		//-----------------------------------------------------------------------------------
		
		// Move toolbar to decreased level
		if(this.jspective.activeMenuId > 0) {
			this.jspective.uniqueMenuToolbar.warpToActiveMenu();
		} else {
			// Init to main menu level
			this.jspective.uniqueMenuToolbar.projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in JSpective)
		}
		
		// Free the menu avatar that is being closed
		this.projection.speed = this.jspective.defaultSpeed;
		this.isOpened = false;
		this.isSelfTargeting = false;
		$("div#" + this.domId).removeClass("opened");
		
		let newActiveMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId];
		let i = 0;
		for(let item of newActiveMenuLevel.items) {
			// Free avatars of reactivated menu from parking position
			if(i != this.menuItemId) {
				// Hint: Not all avatars may have been reset to the default speed, yet - So we ensure that here.
				//       Is this a potential FIXME? => Can the reset to default speed be savely done earlier elsewhere,
				//       making following line unnecessary?
				item.projection.speed = this.jspective.defaultSpeed;
				
				item.isParked = false;
				item.isSelfTargeting = false;
			}
			
			i++;
		}
		
		// If exists, free parent menu avatar of reactivated menu
		if(this.jspective.activeMenuId > 0) {
			let parentMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId - 1];
			for(let item of parentMenuLevel.items) {
				if(item.isOpened) {
					item.isParked = false;
				}
			}
		}
	}


	// Implements class Avatar
	public override handleClick(): boolean {
		this.isMouseOver = false; // Free from mouseover effects
		
		if(!this.isParked) {
			if(!this.isOpened) {
				// Menu avatar is clicked to be opened. Make a request to server to fetch content.
				if(this.dataUrl.length > 0) {
					// Park the parent menu avatar of current menu, if exists
					if( this.jspective.activeMenuId > 0) {
						let parentMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId - 1];
						for(let item of parentMenuLevel.items) {
							if(item.isOpened) {
								item.isParked = true;
							}
						}
					}
					
					// Close all other opened avatars and page viewer of active menu
					if(this.jspective.uniquePageViewer.isOpened) {
						this.jspective.uniquePageViewer.closeView();
					}
					let activeMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId];
					let i = 0;
					for(let item of activeMenuLevel.items) {
						if(i != this.menuItemId) {
							if(item.isOpened) {
								item.closeItem();
							}
							// Send avatar to parking position
							item.isParked = true;
							item.isSelfTargeting = true;
							item.projection.speed = 35;
							let targetX = this.jspective.virtualSpaceWidth / 2 + (i * 40);
							let targetY = activeMenuLevel.groundLevel + 300;
							let targetZ = this.jspective.virtualSpaceDepth - (i * 30);
							item.projection.setTargetPosition(targetX, targetY, targetZ);
						}//if
						
						i++
					}//for
					
					// Put new submenu onto stack
					let submenu = new MenuLevel(this.jspective, this.jspective.activeMenuId + 1, activeMenuLevel.groundLevel - this.jspective.levelHeight, this);
					this.jspective.menuStack.push(submenu);
					
					// Move to front
					this.openItem();
					
					// Request menu data from server
					submenu.requestMenuData(this.dataUrl);
					
				} else {
					alert("Submenu has no link set. Can't open");
				}//if dataUrl
				
			} else {	
				// Submenu is currently opened
				
				if(this.isSelfTargeting) {
					// Ignore click for now. TODO: Accept click to cancel opening
				} else {
					this.closeItem();
				}	
			}//if isOpened
			
		} else {
			// Avatar is currently parked
			
			// Iterate top-down over every menu level
			// and close all avatars (menus and pages) until the menu level of the clicked avatar is active.
			while(this.jspective.activeMenuId > this.parentMenuLevel.menuLevelId) {
				let prevMenuLevel = this.jspective.menuStack[this.jspective.activeMenuId - 1];
				for(let item of prevMenuLevel.items) {
					if(item.isOpened) {
						item.closeItem();
					}
				}
			}
		}//if isParked
		
		return false;
	}


	// Implements class Avatar
	public handleMouseOver(): boolean {
		if(!this.isOpened) {
			this.isMouseOver = true;
			$("div#" + this.domId).addClass("hover");
		}
		return false;
	}


	// Implements class Avatar
	public handleMouseOut(): boolean {	
		this.isMouseOver = false;
		$("div#" + this.domId).removeClass("hover");
		return false;
	}

} // end class
