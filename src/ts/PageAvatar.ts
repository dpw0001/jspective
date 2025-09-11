// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { Projection } from "./Projection.js";
import { MenuLevel } from "./MenuLevel.js";

export class PageAvatar {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _isExternalPage: boolean;

	// Implements interface ProjectionUser
	public _projection: Projection;
	public _domId: string;
	public _domElement: any;
	
	// Implements interface Avatar
	public _label: string;
	public _hideLabel: boolean;
	public _baseCssClass: string;
	public _imageUrl: string;

	// Implements interface MenuItem
	public _dataUrl: string;
	public _parentMenu: MenuLevel;
	public _isSelfTargeting: boolean;
	public _isOpened: boolean;
	public _isClosing: boolean;
	public _isParked: boolean;
	public _isMouseOver: boolean;
	public _lastScrollTop: number;

	constructor(id: number, isExternal: boolean, label: string, hideLabel: boolean, dataUrl: string,
				parentMenu: MenuLevel, width: number, height: number, baseCssClass: string, imageUrl: string) {
		this._id = id;
		this._isExternalPage = isExternal;
		
		this._projection = new Projection(id, this, width, height, JSpective._singleton._defaultFontSize, JSpective._singleton._initVanishX, JSpective._singleton._initVanishY, JSpective._singleton._initVanishZ, JSpective._singleton._defaultSpeed);
		this._projection._parent = this; // Register this Avatar with its child Projection for callbacks
		this._domId = "Avatar_" + parentMenu._id + "_" + id;
		this._domElement = null;
		
		this._label = label;
		this._hideLabel = hideLabel;
		this._baseCssClass = baseCssClass;
		this._imageUrl = imageUrl;
		
		this._dataUrl = dataUrl;
		this._parentMenu = parentMenu;
		this._isSelfTargeting = false;
		this._isOpened = false;
		this._isParked = false;
		this._isClosing = false;
		this._isMouseOver = false;
		this._lastScrollTop = 0;
		
		this.createDOM();
	}


	// Private methods
	// ---------------

	// Implements interface Avatar
	private createDOM(): void { 
		let projectionScreen2D_DOM = document.getElementById('ProjectionScreen2D');
		if(projectionScreen2D_DOM == null) {
			console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
			
		} else {
			this._domElement = document.createElement("div");
			
			let idAttr = document.createAttribute("id");
			idAttr.nodeValue = this._domId;
			this._domElement.setAttributeNode(idAttr);
			
			let classAttr = document.createAttribute("class");
			classAttr.nodeValue = "avatar " + this._baseCssClass;
			this._domElement.setAttributeNode(classAttr);
			
			projectionScreen2D_DOM.appendChild(this._domElement);
			
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
			jQueryElement.on("click", null, this._domId, JSpective._singleton.handleClickAvatar);
			jQueryElement.on("mouseover", null, this._domId, JSpective._singleton.handleMouseOverAvatar);
			jQueryElement.on("mouseout", null, this._domId, JSpective._singleton.handleMouseOutAvatar);
		}
	}


	// Public methods
	// --------------

	// Implements interface Avatar
	public reachedTarget(): void {		
		if(this._isOpened) {
			// Open page viewer will stop animation interval
			JSpective._singleton._uniquePageViewer.openView(this._lastScrollTop);
		}
		this._projection._speed = JSpective._singleton._defaultSpeed;
		this._isSelfTargeting = false;
	}


	// Implements interface Avatar
	public updateDOM(): void {
		// This function is performance critical! Keep it as fast as possible!
		// let AvatarDOM = document.getElementById(this._domId);
		this._domElement.style.left = this._projection._projectedX + "px";
		this._domElement.style.top = this._projection._projectedY + "px";
		this._domElement.style.width = this._projection._projectedWidth + "px";
		
		// Note: avatarHeight is auto-ajusted according to its child-elements
		//this._domElement.style.height = this._projection._projectedHeight + "px";
		
		this._domElement.style.fontSize = (this._projection._projectedFontsize + 4) + "pt";
		this._domElement.style.zIndex = (JSpective._singleton._virtualSpaceDepth + 100) - this._projection._posZ;
		
		if(this._imageUrl.length > 0) {
			let imgDom = this._domElement.getElementsByTagName("img")[0];
			if(imgDom != undefined) {
				imgDom.width = this._projection._projectedWidth; // -8 ?
				imgDom.height = this._projection._projectedHeight; // -8 ?
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


	// Implements interface MenuItem
	public openItem(): void {
		this._isMouseOver = false; //free from mouseover effects
		this._isOpened = true;
		this._isSelfTargeting = true;
		this._projection._speed = 60;
		
		//this._projection.setTargetPosition( (JSpective._singleton._virtualSpaceWidth / 2), (this._parentMenu._groundLevel- JSpective._singleton._levelHeight / 2), -50);
		this._projection.setTargetPosition(100, 60, -80);
		//this._projection.setTargetPosition(143, 120, -80);
		
		$("div#" + this._domId).addClass("opened");
	}


	// Implements interface MenuItem
	public closeItem(): void {
		this._isMouseOver = false;
		this._projection._speed = JSpective._singleton._defaultSpeed;
		
		$("div#" + this._domId).removeClass("opened");
		this._isParked = false; // ???
		this._isOpened = false;
	}


	// Implements interface MenuItem
	public handleClick(): void {
		this._isMouseOver = false; // Free from mouseover effects
		
		if(!this._isParked) {
			if(!this._isExternalPage) {
				if(!this._isOpened) {
					// Page is clicked to be opened. Make a request to server to fetch content.
					if(this._dataUrl.length > 0) {
						// Close all other opened avatars and page viewer
						if(JSpective._singleton._uniquePageViewer._isOpened) {
							JSpective._singleton._uniquePageViewer.closeView();
						}
						
						let activeMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId];
						let i = 0;
						for(let item of activeMenuLevel._items) {
							if(i != this._id && item._isOpened) {
								item.closeItem();
							}
							
							i++;
						}
						
						// Move to top and open page viewer on arrival
						this.openItem();
						
						// Preload default busy message into view
						JSpective._singleton._uniquePageViewer.setContent("<div class=\"page_viewer_title\"><h2>Loading... please wait</h2></div><div class=\"page_viewer_content\">Loading content ...<br/><br/>Inhalte werden geladen ...<br/></div></div>");
						
						// Send request to server
						$.ajax(this._dataUrl, {
							type: "GET",
							//dataType: "xml",
							success: function(responseData: any) {
								JSpective._singleton._uniquePageViewer.setContent(responseData);
							},
							error: function(xmlHttpReq: any, errStr: any, exceptionObj: any) {
								let errorMsg = "Error: Failed to fetch page data from server. (Message: " + errStr + ")";
								JSpective._singleton._uniquePageViewer.setContent(errorMsg);
							}
//							, timeout: function(xmlHttpReq: any, errStr: any, exceptionObj: any){
//								let errorMsg = "Error: Failed to fetch page data from server. (Message: " + errStr + ")";
//								JSpective._singleton._uniquePageViewer.setContent(errorMsg);
//								alert("Timeout: " + errorMsg);
//							}
						});
					} else {
						alert("Page has no link set. Can't open.");
					}//if _dataUrl
					
				} else {
					// Avatar is currently opened
					if(this._isSelfTargeting) {
						// Close avatar and page viewer
						if(JSpective._singleton._uniquePageViewer._isOpened) {
							JSpective._singleton._uniquePageViewer.closeView();
						}
						this.closeItem();
					}
				}//if _isOpened
				
			} else {
				// Avatar is an external link. Animate a small hop.
				this._isSelfTargeting = true;
				this._projection.set3DPosition(this._projection._posX, this._projection._posY - 40, this._projection._posZ);
				this._projection.setTargetPosition(this._projection._posX, this._projection._posY + 40, this._projection._posZ);
				// Open external link in new browser window
				window.open(this._dataUrl, "_blank");
			}// _isExternalPage
			
		} else {
			// Avatar is currently parked
			
			// Iterate top-down over every menu level
			// and close all open menuAvatars (and pages) until the menu level of the clicked avatar is active.
			while(JSpective._singleton._activeMenuId > this._parentMenu._id) {
				let prevMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId - 1];
				let i = 0;
				for(let item of prevMenuLevel._items) {
					if(item._isOpened) {
						item.closeItem();
					}
					
					i++;
				}
			}	
		}//if _isParked
		
	}


	// Implements interface MenuItem
	public handleMouseOver(): void {
		if(!this._isOpened && !this._isClosing) {
			this._isMouseOver = true;
			$("div#" + this._domId).addClass("hover");
		}
	}


	// Implements interface MenuItem
	public handleMouseOut(): void {
		this._isMouseOver = false;
		$("div#" + this._domId).removeClass("hover");
	}

} // end class
