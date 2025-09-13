// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Avatar } from "./Avatar.js";
export class PageAvatar extends Avatar {
    constructor(jspective, menuItemId, isExternal, label, hideLabel, dataUrl, parentMenuLevel, width, height, baseCssClass, imageUrl) {
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
        this.isExternalPage = isExternal;
        this.lastScrollTop = 0;
        // Bind event handlers to this
        // ---------------------------
        // Note: Done in superclass - seems to work fine
        //this.handleClick = this.handleClick.bind(this);
        //this.handleMouseOver = this.handleMouseOver.bind(this);
        //this.handleMouseOut = this.handleMouseOut.bind(this);
        this.onRequestSuccess = this.onRequestSuccess.bind(this);
        this.onRequestError = this.onRequestError.bind(this);
        this.createDOM();
    }
    // Private methods
    // ---------------
    // Public methods
    // --------------
    // Implements interface IProjectionUser
    reachedTarget() {
        if (this.isOpened) {
            // Open page viewer will stop animation interval
            this.jspective.uniquePageViewer.openView(this.lastScrollTop);
        }
        this.projection.speed = this.jspective.defaultSpeed;
        this.isSelfTargeting = false;
    }
    // Implements interface IMenuItem
    openItem() {
        this.isMouseOver = false; //free from mouseover effects
        this.isOpened = true;
        this.isSelfTargeting = true;
        this.projection.speed = 60;
        //this.projection.setTargetPosition( (this.jspective.virtualSpaceWidth / 2), (this.parentMenu.groundLevel- this.jspective.levelHeight / 2), -50);
        this.projection.setTargetPosition(100, 60, -80);
        //this.projection.setTargetPosition(143, 120, -80);
        $("div#" + this.domId).addClass("opened");
    }
    // Implements interface IMenuItem
    closeItem() {
        this.isMouseOver = false;
        this.projection.speed = this.jspective.defaultSpeed;
        $("div#" + this.domId).removeClass("opened");
        this.isParked = false; // ???
        this.isOpened = false;
    }
    // Implements class Avatar
    handleClick() {
        this.isMouseOver = false; // Free from mouseover effects
        if (!this.isParked) {
            if (!this.isExternalPage) {
                if (!this.isOpened) {
                    // Page is clicked to be opened. Make a request to server to fetch content.
                    if (this.dataUrl.length > 0) {
                        // Close all other opened avatars and page viewer
                        if (this.jspective.uniquePageViewer.isOpened) {
                            this.jspective.uniquePageViewer.closeView();
                        }
                        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
                        let i = 0;
                        for (let item of activeMenuLevel.items) {
                            if (i != this.menuItemId && item.isOpened) {
                                item.closeItem();
                            }
                            i++;
                        }
                        // Move to top and open page viewer on arrival
                        this.openItem();
                        // Preload default busy message into view
                        this.jspective.uniquePageViewer.setContent("<div class=\"page_viewer_title\"><h2>Loading... please wait</h2></div><div class=\"page_viewer_content\">Loading content ...<br/><br/>Inhalte werden geladen ...<br/></div></div>");
                        // Send request to server
                        $.ajax(this.dataUrl, {
                            type: "GET",
                            //dataType: "xml",
                            success: this.onRequestSuccess,
                            error: this.onRequestError,
                            //timeout: this.onRequestTimeout
                        });
                    }
                    else {
                        alert("Page has no link set. Can't open.");
                    } //if dataUrl
                }
                else {
                    // Avatar is currently opened
                    if (this.isSelfTargeting) {
                        // Close avatar and page viewer
                        if (this.jspective.uniquePageViewer.isOpened) {
                            this.jspective.uniquePageViewer.closeView();
                        }
                        this.closeItem();
                    }
                } //if isOpened
            }
            else {
                // Avatar is an external link. Animate a small hop.
                this.isSelfTargeting = true;
                this.projection.set3DPosition(this.projection.posX, this.projection.posY - 40, this.projection.posZ);
                this.projection.setTargetPosition(this.projection.posX, this.projection.posY + 40, this.projection.posZ);
                // Open external link in new browser window
                window.open(this.dataUrl, "_blank");
            } // isExternalPage
        }
        else {
            // Avatar is currently parked
            // Iterate top-down over every menu level
            // and close all open menuAvatars (and pages) until the menu level of the clicked avatar is active.
            while (this.jspective.menuStack.activeMenuLevelIndex > this.parentMenuLevel.menuLevelIndex) {
                let prevMenuLevel = this.jspective.menuStack.getPreviousMenuLevel();
                let i = 0;
                for (let item of prevMenuLevel.items) {
                    if (item.isOpened) {
                        item.closeItem();
                    }
                    i++;
                }
            }
        } //if isParked
        return false;
    }
    onRequestSuccess(responseData) {
        this.jspective.uniquePageViewer.setContent(responseData);
    }
    onRequestError(xmlHttpReq, errStr, exceptionObj) {
        let errorMsg = "Error: Failed to fetch page data from server. (Message: " + errStr + ")";
        this.jspective.uniquePageViewer.setContent(errorMsg);
    }
    // Implements class Avatar
    handleMouseOver() {
        if (!this.isOpened && !this.isClosing) {
            this.isMouseOver = true;
            $("div#" + this.domId).addClass("hover");
        }
    }
    // Implements class Avatar
    handleMouseOut() {
        this.isMouseOver = false;
        $("div#" + this.domId).removeClass("hover");
    }
} // end class
//# sourceMappingURL=PageAvatar.js.map