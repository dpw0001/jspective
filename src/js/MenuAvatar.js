// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Avatar } from "./Avatar.js";
import { MenuLevel } from "./MenuLevel.js";
export class MenuAvatar extends Avatar {
    constructor(jspective, menuItemId, label, hideLabel, dataUrl, parentMenuLevel, width, height, baseCssClass, imageUrl, defaultAnimationMode) {
        let domId = "Avatar_" + parentMenuLevel.menuLevelIndex + "_" + menuItemId;
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
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.createDOM();
    }
    // Private methods
    // ---------------
    // Public methods
    // --------------
    // Implements interface IProjectionUser
    reachedTarget() {
        if (this.isOpened) {
            // Switch to next menu level (exactly now on menu avatars arrival!)
            this.jspective.menuStack.increaseActiveMenuLevel();
            // Retry interval: show avatars of submenu if request has finished (MenuLevel.isLoaded)
            // (Release interval in MenuLevel.finishedLoading() and on request error and timeout event handlers)
            this.jspective.openMenuIntervalId = window.setInterval(this.jspective.handleOpenMenuInterval, this.jspective.openMenuPeriod);
            //position menu toolbar
            this.jspective.uniqueMenuToolbar.warpToActiveMenu();
        }
        this.projection.speed = this.jspective.defaultSpeed;
        this.isSelfTargeting = false;
    }
    // Implements interface IMenuItem
    openItem() {
        this.isMouseOver = false; // Free from mouseover effects
        this.isOpened = true;
        this.isSelfTargeting = true;
        this.projection.speed = 35;
        let targetX = -100;
        let targetY = (this.jspective.menuStack.getActiveMenuLevel().groundLevel) - (this.jspective.levelHeight * 0.8);
        let targetZ = 0;
        this.projection.setTargetPosition(targetX, targetY, targetZ);
        document.addEventListener('keyup', this.handleKeyUp);
        $("div#" + this.domId).addClass("opened");
    }
    // Implements interface IMenuItem
    closeItem() {
        this.isMouseOver = false; //free from mouse over effects
        document.removeEventListener('keyup', this.handleKeyUp, false);
        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        // Unload menu
        activeMenuLevel.isLoaded = false;
        // Remove related avatars
        for (let item of activeMenuLevel.items) {
            item.isParked = true;
            item.isSelfTargeting = false;
            item.removeDOM();
        }
        //---------- ACTIVE LEVEL SWITCH ---------------------------------------------------
        // Drop menu from stack
        this.jspective.menuStack.dropMenuLevel();
        // Decrease menu level count
        //this.jspective.activeMenuId = this.jspective.activeMenuId - 1;
        //-----------------------------------------------------------------------------------
        // Move toolbar to decreased level
        if (this.jspective.menuStack.activeMenuLevelIndex > 0) {
            this.jspective.uniqueMenuToolbar.warpToActiveMenu();
        }
        else {
            // Init to main menu level
            this.jspective.uniqueMenuToolbar.projection.set3DPosition(-100, 400, 15); // FIXME: Use configurable values (Also in JSpective)
        }
        // Free the menu avatar that is being closed
        this.projection.speed = this.jspective.defaultSpeed;
        this.isOpened = false;
        this.isSelfTargeting = false;
        $("div#" + this.domId).removeClass("opened");
        let newActiveMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        let i = 0;
        for (let item of newActiveMenuLevel.items) {
            // Free avatars of reactivated menu from parking position
            if (i != this.menuItemId) {
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
        if (this.jspective.menuStack.activeMenuLevelIndex > 0) {
            let prevMenuLevel = this.jspective.menuStack.getPreviousMenuLevel();
            for (let item of prevMenuLevel.items) {
                if (item.isOpened) {
                    item.isParked = false;
                }
            }
        }
    }
    // Implements class Avatar
    handleClick() {
        this.isMouseOver = false; // Free from mouseover effects
        if (!this.isParked) {
            if (!this.isOpened) {
                // Menu avatar is clicked to be opened. Make a request to server to fetch content.
                if (this.dataUrl.length > 0) {
                    // Park the parent menu avatar of current menu, if exists
                    if (this.jspective.menuStack.activeMenuLevelIndex > 0) {
                        let prevMenuLevel = this.jspective.menuStack.getPreviousMenuLevel();
                        for (let item of prevMenuLevel.items) {
                            if (item.isOpened) {
                                item.isParked = true;
                            }
                        }
                    }
                    // Close all other opened avatars and page viewer of active menu
                    if (this.jspective.uniquePageViewer.isOpened) {
                        this.jspective.uniquePageViewer.closeView();
                    }
                    let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
                    let i = 0;
                    for (let item of activeMenuLevel.items) {
                        if (i != this.menuItemId) {
                            if (item.isOpened) {
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
                        } //if
                        i++;
                    } //for
                    // Put new submenu onto stack
                    let submenuLevel = new MenuLevel(this.jspective, activeMenuLevel.groundLevel - this.jspective.levelHeight, this);
                    this.jspective.menuStack.addMenuLevel(submenuLevel);
                    // Move to front
                    this.openItem();
                    // Request menu data from server
                    submenuLevel.requestMenuData(this.dataUrl);
                }
                else {
                    alert("Submenu has no link set. Can't open");
                } //if dataUrl
            }
            else {
                // Submenu is currently opened
                if (this.isSelfTargeting) {
                    // Ignore click for now. TODO: Accept click to cancel opening
                }
                else {
                    this.closeItem();
                }
            } //if isOpened
        }
        else {
            // Avatar is currently parked
            // Iterate top-down over every menu level
            // and close all avatars (menus and pages) until the menu level of the clicked avatar is active.
            while (this.jspective.menuStack.activeMenuLevelIndex > this.parentMenuLevel.menuLevelIndex) {
                let prevMenuLevel = this.jspective.menuStack.getPreviousMenuLevel();
                for (let item of prevMenuLevel.items) {
                    if (item.isOpened) {
                        item.closeItem();
                    }
                }
            }
        } //if isParked
        return false;
    }
    // Implements class Avatar
    handleMouseOver() {
        if (!this.isOpened) {
            this.isMouseOver = true;
            $("div#" + this.domId).addClass("hover");
        }
        return false;
    }
    // Implements class Avatar
    handleMouseOut() {
        this.isMouseOver = false;
        $("div#" + this.domId).removeClass("hover");
        return false;
    }
    handleKeyUp(event) {
        // FIXME: This closes the menu avatar (respectively reactivates its menu level), although the page viewer was closed via escape-key.
        //		if(event.key === "Escape" && this.isOpened) {
        //			let activeMenuLevelIndex = this.jspective.menuStack.activeMenuLevelIndex;
        //			let parentMenuLevelIndex = this.parentMenuLevel.menuLevelIndex;
        //			if(parentMenuLevelIndex == activeMenuLevelIndex - 1) {
        //				this.closeItem();
        //			}
        //		}
        return false;
    }
} // end class
//# sourceMappingURL=MenuAvatar.js.map