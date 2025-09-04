// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class PageAvatar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_isExternalPage;

	// Implements interface ProjectionUser
	_projection;
	_domId;
	_domElement;
	
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
	_isClosing;
	_isParked;
	_isMouseOver;
	_lastScrollTop;

	constructor(id, isExternal, label, hideLabel, dataUrl, parentMenu, width, height, baseCssClass, imageUrl) {
		this._id = id;
		this._isExternalPage = isExternal;
		
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
		this._lastScrollTop = 0;
		
		this.createDOM();
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	// Implements interface Avatar
	reachedTarget() {		
		if(this._isOpened == 1) {
			// Open page viewer will stop animation interval
			globalThis.JSPECTIVE._uniquePageViewer.openView(this._lastScrollTop);
		}
		this._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
		this._isSelfTargeting = 0;
	}

	
	// Implements interface Avatar
	createDOM() { 
		let ProjectionScreen2D_DOM = document.getElementById('ProjectionScreen2D');
		this._domElement = document.createElement("div");
		
		let idAttr = document.createAttribute("id");
		idAttr.nodeValue = this._domId;
		this._domElement.setAttributeNode(idAttr);
		
		let classAttr = document.createAttribute("class");
		classAttr.nodeValue = "avatar " + this._baseCssClass;
		this._domElement.setAttributeNode(classAttr);
		
		ProjectionScreen2D_DOM.appendChild(this._domElement);
		
		let jQueryElement = $("div#" + this._domId);
		if(this._imageUrl.length > 0) {
			jQueryElement.append("<img src=\"" + this._imageUrl + "\" class=\"avatar_image\" alt=\"\" width=\"" + this._projection._projectedWidth + "\" height=\""+ this._projection._projectedHeight + "\" />");
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
		jQueryElement.on("click", null, this._domId, globalThis.JSPECTIVE.handleClickAvatar);
		jQueryElement.on("mouseover", null, this._domId, globalThis.JSPECTIVE.handleMouseOverAvatar);
		jQueryElement.on("mouseout", null, this._domId, globalThis.JSPECTIVE.handleMouseOutAvatar);
	}

	
	// Implements interface Avatar
	updateDOM() {
		// This function is performance critical! Keep it as fast as possible!
		// let AvatarDOM = document.getElementById(this._domId);
		this._domElement.style.left = this._projection._projectedX + "px";
		this._domElement.style.top = this._projection._projectedY + "px";
		this._domElement.style.width = this._projection._projectedWidth + "px";
		
		// Note: avatarHeight is auto-ajusted according to its child-elements
		//this._domElement.style.height = this._projection._projectedHeight + "px";
		
		this._domElement.style.fontSize = (this._projection._projectedFontsize + 4) + "pt";
		this._domElement.style.zIndex = (globalThis.JSPECTIVE._virtualSpaceDepth + 100) - this._projection._posZ;
		
		if(this._imageUrl.length > 0) {
			let imgDom = this._domElement.getElementsByTagName("img")[0];
			if(imgDom != undefined) {
				imgDom.width = this._projection._projectedWidth; // -8 ?
				imgDom.height = this._projection._projectedHeight; // -8 ?
			}
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


	// Implements interface MenuItem
	openItem() {
		this._isMouseOver = 0; //free from mouseover effects
		this._isOpened = 1;
		this._isSelfTargeting = 1;
		this._projection._speed = 60;
		
		//this._projection.setTargetPosition( (globalThis.JSPECTIVE._virtualSpaceWidth / 2), (this._parentMenu._groundLevel- globalThis.JSPECTIVE._levelHeight / 2), -50);
		this._projection.setTargetPosition(100, 60, -80);
		//this._projection.setTargetPosition(143, 120, -80);
		
		$("div#" + this._domId).addClass("opened");
	}


	// Implements interface MenuItem
	closeItem() {
		this._isMouseOver = 0;
		this._projection._speed = globalThis.JSPECTIVE._defaultSpeed;
		
		$("div#" + this._domId).removeClass("opened");
		this._isParked = 0; // ???
		this._isOpened = 0;
	}


	// Implements interface MenuItem
	handleClick() {
		this._isMouseOver = 0; // Free from mouseover effects
		
		if(this._isParked == 0) {
			if(this._isExternalPage == 0) {
				if(this._isOpened == 0) {
					// Page is clicked to be opened. Make a request to server to fetch content.
					if(this._dataUrl.length > 0) {
						// Close all other opened avatars and page viewer
						if(globalThis.JSPECTIVE._uniquePageViewer._isOpened == 1) {
							globalThis.JSPECTIVE._uniquePageViewer.closeView();
						}
						
						for(let i=0; i < globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items.length; i++) {
							if(i != this._id && globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i]._isOpened == 1) {
								globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId]._items[i].closeItem();
							}
						}
						
						// Move to top and open page viewer on arrival
						this.openItem();
						
						// Preload default busy message into view
						globalThis.JSPECTIVE._uniquePageViewer.setContent("<div class=\"page_viewer_title\"><h2>Loading... please wait</h2></div><div class=\"page_viewer_content\">Loading content ...<br/><br/>Inhalte werden geladen ...<br/></div></div>");
						
						// Send request to server
						$.ajax({
							type: "GET",
							url: this._dataUrl,
							//dataType: "xml",
							success: function(responseData) {
								globalThis.JSPECTIVE._uniquePageViewer.setContent(responseData);
							},
							error: function(xmlHttpReq, errStr, exceptionObj) {
								let errorMsg = "Error: Failed to fetch page data from server. (Message: " + errStr + ")";
								globalThis.JSPECTIVE._uniquePageViewer.setContent(errorMsg);
							},
							timeout: function(xmlHttpReq, errStr, exceptionObj){
								let errorMsg = "Error: Failed to fetch page data from server. (Message: " + errStr + ")";
								globalThis.JSPECTIVE._uniquePageViewer.setContent("");
								alert("Timeout: Failed to fetch page data from server. (Message: " + errStr + ")");
							}
						});
					} else {
						alert("Page has no link set. Can't open.");
					}//if _dataUrl
					
				} else {
					// Avatar is currently opened
					if(this._isSelfTargeting == 1)	{
						// Close avatar and page viewer
						if(globalThis.JSPECTIVE._uniquePageViewer._isOpened == 1) { globalThis.JSPECTIVE._uniquePageViewer.closeView(); }
						this.closeItem();
					}
				}//if _isOpened
				
			} else {
				// Avatar is an external link. Animate a small hop.
				this._isSelfTargeting = 1;
				this._projection.set3DPosition(this._projection._posX, this._projection._posY - 40, this._projection._posZ);
				this._projection.setTargetPosition(this._projection._posX, this._projection._posY + 40, this._projection._posZ);
				// Open external link in new browser window
				window.open(this._dataUrl, "_blank");
			}// _isExternalPage
			
		} else {
			// Avatar is currently parked
			
			// Iterate top-down over every menu level
			// and close all open menuAvatars (and pages) until the menu level of the clicked avatar is active.
			while(globalThis.JSPECTIVE._activeMenuId > this._parentMenu._id) {
				let prevMenuLevel = globalThis.JSPECTIVE._activeMenuId - 1;
				for(let i=0; i < globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items.length; i++) {
					if(globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items[i]._isOpened == 1) {
						globalThis.JSPECTIVE._menuStack[prevMenuLevel]._items[i].closeItem();
					}
				}
			}	
		}//if _isParked
		
	}


	// Implements interface MenuItem
	handleMouseOver() {
		if(this._isOpened == 0 && this._isClosing == 0) {
			this._isMouseOver = 1;
			$("div#" + this._domId).addClass("hover");
		}
	}


	// Implements interface MenuItem
	handleMouseOut() {
		this._isMouseOver = 0;
		$("div#" + this._domId).removeClass("hover");
	}

} // end class
