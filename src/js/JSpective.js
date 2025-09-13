// ------------------------------------------------------------------
// JSpective - Minimalistic JavaScript 3D API
//           - A playful experimental toy and demo project
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Version: 0.4.1
// Release date: 13.09.2025
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
import { EnumAnimationMode } from './Enums.js';
import { MenuStack } from './MenuStack.js';
export class JSpective {
    constructor() {
        // Private members
        // ---------------
        // None, yet.
        // Public members
        // --------------
        this.enableDebug = true;
        this.mainMenuUrl = "menus/main-menu.xml";
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.virtualSpaceWidth = 600;
        this.virtualSpaceHeight = 600;
        this.virtualSpaceDepth = 350;
        this.groundLevelY = 320;
        this.levelHeight = 140;
        this.initVanishX = Math.round(this.virtualSpaceWidth / 2);
        this.initVanishY = this.groundLevelY - 220;
        this.initVanishZ = -210;
        this.defaultSpeed = 5;
        this.defaultFontSize = 12;
        this.animationIntervalId = undefined;
        this.intervalPeriod = 150;
        this.openMenuIntervalId = undefined;
        this.openMenuPeriod = 150;
        this.uniquePageViewer = new PageViewer(this, 0);
        this.menuStack = new MenuStack();
        this.tempAnimationStack = new Array();
        this.uniqueMenuToolbar = new MenuToolbar(this, 0, "Toolbar", 130, 55, "transparent", "var(--color-teal)", "var(--color-grey)", "");
        this.uniqueMenuToolbar.projection.vanishX = 50;
        this.uniqueMenuToolbar.projection.vanishY = 50;
        this.uniqueMenuToolbar.projection.vanishZ = -210;
        this.uniqueMenuToolbar.projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in MenuAvatar)
        //this.tempAnimationStack.push(this.uniqueMenuToolbar);
        this.projectionScreen2dDom = document.getElementById('ProjectionScreen2D');
        // Bind event handlers to this
        // ---------------------------
        this.init = this.init.bind(this);
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
    init(mainMenuUrl, menuItemRecords, showInitialPage) {
        // Register handler for browser resizing
        if (window.visualViewport != null) {
            window.visualViewport.addEventListener("resize", this.handleOnResizeViewport);
        }
        // Call handler once manually for init purposes
        this.handleOnResizeViewport(null);
        $("div#PageViewer_0").on("click", null, null, this.uniquePageViewer.handleClickPageViewer); // Needed to abort event cascade
        $("div#PageViewer_0 div.page_viewer_title").on("click", null, null, this.uniquePageViewer.handleClickPageViewerShadow);
        $("div#ProjectionScreen2D").on("click", null, null, this.handleClickBackground);
        if (this.enableDebug) {
            this.logConfig();
        }
        this.loadInitialMenu(mainMenuUrl, menuItemRecords);
        if (!showInitialPage) {
            // Initialy hide page viewer and start animation loop
            $("div#PageViewer_0").hide();
            this.startAnimation();
        }
    }
    loadInitialMenu(mainMenuUrl, menuItemRecords) {
        let mainMenu = new MenuLevel(this, this.groundLevelY, null);
        this.menuStack.addMenuLevel(mainMenu);
        this.menuStack.increaseActiveMenuLevel();
        if (menuItemRecords != null) {
            mainMenu.populate(menuItemRecords);
            mainMenu.finishedLoading();
        }
        else {
            if (mainMenuUrl.length > 0) {
                this.mainMenuUrl = mainMenuUrl;
            }
            mainMenu.requestMenuData(this.mainMenuUrl);
            // Retry interval: show avatars of submenu if request has finished (MenuLevel.isLoaded)
            // (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
            this.openMenuIntervalId = window.setInterval(this.handleOpenMenuInterval, this.openMenuPeriod);
        }
    }
    handleOpenMenuInterval() {
        this.menuStack.getActiveMenuLevel().finishedLoading();
    }
    logConfig() {
        console.debug("JSpective - current config:");
        console.debug("  virtualSpaceWidth = " + this.virtualSpaceWidth);
        console.debug("  virtualSpaceHeight = " + this.virtualSpaceHeight);
        console.debug("  virtualSpaceDepth = " + this.virtualSpaceDepth);
        console.debug("  groundLevelY = " + this.groundLevelY);
        console.debug("  levelHeight = " + this.levelHeight);
        console.debug("  initVanishX = " + this.initVanishX);
        console.debug("  initVanishY = " + this.initVanishY);
        console.debug("  initVanishZ = " + this.initVanishZ);
        console.debug("  defaultSpeed = " + this.defaultSpeed);
        console.debug("  defaultFontSize = " + this.defaultFontSize);
        console.debug("  intervalPeriod = " + this.intervalPeriod);
        console.debug("  openMenuPeriod = " + this.openMenuPeriod);
    }
    handleClickAnchor(event) {
        let url = event.currentTarget.attributes["href"].nodeValue;
        let targetAttrVal = "_self";
        let targetAttr = event.currentTarget.attributes["target"];
        if (targetAttr != null && targetAttr.nodeValue.length > 0) {
            targetAttrVal = targetAttr.nodeValue;
        }
        window.open(url, targetAttrVal);
        return false;
    }
    handleClickBackground(event) {
        let ret = true;
        if (this.uniquePageViewer.isOpened) {
            this.uniquePageViewer.closeView();
            ret = false;
        }
        let activeMenuLevel = this.menuStack.getActiveMenuLevel();
        if (activeMenuLevel.animationMode == EnumAnimationMode.wheel) {
            // Switch wheel direction
            if (activeMenuLevel.clockwise == 1) {
                activeMenuLevel.clockwise = -1;
            }
            else {
                activeMenuLevel.clockwise = 1;
            }
            ret = false;
        }
        if (activeMenuLevel.animationMode == EnumAnimationMode.shuffle) {
            // Shuffle avatars of active menu
            activeMenuLevel.reshuffle();
            ret = false;
        }
        return ret;
    }
    handleOnResizeViewport(event) {
        let viewport = window.visualViewport;
        if (viewport == null) {
            console.warn("Your JavaScript environment has no support for window.visualViewport. Window-resizing events are ignored.");
        }
        else {
            this.viewportWidth = viewport.width;
            this.viewportHeight = viewport.height;
            $("div#container").css("height", this.viewportHeight);
            console.debug("Viewport height: " + this.viewportHeight);
        }
    }
    //Helper functions for animation interval control
    // -----------------------------------------------
    startAnimation() {
        if (this.animationIntervalId == undefined) {
            this.animationIntervalId = window.setInterval(this.handleAnimationInterval, this.intervalPeriod);
        }
        else {
            alert("Application misbehaviour: Trying to start second animation interval!");
        }
    }
    handleAnimationInterval() {
        this.menuStack.getActiveMenuLevel().animate();
    }
    stopAnimation() {
        if (this.animationIntervalId != undefined) {
            window.clearInterval(this.animationIntervalId);
            this.animationIntervalId = undefined; // Needs manual clearance for "exists-checks"
        }
    }
} // end class
//# sourceMappingURL=JSpective.js.map