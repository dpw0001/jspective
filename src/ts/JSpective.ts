// ------------------------------------------------------------------
// JSpective - Minimalistic JavaScript 3D API
//           - A playful experimental toy and demo project
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Version: 0.3.30
// Release date: 11.09.2025
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
// furnished to do so, subject to  the following conditions:
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
import { MenuToolbar } from './MenuToolbar.js';
import { MenuLevel } from './MenuLevel.js';
import { PageViewer } from './PageViewer.js';
import { MenuItemRecords } from './MenuItemRecords.js';

export class JSpective {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------
	public static _singleton: JSpective;
	
	public _enableDebug: boolean = true;
	
	public _mainMenuUrl: string;
	
	public _viewportWidth: number;
	public _viewportHeight: number;
	public _virtualSpaceWidth: number;
	public _virtualSpaceHeight: number;
	public _virtualSpaceDepth: number;
	public _groundLevelY: number;
	public _levelHeight: number;
	
	//       /+z     [the bigger z, the futher to the back]
	//     /
	//   /
	// 0--------------- +x
	//  |
	//  |+y        [ (0/0/0) is at position of DOM-element <div id="ProjectionScreen2D"/> ]
	public _initVanishX: number;
	public _initVanishY: number;
	public _initVanishZ: number;
	
	public _defaultSpeed: number;
	public _defaultFontSize: number;
	
	public _mainInterval: number|undefined; // General animation interval trigger. TODO: rename to _mainIntervalId
	public _intervalPeriod: number; // Time in milliseconds
	public _openMenuInterval: number|undefined; // Menu checks if request to server has finished (before populating a submenu) TODO: rename to _openMenuIntervalId
	public _openMenuPeriod: number;
	
	public _menuStack: any;
	public _activeMenuId: number;
	public _menuItemTypeMenu: string;
	public _menuItemTypePage: string;
	public _menuItemTypeLink: string;
	public _tempAnimationStack: Array<MenuToolbar>;
	public _uniquePageViewer: PageViewer;
	public _uniqueMenuToolbar: MenuToolbar;

	public _projectionScreen2dDom;

	constructor() {
		if(JSpective._singleton == undefined) {
			JSpective._singleton = this;
		} else {
			console.warn("JSpective._singleton already exists. Will not override!");
		}
		
		this._mainMenuUrl = "menus/main-menu.xml";
		
		this._viewportWidth = 0;
		this._viewportHeight = 0;
		
		this._virtualSpaceWidth = 600;
		this._virtualSpaceHeight = 600;
		this._virtualSpaceDepth = 350;
		this._groundLevelY = 320;
		this._levelHeight = 140;
		this._initVanishX = Math.round(this._virtualSpaceWidth / 2);
		this._initVanishY = this._groundLevelY - 220;
		this._initVanishZ = -210;
		this._defaultSpeed = 5;
		this._defaultFontSize = 12;
		
		this._mainInterval = undefined;
		this._intervalPeriod = 150;
		this._openMenuInterval = undefined;
		this._openMenuPeriod = 150;
		this._uniquePageViewer = new PageViewer(0);
		
		this._menuStack = new Array();
		this._activeMenuId = 0;
		this._menuItemTypeMenu = "menu";
		this._menuItemTypePage = "page";
		this._menuItemTypeLink = "link";
		this._tempAnimationStack = new Array();
		
		// TODO: Clean up code
		this._uniqueMenuToolbar = new MenuToolbar(0, "Toolbar", 130, 55, "transparent", "var(--color-teal)", "var(--color-grey)", "");
		this._uniqueMenuToolbar._projection._vanishX = 50;
		this._uniqueMenuToolbar._projection._vanishY = 50;
		this._uniqueMenuToolbar._projection._vanishZ = -210;
		this._uniqueMenuToolbar._projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in MenuAvatar)
		//_tempAnimationStack.push(this._uniqueMenuToolbar);
		
		this._projectionScreen2dDom = document.getElementById('ProjectionScreen2D');
		
		// Bind event handlers to this
		// ---------------------------
		this.init = this.init.bind(this);
		this.handleClickAvatar = this.handleClickAvatar.bind(this);
		this.handleMouseOverAvatar = this.handleMouseOverAvatar.bind(this);
		this.handleMouseOutAvatar = this.handleMouseOutAvatar.bind(this);
		this.handleClickPageViewer = this.handleClickPageViewer.bind(this);
		this.handleClickPageViewerShadow = this.handleClickPageViewerShadow.bind(this);
		this.handleClickBackground = this.handleClickBackground.bind(this);
		this.handleOnResizeViewport = this.handleOnResizeViewport.bind(this);
		this.handleAnimationInterval = this.handleAnimationInterval.bind(this);
		this.handleOpenMenuInterval = this.handleOpenMenuInterval.bind(this);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Call this method to initialize JSpective.
	//
	// When the parameters mainMenuUrl is empty and menuItemRecords is null,
	// the default URL "menu/my-main-menu.xml" is used to load the initial main menu data.
	//
	// When parameter mainMenuUrl is not empty AND parameter menuItemRecords is null,
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
	public init(mainMenuUrl: string, menuItemRecords: MenuItemRecords|null, showInitialPage: boolean): void {
		// Register handler for browser resizing
		if(window.visualViewport != null) {
			window.visualViewport.addEventListener("resize", this.handleOnResizeViewport);
		}
		// Call handler once manually for init purposes
		this.handleOnResizeViewport(null);
		
		$("div#PageViewer_0").on("click", null, null, this.handleClickPageViewer); // Needed to abort event cascade
		$("div#PageViewer_0 div.page_viewer_title").on("click", null, null, this.handleClickPageViewerShadow);
		$("div#ProjectionScreen2D").on("click", null, null, this.handleClickBackground);
		
		if(this._enableDebug) {
			this.logConfig();
		}
		
		this.loadInitialMenu(mainMenuUrl, menuItemRecords);
		
		if(!showInitialPage) {
			// Initialy hide page viewer and start animation loop
			$("div#PageViewer_0").hide(); 
			this.startAnimation();
		}
	}


	private loadInitialMenu(mainMenuUrl: string, menuItemRecords: MenuItemRecords|null): void {
		let mainMenu = new MenuLevel(this._activeMenuId, this._groundLevelY, null);
		this._menuStack.push(mainMenu);
		
		if(menuItemRecords != null) {
			mainMenu.populate(menuItemRecords);
			mainMenu.finishedLoading();
			
		} else {
			if(mainMenuUrl.length > 0) {
				this._mainMenuUrl = mainMenuUrl;
			}
			
			mainMenu.requestMenuData(this._mainMenuUrl);
			// Retry interval: show avatars of submenu if request has finished (MenuLevel._isLoaded)
			// (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
			//JSpective._singleton._openMenuInterval = window.setInterval("JSpective._singleton._menuStack[JSpective._singleton._activeMenuId].finishedLoading()", JSpective._singleton._openMenuPeriod);
			this._openMenuInterval = window.setInterval(this.handleOpenMenuInterval, this._openMenuPeriod);
		}
	}


	public handleOpenMenuInterval(): void {
		this._menuStack[this._activeMenuId].finishedLoading();
	}


	public logConfig(): void {
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
	public handleClickAvatar(event: any): boolean {
		let domIdAry = event.data.split("_");
		// Delegate action
		this._menuStack[domIdAry[1]]._items[domIdAry[2]].handleClick();
		
		return false; // Stop event cascade
	}


	public handleMouseOverAvatar(event: any): boolean {
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


	public handleMouseOutAvatar(event: any): boolean {
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

	public handleClickPageViewer(event: any): boolean {
		return false;
	}


	public handleClickPageViewerShadow(event: any): boolean {
		this._uniquePageViewer.closeView();
		return false;
	}


	public handleClickAnchor(event: any): boolean {
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
	


	// DOM event handler (related to HelpAgent)
	// ----------------------------------------

	//public handleToggleHelpAgent(): boolean {
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

	public handleClickBackground(event: any): boolean {
	
		let ret = true;
		
		if(this._uniquePageViewer._isOpened) {
			this._uniquePageViewer.closeView();
			ret = false;
		}
		
		if(this._menuStack[this._activeMenuId]._animationMode == "wheel") {
			// Switch wheel direction
			if(this._menuStack[this._activeMenuId]._clockwise == 1) {
				this._menuStack[this._activeMenuId]._clockwise = -1;
			} else {
				this._menuStack[this._activeMenuId]._clockwise = 1;
			}
			ret = false;
		}
		
		if(this._menuStack[this._activeMenuId]._animationMode == "shuffle") {
			// Shuffle avatars of active menu
			this._menuStack[this._activeMenuId].reshuffle();
			ret = false;
		}
		
		return ret;
	}


	public handleOnResizeViewport(event: any): void {
		let viewport = window.visualViewport;
		if(viewport == null) {
			console.warn("Your JavaScript environment has no support for window.visualViewport. Window-resizing events are ignored.")
			
		} else {
			this._viewportWidth = viewport.width;
			this._viewportHeight = viewport.height;
			
			$("div#container").css("height", this._viewportHeight);
			
			console.debug("Viewport height: " + this._viewportHeight);
		}
	}


	public keyPress(e: any): void {
		if(e.key === "Escape") {
			// TODO: Implement handling escape key
		}
	}


	//Helper functions for animation interval control
	// -----------------------------------------------

	public startAnimation(): void {
		if(this._mainInterval == undefined) {
			//this._mainInterval = window.setInterval("JSpective._singleton._menuStack[JSpective._singleton._activeMenuId].animate()", this._intervalPeriod);
			this._mainInterval = window.setInterval(this.handleAnimationInterval, this._intervalPeriod);
		} else {
			alert("Application misbehaviour: Trying to start second animation interval!");
		}
	}


	public handleAnimationInterval(): void {
		this._menuStack[this._activeMenuId].animate();
	}


	public stopAnimation(): void {
		if(this._mainInterval != undefined) {
			window.clearInterval(this._mainInterval);
			this._mainInterval = undefined; // Needs manual clearance for "exists-checks"
		}
	}

} // end class
