// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { Avatar } from "./Avatar.js";
import { EnumAnimationMode } from "./Enums.js";
import { JSpective } from "./JSpective.js";

export class MenuToolbar extends Avatar {

	// Private members
	// ---------------
	// None, yet.
	

	// Public members
	// --------------

	public menuToolbarId: number;
	
	public bgColor: string;
	public fontColor: string;
	public borderColor: string;
	
	public isSelfTargeting: boolean;
	public isOpened: boolean;
	public isClosing: boolean;
	public isParked: boolean;
	public isMouseOver: boolean;
	public isWatching: boolean;


	constructor(jspective: JSpective, menuToolbarId: number, label: string, width: number, height: number,
				bgColor: string, fontColor: string, borderColor: string, imageUrl: string) {
		
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
	public override createDOM(): void {
		let projectionScreen2dDom =  document.getElementById('ProjectionScreen2D');
		if(projectionScreen2dDom == null) {
			console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
			
		} else {
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
	public override updateDOM(): void {
		// This function is performance critical! Keep it as fast as possible!
		let avatarDOM = document.getElementById(this.domId);
		if(avatarDOM == null) {
			console.error("Missing element id \"" + this.domId + "\" in HTML.");
			
		} else {
			avatarDOM.style.left = this.projection.projectedX + "px";
			avatarDOM.style.top = this.projection.projectedY + "px";
			avatarDOM.style.width = this.projection.projectedWidth + "px";
			avatarDOM.style.height = this.projection.projectedHeight + "px";
			// For now, use fixed font-size (do not update)
			//avatarDOM.style.fontSize = this.projection.projectedFontsize + "pt";
			avatarDOM.style.zIndex = ((this.jspective.virtualSpaceDepth + 100) - this.projection.posZ).toString();
			if(this.imageUrl.length > 0) {
				let lastChild = avatarDOM.lastChild;
				if(lastChild != null) {
					// FIXME
					//lastChild.width = this.projection.projectedWidth;
					//lastChild.height = this.projection.projectedHeight;
				}
			}
		}
	}


	// Implements class Avatar
	public reachedTarget(): void {		
		if(this.isClosing) {
				this.isOpened = false;
				this.isClosing = false;
		} else {
				// Finished opening
		}
		this.projection.speed = this.jspective.defaultSpeed;
		this.isSelfTargeting = false;
	}


	public openView(): void {
		this.isOpened = true;
		this.showDOM();
	}


	public closeView(): void {
		this.hideDOM();
		this.isOpened = false;
	}


	public warpToActiveMenu(): void {
		let posX = this.jspective.menuStack[this.jspective.activeMenuId].menuAvatar.projection.posX;
		let posY = this.jspective.menuStack[this.jspective.activeMenuId].menuAvatar.projection.posY - this.jspective.uniqueMenuToolbar.projection.height - 15;
		let posZ = this.jspective.menuStack[this.jspective.activeMenuId].menuAvatar.projection.posZ;
		this.projection.set3DPosition(posX, posY, posZ);
	}


	public handleMenuToolAxis(event: any): boolean {
		let jspective = this.jspective;
		if(jspective.menuStack[jspective.activeMenuId].isHorizontal == 0) {
			jspective.menuStack[jspective.activeMenuId].isHorizontal = 1;
			for(let item of jspective.menuStack[jspective.activeMenuId].items) {
				// Position vanishing point slighted to the left/right
				item.projection.vanishX = item.projection.vanishX + 80;
			}//for
			
		} else {
			jspective.menuStack[jspective.activeMenuId].isHorizontal = 0;
			for(let item of jspective.menuStack[jspective.activeMenuId].items) {
				item.projection.vanishX = item.projection.vanishX - 80;
			}//for
		}//if
		
		return false;
	}


	public handleMenuToolClockwise(event: any): boolean {
		let jspective = this.jspective;
		if(jspective.menuStack[jspective.activeMenuId].clockwise == 1) {
			jspective.menuStack[jspective.activeMenuId].clockwise = -1;
		} else {
			jspective.menuStack[jspective.activeMenuId].clockwise = 1;
		}
		return false;
	}


	public handleMenuToolMode(event: any): boolean {
		let jspective = this.jspective;
		if(jspective.menuStack[jspective.activeMenuId].animationMode == EnumAnimationMode.wheel) {
			jspective.menuStack[jspective.activeMenuId].animationMode = EnumAnimationMode.shuffle;
			jspective.menuStack[jspective.activeMenuId].reshuffle();
		} else {
			jspective.menuStack[jspective.activeMenuId].animationMode = EnumAnimationMode.wheel;
		}
		return false;
	}


	public handleClick(event: Event): boolean {
		// Nothing to do.
		
		return true;
	}


	public handleMouseOver(event: Event): void {
		// Nothing to do.
	}


	public handleMouseOut(event: Event): void {
		// Nothing to do.
	}

} // end class
