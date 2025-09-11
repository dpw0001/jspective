// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { Projection } from "./Projection.js";
import { MenuLevel } from "./MenuLevel.js";

export class MenuAvatar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _domElement: any;
	
	// Implements interface ProjectionUser
	public _projection: Projection;
	public _domId: string;
	
	// Implements interface Avatar
	public _label: string;
	public _hideLabel: boolean;
	public _baseCssClass: string;
	public _imageUrl: string;
	
	// Implements interface MenuItem
	public _dataUrl: string;
	public _parentMenu: MenuLevel;
	public _isSelfTargeting: boolean;
	public _isOpened: boolean;
	public _isParked: boolean;
	public _isClosing: boolean;
	public _isMouseOver: boolean;

	public _defaultMenuMode: string|null;
	
	constructor(id: number, label: string, hideLabel: boolean, dataUrl: string, parentMenu: MenuLevel,
				width: number, height: number, baseCssClass: string, imageUrl: string, defaultMenuMode: string|null) {
		this._id = id;
		
		this._projection = new Projection(id, this, width, height, JSpective._singleton._defaultFontSize, JSpective._singleton._initVanishX, JSpective._singleton._initVanishY, JSpective._singleton._initVanishZ, JSpective._singleton._defaultSpeed);
		this._projection._parent = this; // Register this Avatar with its child Projection for callbacks
		this._domId = "Avatar_" + parentMenu._id + "_" + id;
		this._domElement = null;
		
		this._label = label;
		this._hideLabel = hideLabel;
		this._baseCssClass = baseCssClass;
		this._imageUrl = imageUrl;
		
		this._dataUrl = dataUrl;
		this._parentMenu = parentMenu;
		this._isSelfTargeting = false;
		this._isOpened = false;
		this._isParked = false;
		this._isClosing = false;
		this._isMouseOver = false;
		
		this._defaultMenuMode = defaultMenuMode;
		
		this.createDOM();
	}


	// Private methods
	// ---------------

	// Implements interface ProjectionUser
	private createDOM(): void { 
		let projectionScreen2D_DOM =  document.getElementById('ProjectionScreen2D');
		if(projectionScreen2D_DOM == null) {
			console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
			
		} else {
			this._domElement = document.createElement("div");
			
			let idAttr = document.createAttribute("id");
			idAttr.nodeValue = this._domId;
			this._domElement.setAttributeNode(idAttr);
			
			let classAttr = document.createAttribute("class");
			classAttr.nodeValue = "avatar " + this._baseCssClass;
			this._domElement.setAttributeNode(classAttr);
			
			projectionScreen2D_DOM.appendChild(this._domElement);
			
			if(this._imageUrl.length > 0) {
				$("div#" + this._domId).append("<img src=\"" + this._imageUrl + "\" class=\"avatar_image\" alt=\"\" width=\"" + this._projection._projectedWidth + "\" height=\""+ this._projection._projectedHeight + "\" />");
			}
			
			if(!this._hideLabel) {
				let labelDOM = document.createElement("div");
				let labelClassAttr = document.createAttribute("class");
				labelClassAttr.nodeValue = "avatarLabel";
				labelDOM.setAttributeNode(labelClassAttr);
				
				let labelTextNode = document.createTextNode(this._label);
				labelDOM.appendChild(labelTextNode);
				this._domElement.appendChild(labelDOM);
			}
			
			// Register event handlers
			$("div#" + this._domId).on("click", null, this._domId, JSpective._singleton.handleClickAvatar);
			$("div#" + this._domId).on("mouseover", null, this._domId, JSpective._singleton.handleMouseOverAvatar);
			$("div#" + this._domId).on("mouseout", null, this._domId, JSpective._singleton.handleMouseOutAvatar);
		}
	}


	// Public methods
	// --------------

	// Implements interface ProjectionUser
	public reachedTarget(): void {
		if(this._isOpened) {
			// Switch to next menu level (exactly now on menu avatars arrival!)
			JSpective._singleton._activeMenuId = JSpective._singleton._activeMenuId + 1;
			
			// Retry interval: show avatars of submenu if request has finished (MenuLevel._isLoaded)
			// (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
			//JSpective._singleton._openMenuInterval = window.setInterval("JSpective._singleton._menuStack[JSpective._singleton._activeMenuId].finishedLoading()", JSpective._singleton._openMenuPeriod);
			JSpective._singleton._openMenuInterval = window.setInterval(JSpective._singleton.handleOpenMenuInterval, JSpective._singleton._openMenuPeriod);
			
			//position menu toolbar
			JSpective._singleton._uniqueMenuToolbar.warpToActiveMenu();
		}
		this._projection._speed = JSpective._singleton._defaultSpeed;
		this._isSelfTargeting = false;
	}


	// Implements interface ProjectionUser
	public updateDOM(): void {
		//let AvatarDOM = document.getElementById(this._domId);
		this._domElement.style.left = this._projection._projectedX + "px";
		this._domElement.style.top = this._projection._projectedY + "px";
		this._domElement.style.width = this._projection._projectedWidth + "px";
		
		// Note: avatarHeight is auto-ajusted according to its child-elements
		//this._domElement.style.height = this._projection._projectedHeight + "px";
		
		this._domElement.style.fontSize = this._projection._projectedFontsize + "pt";
		this._domElement.style.zIndex = (JSpective._singleton._virtualSpaceDepth + 100) - this._projection._posZ;
		
		if(this._imageUrl.length > 0) {
			let imgDom = this._domElement.getElementsByTagName("img")[0];
			if(imgDom != undefined) {
				imgDom.width = this._projection._projectedWidth;
				imgDom.height = this._projection._projectedHeight;
			}
		}
		// Uncomment for debugging purposes
		//$("div#" + this._domId).empty().append(this._label + "any debug info");
	}


	// Implements interface ProjectionUser
	public removeDOM(): void {
		$("div#" + this._domId).remove();
	}


	// Implements interface ProjectionUser
	public showDOM(): void {
		$("div#" + this._domId).show();
	}


	// Implements interface ProjectionUser
	public hideDOM(): void {
		$("div#" + this._domId).hide();
	}

	// Implements interface MenuItem
	public openItem(): void {
		this._isMouseOver = false; // Free from mouseover effects
		this._isOpened = true;
		this._isSelfTargeting = true;
		this._projection._speed = 35;
		let targetX = -100;
		let targetY = (JSpective._singleton._menuStack[JSpective._singleton._activeMenuId]._groundLevel) - (JSpective._singleton._levelHeight * 0.8);
		let targetZ = 0;
		this._projection.setTargetPosition(targetX, targetY, targetZ);
		
		$("div#" + this._domId).addClass("opened");
	}


	// Implements interface MenuItem
	public closeItem(): void {
		this._isMouseOver = false; //free from mouse over effects
		
		let activeMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId];
		
		// Unload menu
		activeMenuLevel._isLoaded = false;
		
		// Remove related avatars
		for(let item of activeMenuLevel._items) {
			item._isParked = true;
			item._isSelfTargeting = false;
			item.removeDOM();
		}
		
		//---------- ACTIVE LEVEL SWITCH ---------------------------------------------------
		// Drop menu from stack
		JSpective._singleton._menuStack.pop();
		// Decrease menu level count
		JSpective._singleton._activeMenuId = JSpective._singleton._activeMenuId - 1;
		//-----------------------------------------------------------------------------------
		
		// Move toolbar to decreased level
		if(JSpective._singleton._activeMenuId > 0) {
			JSpective._singleton._uniqueMenuToolbar.warpToActiveMenu();
		} else {
			// Init to main menu level
			JSpective._singleton._uniqueMenuToolbar._projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in JSpective)
		}
		
		// Free the menu avatar that is being closed
		this._projection._speed = JSpective._singleton._defaultSpeed;
		this._isOpened = false;
		this._isSelfTargeting = false;
		$("div#" + this._domId).removeClass("opened");
		
		let newActiveMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId];
		let i = 0;
		for(let item of newActiveMenuLevel._items) {
			// Free avatars of reactivated menu from parking position
			if(i != this._id) {
				// Hint: Not all avatars may have been reset to the default speed, yet - So we ensure that here.
				//       Is this a potential FIXME? => Can the reset to default speed be savely done earlier elsewhere,
				//       making following line unnecessary?
				item._projection._speed = JSpective._singleton._defaultSpeed;
				
				item._isParked = false;
				item._isSelfTargeting = false;
			}
			
			i++;
		}
		
		// If exists, free parent menu avatar of reactivated menu
		if(JSpective._singleton._activeMenuId > 0) {
			let parentMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId - 1];
			for(let item of parentMenuLevel._items) {
				if(item._isOpened) {
					item._isParked = false;
				}
			}
		}
	}


	// Implements interface MenuItem
	public handleClick(): void {
		this._isMouseOver = false; // Free from mouseover effects
		
		if(!this._isParked) {
			if(!this._isOpened) {
				// Menu avatar is clicked to be opened. Make a request to server to fetch content.
				if(this._dataUrl.length > 0) {
					// Park the parent menu avatar of current menu, if exists
					if( JSpective._singleton._activeMenuId > 0) {
						let parentMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId - 1];
						for(let item of parentMenuLevel._items) {
							if(item._isOpened) {
								item._isParked = true;
							}
						}
					}
					
					// Close all other opened avatars and page viewer of active menu
					if(JSpective._singleton._uniquePageViewer._isOpened) {
						JSpective._singleton._uniquePageViewer.closeView();
					}
					let activeMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId];
					let i = 0;
					for(let item of activeMenuLevel._items) {
						if(i != this._id) {
							if(item._isOpened) {
								item.closeItem();
							}
							// Send avatar to parking position
							item._isParked = true;
							item._isSelfTargeting = true;
							item._projection._speed = 35;
							let targetX = JSpective._singleton._virtualSpaceWidth / 2 + (i * 40);
							let targetY = activeMenuLevel._groundLevel + 300;
							let targetZ = JSpective._singleton._virtualSpaceDepth - (i * 30);
							item._projection.setTargetPosition(targetX, targetY, targetZ);
						}//if
						
						i++
					}//for
					
					// Put new submenu onto stack
					let submenu = new MenuLevel(JSpective._singleton._activeMenuId + 1, activeMenuLevel._groundLevel - JSpective._singleton._levelHeight, this);
					JSpective._singleton._menuStack.push(submenu);
					
					// Move to front
					this.openItem();
					
					// Request menu data from server
					submenu.requestMenuData(this._dataUrl);
					
				} else {
					alert("Submenu has no link set. Can't open");
				}//if _dataUrl
				
			} else {	
				// Submenu is currently opened
				
				if(this._isSelfTargeting) {
					// Ignore click for now. TODO: Accept click to cancel opening
				} else {
					this.closeItem();
				}	
			}//if isOpened
			
		} else {
			// Avatar is currently parked
			
			// Iterate top-down over every menu level
			// and close all avatars (menus and pages) until the menu level of the clicked avatar is active.
			while(JSpective._singleton._activeMenuId > this._parentMenu._id) {
				let prevMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId - 1];
				for(let item of prevMenuLevel._items) {
					if(item._isOpened) {
						item.closeItem();
					}
				}
			}
		}//if isParked
		
	}


	// Implements interface MenuItem
	public handleMouseOver(): boolean {
		if(!this._isOpened) {
			this._isMouseOver = true;
			$("div#" + this._domId).addClass("hover");
		}
		return false;
	}


	// Implements interface MenuItem
	public handleMouseOut(): boolean {	
		this._isMouseOver = false;
		$("div#" + this._domId).removeClass("hover");
		return false;
	}

} // end class
