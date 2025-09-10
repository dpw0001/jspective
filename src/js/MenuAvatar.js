// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class MenuAvatar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_domElement;
	
	// Implements interface ProjectionUser
	_projection;
	_domId;
	
	// Implements interface Avatar
	_label;
	_hideLabel;
	_baseCssClass;
	_imageUrl;
	
	// Implements interface MenuItem
	_dataUrl;
	_parentMenu;
	_isSelfTargeting;
	_isOpened;
	_isParked;
	_isClosing;
	_isMouseOver;

	_defaultMenuMode;
	
	constructor(id, label, hideLabel, dataUrl, parentMenu, width, height, baseCssClass, imageUrl, defaultMenuMode) {
		this._id = id;
		
		this._projection = new Projection(id, this, width, height, globalThis.JSPECTIVE._defaultFontSize, globalThis.JSPECTIVE._initVanishX, globalThis.JSPECTIVE._initVanishY, globalThis.JSPECTIVE._initVanishZ, globalThis.JSPECTIVE._defaultSpeed);
		this._projection._parent = this; // Register this Avatar with its child Projection for callbacks
		this._domId = "Avatar_" + parentMenu._id + "_" + id;
		this._domElement = null;
		
		this._label = label;
		this._hideLabel = hideLabel;
		this._baseCssClass = baseCssClass;
		this._imageUrl = imageUrl;
		
		this._dataUrl = dataUrl;
		this._parentMenu = parentMenu;
		this._isSelfTargeting = 0;
		this._isOpened = 0;
		this._isParked = 0;
		this._isClosing = 0;
		this._isMouseOver = 0;
		
		this._defaultMenuMode = defaultMenuMode;
		
		this.createDOM();
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Implements interface ProjectionUser
	reachedTarget() {
		if(this._isOpened == 1) {
			// Switch to next menu level (exactly now on menu avatars arrival!)
			globalThis.JSPECTIVE._activeMenuId = globalThis.JSPECTIVE._activeMenuId + 1;
			
			// Retry interval: show avatars of submenu if request has finished (MenuLevel._isLoaded)
			// (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
			globalThis.JSPECTIVE._openMenuInterval = window.setInterval("globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId].finishedLoading()", globalThis.JSPECTIVE._openMenuPeriod);
			
			//position menu toolbar
			globalThis.JSPECTIVE._uniqueMenuToolbar.warpToActiveMenu();
		}
		this._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
		this._isSelfTargeting = 0;
	}


	// Implements interface ProjectionUser
	createDOM() { 
		let ProjectionScreen2D_DOM =  document.getElementById('ProjectionScreen2D');
		this._domElement = document.createElement("div");
		
		let idAttr = document.createAttribute("id");
		idAttr.nodeValue = this._domId;
		this._domElement.setAttributeNode(idAttr);
		
		let classAttr = document.createAttribute("class");
		classAttr.nodeValue = "avatar " + this._baseCssClass;
		this._domElement.setAttributeNode(classAttr);
		
		ProjectionScreen2D_DOM.appendChild(this._domElement);
		
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
		$("div#" + this._domId).on("click", null, this._domId, globalThis.JSPECTIVE.handleClickAvatar);
		$("div#" + this._domId).on("mouseover", null, this._domId, globalThis.JSPECTIVE.handleMouseOverAvatar);
		$("div#" + this._domId).on("mouseout", null, this._domId, globalThis.JSPECTIVE.handleMouseOutAvatar);
	}


	// Implements interface ProjectionUser
	updateDOM() {
		//let AvatarDOM = document.getElementById(this._domId);
		this._domElement.style.left = this._projection._projectedX + "px";
		this._domElement.style.top = this._projection._projectedY + "px";
		this._domElement.style.width = this._projection._projectedWidth + "px";
		
		// Note: avatarHeight is auto-ajusted according to its child-elements
		//this._domElement.style.height = this._projection._projectedHeight + "px";
		
		this._domElement.style.fontSize = this._projection._projectedFontsize + "pt";
		this._domElement.style.zIndex = (globalThis.JSPECTIVE._virtualSpaceDepth + 100) - this._projection._posZ;
		
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
	removeDOM() {
		$("div#" + this._domId).remove();
	}


	// Implements interface ProjectionUser
	showDOM() {
		$("div#" + this._domId).show();
	}


	// Implements interface ProjectionUser
	hideDOM() {
		$("div#" + this._domId).hide();
	}

	// Implements interface MenuItem
	openItem() {
		this._isMouseOver = 0; // Free from mouseover effects
		this._isOpened = 1;
		this._isSelfTargeting = 1;
		this._projection._speed = 35;
		let targetX = -100;
		let targetY = (globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._groundLevel) - (globalThis.JSPECTIVE._levelHeight * 0.8);
		let targetZ = 0;
		this._projection.setTargetPosition(targetX, targetY, targetZ);
		
		$("div#" + this._domId).addClass("opened");
	}


	// Implements interface MenuItem
	closeItem() {
		this._isMouseOver = 0; //free from mouse over effects
		
		// Unload menu
		globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._isLoaded = 0;
		
		// Remove related avatars
		for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items.length; i++) {
			globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isParked = 1;
			globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isSelfTargeting = 0;
			globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i].removeDOM();
		}
		
		//---------- ACTIVE LEVEL SWITCH ---------------------------------------------------
		// Drop menu from stack
		globalThis.JSPECTIVE._menuStack.pop();
		// Decrease menu level count
		globalThis.JSPECTIVE._activeMenuId = globalThis.JSPECTIVE._activeMenuId - 1;
		//-----------------------------------------------------------------------------------
		
		// Move toolbar to decreased level
		if(globalThis.JSPECTIVE._activeMenuId > 0) {
			globalThis.JSPECTIVE._uniqueMenuToolbar.warpToActiveMenu();
		} else {
			// Init to main menu level
			globalThis.JSPECTIVE._uniqueMenuToolbar._projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in JSpectiveMain)
		}
		
		// Free the menu avatar that is being closed
		this._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
		this._isOpened = 0;
		this._isSelfTargeting = 0;
		$("div#" + this._domId).removeClass("opened");
		
		for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items.length; i++) {
			// Free avatars of reactivated menu from parking position
			if(i != this._id) {
				// Hint: Not all avatars may have been reset to the default speed, yet - So we ensure that here.
				//       Is this a potential FIXME? => Can the reset to default speed be savely done earlier elsewhere,
				//       making following line unnecessary?
				globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
				
				globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isParked = 0;
				globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isSelfTargeting = 0;
			}
		}
		
		// If exists, free parent menu avatar of reactivated menu
		if(globalThis.JSPECTIVE._activeMenuId > 0) {
			for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items.length; i++) {
				if(globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items[i]._isOpened == 1) {
					globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items[i]._isParked = 0;
				}
			}
		}
	}


	// Implements interface MenuItem
	handleClick() {
		this._isMouseOver = 0; // Free from mouseover effects
		
		if(this._isParked == 0) {
			if(this._isOpened == 0) {
				// Menu avatar is clicked to be opened. Make a request to server to fetch content.
				if(this._dataUrl.length > 0) {
					// Park the parent menu avatar of current menu, if exists
					if( globalThis.JSPECTIVE._activeMenuId > 0) {
						for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items.length; i++) {
							if(globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items[i]._isOpened) {
								globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId - 1]._items[i]._isParked = 1;
							}
						}
					}
					
					// Close all other opened avatars and page viewer of active menu
					if(globalThis.JSPECTIVE._uniquePageViewer._isOpened) { globalThis.JSPECTIVE._uniquePageViewer.closeView(); }
					for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items.length; i++) {
						if(i != this._id) {
							if(globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isOpened == 1) {
								globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i].closeItem();
							}
							// Send avatar to parking position
							globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isParked = 1;
							globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isSelfTargeting = 1;
							globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._projection._speed = 35;
							let targetX = globalThis.JSPECTIVE._virtualSpaceWidth / 2 + (i * 40);
							let targetY = globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._groundLevel + 300;
							let targetZ = globalThis.JSPECTIVE._virtualSpaceDepth - (i * 30);
							globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._projection.setTargetPosition(targetX, targetY, targetZ);
						}//if
					}//for
					
					// Put new submenu onto stack
					let submenu = new MenuLevel(globalThis.JSPECTIVE._activeMenuId + 1, globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._groundLevel - globalThis.JSPECTIVE._levelHeight, this);
					globalThis.JSPECTIVE._menuStack.push(submenu);
					
					// Move to front
					this.openItem();
					
					// Request menu data from server
					submenu.requestMenuData(this._dataUrl);
					
				} else {
					alert("Submenu has no link set. Can't open");
				}//if _dataUrl
				
			} else {	
				// Submenu is currently opened
				
				if(this._isSelfTargeting == 1) {
					// Ignore click for now. TODO: Accept click to cancel opening
				} else {
					this.closeItem();
				}	
			}//if isOpened
			
		} else {
			// Avatar is currently parked
			
			// Iterate top-down over every menu level
			// and close all avatars (menus and pages) until the menu level of the clicked avatar is active.
			while(globalThis.JSPECTIVE._activeMenuId > this._parentMenu._id) {
				let prevMenuLevel = globalThis.JSPECTIVE._activeMenuId - 1;
				for(let i=0; i < globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items.length; i++) {
					if(globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items[i]._isOpened == 1) {
						globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items[i].closeItem();
					}
				}
			}
		}//if isParked
		
	}


	// Implements interface MenuItem
	handleMouseOver() {
		if(this._isOpened == 0) {
			this._isMouseOver = 1;
			$("div#" + this._domId).addClass("hover");
		}
		return false;
	}


	// Implements interface MenuItem
	handleMouseOut() {	
		this._isMouseOver = 0;
		$("div#" + this._domId).removeClass("hover");
		return false;
	}

} // end class
