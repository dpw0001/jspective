// ------------------------------------------------------------------
// JSpective - Minimalistic JavaScript 3D API
//           - A playful experimental toy and demo project
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Version: 0.3.30
// Release date: 04.09.2025
// Project home: http://www.softwareagent.de
// ------------------------------------------------------------------
// MIT License
//
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ------------------------------------------------------------------
class JSpectiveMain {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------
	
	_mainMenuUrl;
	
	_viewportWidth;
	_viewportHeight;
	_virtualSpaceWidth;
	_virtualSpaceHeight;
	_virtualSpaceDepth;
	_groundLevelY;
	_levelHeight;
	
	//       /+z     [the bigger z, the futher to the back]
	//     /
	//   /
	// 0--------------- +x
	//  |
	//  |+y        [ (0/0/0) is at position of DOM-element <div id="ProjectionScreen2D"/> ]
	_initVanishX;
	_initVanishY;
	_initVanishZ;
	
	_defaultSpeed;
	_defaultFontSize;
	
	_mainInterval; // General animation interval trigger.
	_intervalPeriod; // Time in milliseconds
	_openMenuInterval; // Menu checks if request to server has finished (before populating a submenu)
	_openMenuPeriod;
	
	_menuStack;
	_activeMenuId;
	_menuItemTypeMenu;
	_menuItemTypePage;
	_menuItemTypeLink;
	_tempAnimationStack;
	_uniquePageViewer;
	_uniqueMenuToolbar;

	_projectionScreen2dDom;

	constructor() {
		this._mainMenuUrl = "menus/main-menu.xml";
		
		this._viewportWidth = 0;
		this._viewportHeight = 0;
		
		this._virtualSpaceWidth = 600;
		this._virtualSpaceHeight = 600;
		this._virtualSpaceDepth = 350;
		this._groundLevelY = 320;
		this._levelHeight = 140;
		this._initVanishX = parseInt(this._virtualSpaceWidth / 2);
		this._initVanishY = this._groundLevelY - 220;
		this._initVanishZ = -210;
		this._defaultSpeed = 5;
		this._defaultFontSize = 12;
		
		this._mainInterval = null;
		this._intervalPeriod = 150;
		this._openMenuInterval = null;
		this._openMenuPeriod = 150;
		
		this._menuStack = new Array();
		this._activeMenuId = 0;
		this._menuItemTypeMenu = "menu";
		this._menuItemTypePage = "page";
		this._menuItemTypeLink = "link";
		this._tempAnimationStack = new Array();
		this._uniquePageViewer = "";
		this._uniqueMenuToolbar = "";
		
		this._projectionScreen2dDom = document.getElementById('ProjectionScreen2D');
		
		// Bind event handlers to this
		// ---------------------------
		this.init = this.init.bind(this);
		this.handleClickAvatar = this.handleClickAvatar.bind(this);
		this.handleMouseOverAvatar = this.handleMouseOverAvatar.bind(this);
		this.handleMouseOutAvatar = this.handleMouseOutAvatar.bind(this);
		this.handleClickPageViewer = this.handleClickPageViewer.bind(this);
		this.handleClickPageViewerShadow = this.handleClickPageViewerShadow.bind(this);
		this.handleMenuToolAxis = this.handleMenuToolAxis.bind(this);
		this.handleMenuToolClockwise = this.handleMenuToolClockwise.bind(this);
		this.handleMenuToolMode = this.handleMenuToolMode.bind(this);
		this.handleClickBackground = this.handleClickBackground.bind(this);
		this.handleMenuToolClockwise = this.handleMenuToolClockwise.bind(this);
		this.handleMenuToolClockwise = this.handleMenuToolClockwise.bind(this);
		this.handleOnResizeViewport = this.handleOnResizeViewport.bind(this);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Call this method to initialize JSpective.
	//
	// When the parameters mainMenuUrl and menuItemRecords are both null,
	// the default URL "menu/my-main-menu.xml" is used to load the initial main menu data.
	//
	// When parameter mainMenuUrl is given AND parameter menuItemRecords is null,
	// the data for the first menu level is loaded via request from a XML file
	// from the specified URL.
	//
	// When parameter menuItemsRecords (containing manually configured menu data) is given,
	// no URL is requested and the initial main menu data is taken from the parameter
	// (see class MenuItemRecords). This minimizes latency for the user during initial page-load,
	// with the downside, that the main menu is not configurable via an XML file anymore.
	//
	// The parameter showInitialPage is a flag to control the initial display of
	// a start page (content inside tag <div id="PageViewer_0"> in the index.html).
	// Set parameter showInitialPage to true, to initially display that page
	// instead of the animated main menu on startup.
	init(mainMenuUrl, menuItemRecords, showInitialPage) {
		// Register handler for browser resizing
		window.visualViewport.addEventListener("resize", this.handleOnResizeViewport);
		// Call handler once manually for init purposes
		this.handleOnResizeViewport(null);
		
		this._uniquePageViewer = new PageViewer(0);
		$("div#PageViewer_0").on("click", null, null, this.handleClickPageViewer); // Needed to abort event cascade
		$("div#PageViewer_0 div.page_viewer_title").on("click", null, null, this.handleClickPageViewerShadow);
		$("div#ProjectionScreen2D").on("click", null, null, this.handleClickBackground);
		
		this._uniqueMenuToolbar = new MenuToolbar(0, "Toolbar", 130, 55, "transparent", "var(--color-teal)", "var(--color-grey)", "");
		this._uniqueMenuToolbar._projection._vanishX = 50;
		this._uniqueMenuToolbar._projection._vanishY = 50;
		this._uniqueMenuToolbar._projection._vanishZ = -210;
		this._uniqueMenuToolbar._projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in MenuAvatar)
		//_tempAnimationStack.push(this._uniqueMenuToolbar);
		
		this.logConfig();
		
		this.loadInitialMenu(mainMenuUrl, menuItemRecords);
		
		if(!showInitialPage) {
			// Initialy hide page viewer and start animation loop
			$("div#PageViewer_0").hide(); 
			this.startAnimation();
		}
	}


	loadInitialMenu(mainMenuUrl, menuItemRecords) {
		let mainMenu = new MenuLevel(this._activeMenuId, this._groundLevelY, null);
		this._menuStack.push(mainMenu);
		
		if(menuItemRecords != null) {
			mainMenu.populate(menuItemRecords);
			mainMenu.finishedLoading();
			
		} else {
			if(mainMenuUrl != null && mainMenuUrl.length > 0) {
				this._mainMenuUrl = mainMenuUrl;
			}
			
			mainMenu.requestMenuData(this._mainMenuUrl);
			// Retry interval: show avatars of submenu if request has finished (MenuLevel._isLoaded)
			// (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
			globalThis.JSPECTIVE._openMenuInterval = window.setInterval("globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId].finishedLoading()", globalThis.JSPECTIVE._openMenuPeriod);
		}
	}


	logConfig() {
		console.debug("JSpective - current config:")
		console.debug("  _virtualSpaceWidth = " + this._virtualSpaceWidth);
		console.debug("  _virtualSpaceHeight = " + this._virtualSpaceHeight);
		console.debug("  _virtualSpaceDepth = " + this._virtualSpaceDepth);
		console.debug("  _groundLevelY = " + this._groundLevelY);
		console.debug("  _levelHeight = " + this._levelHeight);
		console.debug("  _initVanishX = " + this._initVanishX);
		console.debug("  _initVanishY = " + this._initVanishY);
		console.debug("  _initVanishZ = " + this._initVanishZ);
		console.debug("  _defaultSpeed = " + this._defaultSpeed);
		console.debug("  _defaultFontSize = " + this._defaultFontSize);
		console.debug("  _intervalPeriod = " + this._intervalPeriod);
		console.debug("  _openMenuPeriod = " + this._openMenuPeriod);
	}


	// DOM event handlers (related to Avatars --- no, change names to MenuItems! )
	// ---------------------------------------------------------------------------

	// TODO: Rename handleClickMenuItem()
	handleClickAvatar(event) {
		let domIdAry = event.data.split("_");
		// Delegate action
		this._menuStack[domIdAry[1]]._items[domIdAry[2]].handleClick();
		
		return false; // Stop event cascade
	}


	handleMouseOverAvatar(event) {
		let domIdAry = event.data.split("_");
		// Respond only to mouse over avatars in active menu
		if(domIdAry[1] == this._activeMenuId) {
			this._menuStack[domIdAry[1]]._items[domIdAry[2]].handleMouseOver();
			if(this._menuStack[domIdAry[1]]._items[domIdAry[2]]._isExternalPage == 1) {
				// For external link avatars: Update browser status bar
				window.status = this._menuStack[domIdAry[1]]._items[domIdAry[2]]._dataUrl;
			}
		}
		
		return false;
	}


	handleMouseOutAvatar(event) {
		//let ary = $(this).attr("id").split("_");
		let domIdAry = event.data.split("_");
		// Respond only to mouse out of avatars in active menu
		if(domIdAry[1] == this._activeMenuId) {
			this._menuStack[domIdAry[1]]._items[domIdAry[2]].handleMouseOut();
			if(this._menuStack[domIdAry[1]]._items[domIdAry[2]]._isExternalPage == 1) {
				// For external link avatars: update browser status bar
				window.status = "";
			}
		}
		
		return false;
	}


	// DOM event handlers (related to PageViewer)
	// ------------------------------------------

	handleClickPageViewer(event) {
		return false;
	}


	handleClickPageViewerShadow(event) {
		this._uniquePageViewer.closeView();
		return false;
	}


	handleClickAnchor(event) {
		//alert($(this).attr("href") + " clicked");
		let url = event.currentTarget.attributes["href"].nodeValue;
		let targetAttrVal = "_self";
		let targetAttr = event.currentTarget.attributes["target"];
		if(targetAttr != null && targetAttr.nodeValue.length > 0) {
			targetAttrVal = targetAttr.nodeValue;
		}
		//window.open(url, "WindowId", "location=yes, menubar=yes, scrollbars=yes, resizable=yes, toolbar=yes");
		window.open(url, targetAttrVal);
		return false;
	}
	

	// DOM event handlers (related to MenuToolbar)
	// -------------------------------------------

	handleMenuToolAxis(event) {
		if(this._menuStack[this._activeMenuId]._isHorizontal == 0) {
			this._menuStack[this._activeMenuId]._isHorizontal = 1;
			for(let i=0; i < this._menuStack[this._activeMenuId]._items.length; i++) {
				// Position vanishing point slighted to the left/right
				this._menuStack[this._activeMenuId]._items[i]._projection._vanishX = this._menuStack[this._activeMenuId]._items[i]._projection._vanishX + 80;
			}//for
			
		} else {
			this._menuStack[this._activeMenuId]._isHorizontal = 0;
			for(let i=0; i < this._menuStack[this._activeMenuId]._items.length; i++) {
				this._menuStack[this._activeMenuId]._items[i]._projection._vanishX = this._menuStack[this._activeMenuId]._items[i]._projection._vanishX - 80;
			}//for
		}//if
		
		return false;
	}


	handleMenuToolClockwise(event) {
		if(this._menuStack[this._activeMenuId]._clockwise == 1) {
			this._menuStack[this._activeMenuId]._clockwise = -1;
		} else {
			this._menuStack[this._activeMenuId]._clockwise = 1;
		}
		return false;
	}


	handleMenuToolMode(event) {
		if(this._menuStack[this._activeMenuId]._animationMode == "wheel") {
			this._menuStack[this._activeMenuId]._animationMode = "shuffle";
			this._menuStack[this._activeMenuId].reshuffle();
		} else {
			this._menuStack[this._activeMenuId]._animationMode = "wheel";
		}
		return false;
	}


	// DOM event handler (related to HelpAgent)
	// ----------------------------------------

	//handleToggleHelpAgent() {
	//	if(HELP_AGENT._isOpened == 1) {
	//		HELP_AGENT._isClosing = 1;
	//		HELP_AGENT._isOpened = 0;
	//		HELP_AGENT._projection._speed = 45;
	//		HELP_AGENT._projection.setTargetPosition(10, 10, 300);
	//		HELP_AGENT._isSelfTargeting = 1; //send to back
	//	} else {
	//		HELP_AGENT._isOpened = 1;
	//		HELP_AGENT._projection._speed = 45;
	//		HELP_AGENT._projection.setTargetPosition(10, 10, 50);
	//		HELP_AGENT._isSelfTargeting = 1; //bring to front
	//	}
	//	return false;
	//}


	// class-unrelated DOM event handlers
	// ----------------------------------

	handleClickBackground(event) {
	
		if(this._uniquePageViewer._isOpened == 1) {
			this._uniquePageViewer.closeView();
			return false;
		}
		
		if(this._menuStack[this._activeMenuId]._animationMode == "wheel") {
			// Switch wheel direction
			if(this._menuStack[this._activeMenuId]._clockwise == 1) {
				this._menuStack[this._activeMenuId]._clockwise = -1;
			} else {
				this._menuStack[this._activeMenuId]._clockwise = 1;
			}
			return false;
		}
		
		if(this._menuStack[this._activeMenuId]._animationMode == "shuffle") {
			// Shuffle avatars of active menu
			this._menuStack[this._activeMenuId].reshuffle();
			return false;
		}
	}


	handleOnResizeViewport(event) {
		this._viewportWidth = window.visualViewport.width;
		this._viewportHeight = window.visualViewport.height;
		
		$("div#container").css("height", this._viewportHeight);
		
		console.debug("Viewport height: " + this._viewportHeight);
	}


	keyPress (e) {
		if(e.key === "Escape") {
			// TODO: Implement handling escape key
		}
	}


	//Helper functions for animation interval control
	// -----------------------------------------------

	startAnimation() {
		if(this._mainInterval == null) {
			this._mainInterval = window.setInterval("globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId].animate()", this._intervalPeriod);
		} else {
			alert("Application misbehaviour: Trying to start second animation interval!");
		}
	}


	stopAnimation() {
		if(this._mainInterval != null) {
			window.clearInterval(this._mainInterval);
			this._mainInterval = null; // Needs manual clearance for "exists-checks"
		}
	}

} // end class
