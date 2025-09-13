// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Avatar } from "./Avatar.js";
import { EnumAnimationMode } from "./Enums.js";
export class MenuToolbar extends Avatar {
    constructor(jspective, menuToolbarId, label, width, height, bgColor, fontColor, borderColor, imageUrl) {
        let domId = "MenuToolbar_" + menuToolbarId;
        super(jspective, domId, label, true, width, height, "", imageUrl);
        this.menuToolbarId = menuToolbarId;
        // Implements interface Avatar
        this.bgColor = bgColor;
        this.fontColor = fontColor;
        this.borderColor = borderColor;
        // end interface
        this.isSelfTargeting = false;
        this.isOpened = false;
        this.isParked = false;
        this.isClosing = false;
        this.isMouseOver = false;
        this.isWatching = false;
        // end interface
        // Bind event handlers to this
        // ---------------------------
        // Note: Done in superclass - seems to work fine
        //this.handleClick = this.handleClick.bind(this);
        //this.handleMouseOver = this.handleMouseOver.bind(this);
        //this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMenuToolAxis = this.handleMenuToolAxis.bind(this);
        this.handleMenuToolClockwise = this.handleMenuToolClockwise.bind(this);
        this.handleMenuToolMode = this.handleMenuToolMode.bind(this);
        this.createDOM();
        //this.projection.set3DPosition(10, 10, 50);
    }
    // Private methods
    // ---------------
    // Public methods
    // --------------
    // Implements class Avatar
    createDOM() {
        let projectionScreen2dDom = document.getElementById('ProjectionScreen2D');
        if (projectionScreen2dDom == null) {
            console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
        }
        else {
            let ToolbarDOM = document.createElement("div");
            let IdAttr = document.createAttribute("id");
            IdAttr.nodeValue = this.domId;
            ToolbarDOM.setAttributeNode(IdAttr);
            let ClassAttr = document.createAttribute("class");
            ClassAttr.nodeValue = "menu_toolbar";
            ToolbarDOM.setAttributeNode(ClassAttr);
            projectionScreen2dDom.appendChild(ToolbarDOM);
            $("div#" + this.domId).append("[<a class=\"menu_tool_axis\" href=\"\">horiz/vert</a>]<br/>[<a class=\"menu_tool_clockwise\" href=\"\">counter/clock</a>]<br/>[<a class=\"menu_tool_mode\" href=\"\">wheel/shuffle</a>]");
            $("div#" + this.domId).css("width", this.projection.width).css("height", this.projection.height);
            $("div#" + this.domId).css("font-size", this.projection.fontsize).css("color", this.fontColor).css("background-color", this.bgColor).css("border-color", this.borderColor);
            $("div#" + this.domId + " a.menu_tool_axis").on("click", null, this.domId, this.handleMenuToolAxis);
            $("div#" + this.domId + " a.menu_tool_clockwise").on("click", null, this.domId, this.handleMenuToolClockwise);
            $("div#" + this.domId + " a.menu_tool_mode").on("click", null, this.domId, this.handleMenuToolMode);
            //$("div#" + this.domId).on("mouseover", null, this.domId, this.handleMouseOverToolbar);
            //$("div#" + this.domId).on("mouseout", null, this.domId, this.handleMouseOutToolbar);
        }
    }
    // Implements class Avatar
    updateDOM() {
        // This function is performance critical! Keep it as fast as possible!
        let avatarDOM = document.getElementById(this.domId);
        if (avatarDOM == null) {
            console.error("Missing element id \"" + this.domId + "\" in HTML.");
        }
        else {
            avatarDOM.style.left = this.projection.projectedX + "px";
            avatarDOM.style.top = this.projection.projectedY + "px";
            avatarDOM.style.width = this.projection.projectedWidth + "px";
            avatarDOM.style.height = this.projection.projectedHeight + "px";
            // For now, use fixed font-size (do not update)
            //avatarDOM.style.fontSize = this.projection.projectedFontsize + "pt";
            avatarDOM.style.zIndex = ((this.jspective.virtualSpaceDepth + 100) - this.projection.posZ).toString();
            if (this.imageUrl.length > 0) {
                let lastChild = avatarDOM.lastChild;
                if (lastChild != null) {
                    // FIXME
                    //lastChild.width = this.projection.projectedWidth;
                    //lastChild.height = this.projection.projectedHeight;
                }
            }
        }
    }
    // Implements class Avatar
    reachedTarget() {
        if (this.isClosing) {
            this.isOpened = false;
            this.isClosing = false;
        }
        else {
            // Finished opening
        }
        this.projection.speed = this.jspective.defaultSpeed;
        this.isSelfTargeting = false;
    }
    openView() {
        this.isOpened = true;
        this.showDOM();
    }
    closeView() {
        this.hideDOM();
        this.isOpened = false;
    }
    warpToActiveMenu() {
        let menuAvatar = this.jspective.menuStack.getActiveMenuLevel().menuAvatar;
        if (menuAvatar != null) {
            let posX = menuAvatar.projection.posX;
            let posY = menuAvatar.projection.posY - this.jspective.uniqueMenuToolbar.projection.height - 15;
            let posZ = menuAvatar.projection.posZ;
            this.projection.set3DPosition(posX, posY, posZ);
        }
    }
    handleMenuToolAxis(event) {
        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        if (!activeMenuLevel.isHorizontal) {
            activeMenuLevel.isHorizontal = true;
            for (let item of activeMenuLevel.items) {
                // Position vanishing point slighted to the left/right
                item.projection.vanishX = item.projection.vanishX + 80;
            } //for
        }
        else {
            activeMenuLevel.isHorizontal = false;
            for (let item of activeMenuLevel.items) {
                item.projection.vanishX = item.projection.vanishX - 80;
            } //for
        } //if
        return false;
    }
    handleMenuToolClockwise(event) {
        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        if (activeMenuLevel.clockwise == 1) {
            activeMenuLevel.clockwise = -1;
        }
        else {
            activeMenuLevel.clockwise = 1;
        }
        return false;
    }
    handleMenuToolMode(event) {
        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        if (activeMenuLevel.animationMode == EnumAnimationMode.wheel) {
            activeMenuLevel.animationMode = EnumAnimationMode.shuffle;
            activeMenuLevel.reshuffle();
        }
        else {
            activeMenuLevel.animationMode = EnumAnimationMode.wheel;
        }
        return false;
    }
    handleClick(event) {
        // Nothing to do.
        return true;
    }
    handleMouseOver(event) {
        // Nothing to do.
    }
    handleMouseOut(event) {
        // Nothing to do.
    }
} // end class
//# sourceMappingURL=MenuToolbar.js.map