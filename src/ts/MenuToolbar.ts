// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { Projection } from "./Projection.js";

export class MenuToolbar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _projection: Projection;
	public _domId: string;
	public _label: string;
	public _bgColor: string;
	public _fontColor: string;
	public _borderColor: string;
	public _imageUrl: string;
	public _isSelfTargeting: boolean;
	public _isOpened: boolean;
	public _isClosing: boolean;
	public _isParked: boolean;
	public _isMouseOver: boolean;
	public _isWatching: boolean;


	constructor(id: number, label: string, width: number, height: number,
			bgColor: string, fontColor: string, borderColor: string, imgUrl: string) {
		this._id = id;
		
		// Implements interface Avatar
		this._projection = new Projection(id, this, width, height, 10, JSpective._singleton._initVanishX, JSpective._singleton._initVanishY, JSpective._singleton._initVanishZ, JSpective._singleton._defaultSpeed);
		this._projection._parent = this; // Register this Avatar with its child Projection for callbacks
		this._domId = "MenuToolbar_" + id;
		this._label = label;
		this._bgColor = bgColor;
		this._fontColor = fontColor;
		this._borderColor = borderColor;
		this._imageUrl = imgUrl;
		// end interface
		
		// Implements interface Agent
		this._isSelfTargeting = false;
		this._isOpened = false;
		this._isParked = false;
		this._isClosing = false;
		this._isMouseOver = false;
		this._isWatching = false;
		// end interface
		
		this.createDOM();
		//this._projection.set3DPosition(10, 10, 50);
		
		// Bind event handlers to this
		// ---------------------------
		this.handleMenuToolAxis = this.handleMenuToolAxis.bind(this);
		this.handleMenuToolClockwise = this.handleMenuToolClockwise.bind(this);
		this.handleMenuToolMode = this.handleMenuToolMode.bind(this);

	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Implements interface Avatar
	private createDOM(): void {
		let projectionScreen2D_DOM =  document.getElementById('ProjectionScreen2D');
		if(projectionScreen2D_DOM == null) {
			console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
			
		} else {
			let ToolbarDOM = document.createElement("div");
			
			let IdAttr = document.createAttribute("id");
			IdAttr.nodeValue = this._domId;
			ToolbarDOM.setAttributeNode(IdAttr);
			
			let ClassAttr = document.createAttribute("class");
			ClassAttr.nodeValue = "menu_toolbar";
			ToolbarDOM.setAttributeNode(ClassAttr);
			
			projectionScreen2D_DOM.appendChild(ToolbarDOM);
			
			$("div#" + this._domId).append("[<a class=\"menu_tool_axis\" href=\"\">horiz/vert</a>]<br/>[<a class=\"menu_tool_clockwise\" href=\"\">counter/clock</a>]<br/>[<a class=\"menu_tool_mode\" href=\"\">wheel/shuffle</a>]");
			$("div#" + this._domId).css("width", this._projection._width).css("height", this._projection._height);
			$("div#" + this._domId).css("font-size", this._projection._fontsize).css("color", this._fontColor).css("background-color", this._bgColor).css("border-color", this._borderColor);
			
			$("div#" + this._domId + " a.menu_tool_axis").on("click", null, this._domId, this.handleMenuToolAxis);
			$("div#" + this._domId + " a.menu_tool_clockwise").on("click", null, this._domId, this.handleMenuToolClockwise);
			$("div#" + this._domId + " a.menu_tool_mode").on("click", null, this._domId, this.handleMenuToolMode);
			//$("div#" + this._domId).on("mouseover", null, this._domId, handleMouseOverToolbar);
			//$("div#" + this._domId).on("mouseout", null, this._domId, handleMouseOutToolbar);
		}
	}


// Implements interface Avatar
	public reachedTarget(): void {		
		if(this._isClosing) {
				this._isOpened = false;
				this._isClosing = false;
		} else {
				// Finished opening
		}
		this._projection._speed = JSpective._singleton._defaultSpeed;
		this._isSelfTargeting = false;
	}


	// Implements interface Avatar
	public updateDOM(): void {
		// This function is performance critical! Keep it as fast as possible!
		let avatarDOM = document.getElementById(this._domId);
		if(avatarDOM == null) {
			console.error("Missing element id \"" + this._domId + "\" in HTML.");
			
		} else {
			avatarDOM.style.left = this._projection._projectedX + "px";
			avatarDOM.style.top = this._projection._projectedY + "px";
			avatarDOM.style.width = this._projection._projectedWidth + "px";
			avatarDOM.style.height = this._projection._projectedHeight + "px";
			avatarDOM.style.fontSize = this._projection._projectedFontsize + "pt";
			avatarDOM.style.zIndex = ((JSpective._singleton._virtualSpaceDepth + 100) - this._projection._posZ).toString();
			if(this._imageUrl.length > 0) {
				let lastChild = avatarDOM.lastChild;
				if(lastChild != null) {
					// FIXME
					//lastChild.width = this._projection._projectedWidth;
					//lastChild.height = this._projection._projectedHeight;
				}
			}
		}
	}


	// Implements interface Avatar
	public removeDOM(): void {
		$("div#" + this._domId).remove();
	}


	// Implements interface Avatar
	public showDOM(): void {
		$("div#" + this._domId).show();
	}


	// Implements interface Avatar
	public hideDOM(): void {
		$("div#" + this._domId).hide();
	}


	public openView(): void {
		this._isOpened = true;
		this.showDOM();
	}


	public closeView(): void {
		this.hideDOM();
		this._isOpened = false;
	}


	public warpToActiveMenu(): void {
		let posX = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId]._menuAvatar._projection._posX;
		let posY = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId]._menuAvatar._projection._posY - JSpective._singleton._uniqueMenuToolbar._projection._height - 15;
		let posZ = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId]._menuAvatar._projection._posZ;
		this._projection.set3DPosition(posX, posY, posZ);
	}


	public handleMenuToolAxis(event: any): boolean {
		let jspective = JSpective._singleton;
		if(jspective._menuStack[jspective._activeMenuId]._isHorizontal == 0) {
			jspective._menuStack[jspective._activeMenuId]._isHorizontal = 1;
			for(let item of jspective._menuStack[jspective._activeMenuId]._items) {
				// Position vanishing point slighted to the left/right
				item._projection._vanishX = item._projection._vanishX + 80;
			}//for
			
		} else {
			jspective._menuStack[jspective._activeMenuId]._isHorizontal = 0;
			for(let item of jspective._menuStack[jspective._activeMenuId]._items) {
				item._projection._vanishX = item._projection._vanishX - 80;
			}//for
		}//if
		
		return false;
	}


	public handleMenuToolClockwise(event: any): boolean {
		let jspective = JSpective._singleton;
		if(jspective._menuStack[jspective._activeMenuId]._clockwise == 1) {
			jspective._menuStack[jspective._activeMenuId]._clockwise = -1;
		} else {
			jspective._menuStack[jspective._activeMenuId]._clockwise = 1;
		}
		return false;
	}


	public handleMenuToolMode(event: any): boolean {
		let jspective = JSpective._singleton;
		if(jspective._menuStack[jspective._activeMenuId]._animationMode == "wheel") {
			jspective._menuStack[jspective._activeMenuId]._animationMode = "shuffle";
			jspective._menuStack[jspective._activeMenuId].reshuffle();
		} else {
			jspective._menuStack[jspective._activeMenuId]._animationMode = "wheel";
		}
		return false;
	}
} // end class
