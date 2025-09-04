// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class MenuToolbar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_projection;
	_domId;
	_label;
	_bgColor;
	_fontColor;
	_borderColor;
	_imageUrl;
	_isSelfTargeting;
	_isOpened;
	_isClosing;
	_isParked;
	_isMouseOver;
	_isWatching;


	constructor(id, label, width, height, bgColor, fontColor, borderColor, imgUrl) {
		this._id = id;
		
		// Implements interface Avatar
		this._projection = new Projection(id, this, width, height, 10, globalThis.JSPECTIVE._initVanishX, globalThis.JSPECTIVE._initVanishY, globalThis.JSPECTIVE._initVanishZ, globalThis.JSPECTIVE._defaultSpeed);
		this._projection._parent = this; // Register this Avatar with its child Projection for callbacks
		this._domId = "MenuToolbar_" + id;
		this._label = label;
		this._bgColor = bgColor;
		this._fontColor = fontColor;
		this._borderColor = borderColor;
		this._imageUrl = imgUrl;
		// end interface
		
		// Implements interface Agent
		this._isSelfTargeting = 0;
		this._isOpened = 0;
		this._isParked = 0;
		this._isClosing = 0;
		this._isMouseOver = 0;
		this._isWatching = 0;
		// end interface
		
		this.createDOM();
		//this._projection.set3DPosition(10, 10, 50);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Implements interface Avatar
	reachedTarget() {		
		if(this._isClosing == 1) {
				this._isOpened = 0;
				this._isClosing = 0;
		} else {
				// Finished opening
		}
		this._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
		this._isSelfTargeting = 0;
	}


	// Implements interface Avatar
	createDOM() {
		let ProjectionScreen2D_DOM =  document.getElementById('ProjectionScreen2D');
		let ToolbarDOM = document.createElement("div");
		
		let IdAttr = document.createAttribute("id");
		IdAttr.nodeValue = this._domId;
		ToolbarDOM.setAttributeNode(IdAttr);
		
		let ClassAttr = document.createAttribute("class");
		ClassAttr.nodeValue = "menu_toolbar";
		ToolbarDOM.setAttributeNode(ClassAttr);
		
		ProjectionScreen2D_DOM.appendChild(ToolbarDOM);
		
		$("div#" + this._domId).append("[<a class=\"menu_tool_axis\" href=\"\">horiz/vert</a>]<br/>[<a class=\"menu_tool_clockwise\" href=\"\">counter/clock</a>]<br/>[<a class=\"menu_tool_mode\" href=\"\">wheel/shuffle</a>]");
		$("div#" + this._domId).css("width", this._projection._width).css("height", this._projection._height);
		$("div#" + this._domId).css("font-size", this._projection._fontsize).css("color", this._fontColor).css("background-color", this._bgColor).css("border-color", this._borderColor);
		
		$("div#" + this._domId + " a.menu_tool_axis").on("click", null, this._domId, globalThis.JSPECTIVE.handleMenuToolAxis);
		$("div#" + this._domId + " a.menu_tool_clockwise").on("click", null, this._domId, globalThis.JSPECTIVE.handleMenuToolClockwise);
		$("div#" + this._domId + " a.menu_tool_mode").on("click", null, this._domId, globalThis.JSPECTIVE.handleMenuToolMode);
		//$("div#" + this._domId).on("mouseover", null, this._domId, handleMouseOverToolbar);
		//$("div#" + this._domId).on("mouseout", null, this._domId, handleMouseOutToolbar);
	}


	// Implements interface Avatar
	updateDOM() {
		// This function is performance critical! Keep it as fast as possible!
		let AvatarDOM = document.getElementById(this._domId);
		AvatarDOM.style.left = this._projection._projectedX + "px";
		AvatarDOM.style.top = this._projection._projectedY + "px";
		AvatarDOM.style.width = this._projection._projectedWidth + "px";
		AvatarDOM.style.height = this._projection._projectedHeight + "px";
		AvatarDOM.style.fontSize = this._projection._projectedFontsize + "pt";
		AvatarDOM.style.zIndex = (globalThis.JSPECTIVE._virtualSpaceDepth + 100) - this._projection._posZ;
		if(this._imageUrl.length > 0) {
			AvatarDOM.lastChild.width = this._projection._projectedWidth;
			AvatarDOM.lastChild.height = this._projection._projectedHeight;
		}
	}


	// Implements interface Avatar
	removeDOM() {
		$("div#" + this._domId).remove();
	}


	// Implements interface Avatar
	showDOM() {
		$("div#" + this._domId).show();
	}


	// Implements interface Avatar
	hideDOM() {
		$("div#" + this._domId).hide();
	}


	openView() {
		this._isOpened = 1;
		this.showDOM();
	}


	closeView() {
		this.hideDOM();
		this._isOpened = 0;
	}


	warpToActiveMenu() {
		let posX = globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._menuAvatar._projection._posX;
		let posY = globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._menuAvatar._projection._posY - globalThis.JSPECTIVE._uniqueMenuToolbar._projection._height - 15;
		let posZ = globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._menuAvatar._projection._posZ;
		this._projection.set3DPosition(posX, posY, posZ);
	}

} // end class
