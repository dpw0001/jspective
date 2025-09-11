
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { MenuAvatar } from "./MenuAvatar.js";
import { MenuItemRecord } from "./MenuItemRecord.js";
import { MenuItemRecords } from "./MenuItemRecords.js";
import { PageAvatar } from "./PageAvatar.js";

export class MenuLevel {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _items: any;
	public _isLoaded: boolean;
	public _groundLevel: number;
	public _menuAvatar: MenuAvatar|null;
	public _animationMode: string|null;
	public _animIterator: number;
	public _wheelRadius: number;
	public _clockwise: number;
	public _isHorizontal: boolean;
	public _wheelCenterX: number;
	public _wheelCenterY: number;
	public _wheelCenterZ: number;


	constructor(id: number, groundLevel: number, menuAvatar: MenuAvatar|null) {
		this._id = id;
		this._items = new Array(); // Container for objects that apply to interface MenuItem.
		this._isLoaded = false;
		this._groundLevel = groundLevel;
		this._menuAvatar = menuAvatar;	// Related front end object
		
		//new stuff
		this._animationMode = "wheel";
		if(menuAvatar != null) { this._animationMode = menuAvatar._defaultMenuMode; }
		this._animIterator = 0;
		this._wheelRadius = 0;
		this._clockwise = 1; // Set to -1 or 1
		this._isHorizontal = true;
		this._wheelCenterX = Math.round(JSpective._singleton._virtualSpaceWidth / 2); // Init center for wheel animation
		this._wheelCenterY = groundLevel; //Math.round(JSpective._singleton._virtualSpaceHeight / 2);
		this._wheelCenterZ = Math.round(JSpective._singleton._virtualSpaceDepth / 2);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public populate(menuItemRecords: MenuItemRecords): void {
		for (let i=0; i < menuItemRecords._entries.length; i++) {
			this.addMenuItem(i, menuItemRecords._entries[i]);
		}
		
		this.calcWheelRadius();
		
		this._isLoaded = true;
	}


	public calcWheelRadius(): void {
		// Calculate radius for wheel animation
		this._wheelRadius = this._items.length * 45; //25;
		if(this._wheelRadius < 150) { this._wheelRadius = 150; }
		if(this._wheelRadius > 400) { this._wheelRadius = 400; }
	}


	public addMenuItem(menuItemId: number, menuItemRecord: MenuItemRecord): void {
		// Generate new avatar for the item
		let newAvatar: any = null;

		// Calculate initial avatar sizes
		// TODO: substitute with browser auto-sizing of boxes
		let defaultWidth = 12 * menuItemRecord._label.length;
		let defaultHeight = 20;
		if(menuItemRecord._label.length > 9) {
			defaultWidth = 6 * menuItemRecord._label.length;
			defaultHeight = 40;
		}
		if(menuItemRecord._label.length > 30) {
			defaultWidth = 6 * menuItemRecord._label.length;
			defaultHeight = 60;
		}
		
		if(menuItemRecord._imageUrl.length > 0) {
			// Has image url
			defaultWidth = menuItemRecord._width;
			defaultHeight = menuItemRecord._height;
		}
		
		if(menuItemRecord._itemType == JSpective._singleton._menuItemTypePage) {
			newAvatar = new PageAvatar(menuItemId, false, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "page_avatar", menuItemRecord._imageUrl);
			
		} else if(menuItemRecord._itemType == JSpective._singleton._menuItemTypeLink) {
			newAvatar = new PageAvatar(menuItemId, true, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "link_avatar", menuItemRecord._imageUrl);
			
		} else if(menuItemRecord._itemType == JSpective._singleton._menuItemTypeMenu) {
			if(menuItemRecord._defaultMenuMode == "shuffle") {
				newAvatar = new MenuAvatar(menuItemId, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "menu_avatar", menuItemRecord._imageUrl, "shuffle");
			} else {
				newAvatar = new MenuAvatar(menuItemId, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "menu_avatar", menuItemRecord._imageUrl, "wheel");
			}
			
		} else {
			console.error("MenuLevel.addMenuItem(): Unknown value \"" + menuItemRecord._itemType + "\" for MenuItemRecord._itemType.");
		}
		
		if(newAvatar != null) {
			// Lift vanishing point to menu ground level
			newAvatar._projection._vanishY = this._groundLevel - JSpective._singleton._levelHeight;
			
			let randX = 50;
			let randY = this._groundLevel;
			let randZ = Math.random() * JSpective._singleton._virtualSpaceDepth;
			
			newAvatar._projection.set3DPosition(randX, randY, randZ);
			this._items.push(newAvatar);
		}
	}


	// Request menu data from server
	public requestMenuData(url: string): void {
		let self = this;
		$.ajax(url, {
			type: "GET",
			dataType: "xml",
			success: function(responseXML: any){
				let menuItemRecords = new MenuItemRecords();
				menuItemRecords.parseXML(responseXML);
				
				self.populate(menuItemRecords);
				
			},
			error: function(xmlHttpReq: any, errStr: any, exceptionObj: any){
				window.clearInterval(JSpective._singleton._openMenuInterval);
				alert("Error: Failed to fetch menu data from server. (Message: " + errStr + ")");
			}
//			, timeout: function(xmlHttpReq: any, errStr: any, exceptionObj: any){
//				window.clearInterval(JSpective._singleton._openMenuInterval);
//				alert("Timeout: Failed to fetch menu data from server. (Message: " + errStr + ")");
//			}
		});
	}


	public finishedLoading(): boolean {
		// Menu data may not be available until asynchron request finishes
		let success = false;
		if(this._isLoaded) {
			if(JSpective._singleton._openMenuInterval != undefined) {
				window.clearInterval(JSpective._singleton._openMenuInterval); // Also cleared in request timeout and error handlers for save fallback.
			}
			for(let item of this._items) {
				item.showDOM();
			};
			success = true;
		}
		
		return success;
	}


	public formWheel(centerX: number, centerY: number, centerZ: number, radius: number): void {
		this._wheelCenterX = centerX;
		this._wheelCenterY = centerY;
		this._wheelCenterZ = centerZ;
		this._wheelRadius = radius;
		
		let divisor = 1;
		if(this._items.length != 0) { divisor = this._items.length };
		
		let initCirclePhi = 0;
		for(let item of this._items) {
			if(!item._isOpened && !item._isParked) {
				item._projection.set3DPosition(centerX + (this._wheelRadius * Math.sin(initCirclePhi)), centerY, centerZ + (radius * Math.cos(initCirclePhi)) );
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			}
		}
	}


	public animate(): void {
		// PERFORMANCE CRITICAL FROM HERE ON: avaid any cpu-step possible!
		
		// Animate temporary movements
		// FIXME???
//		for(let entry of JSpective._singleton._tempAnimationStack) {
//			if(entry._isSelfTargeting) {
//				this.animateLinear(JSpective._singleton._tempAnimationStack);
//			}
//		}
		
		// Animate menu items depending on current mode
		if(this._animationMode == "linear") {
			//this.animateLinear();
			return; // !
		}
		if(this._animationMode == "wheel") {
			this.animateWheel();
			return; // !
		}
		if(this._animationMode == "shuffle") {
			this.animateShuffle();
			return; // !
		}
	}


	// LINEAR animation for menu items
	public animateLinear(animationStack: any): void {
		for(let entry of animationStack) {
			if(entry._isSelfTargeting) {
				entry._projection.stepToTarget();
			}
		}
	}


	// SHUFFLE animation for menu items
	public animateShuffle(): void {
		for(let item of this._items) {
			// Identify idle avatars and start them moving again
			if(!item._isSelfTargeting && !item._isOpened && !item._isParked && !item._isMouseOver) {
			
				// Choose random target and start moving again
				item._isSelfTargeting = true; // Flag instantly as being busy with moving
				// Set a random target in virtual space within Y-ground layer
				let targetX = Math.random() * JSpective._singleton._virtualSpaceWidth;
				let targetY = this._groundLevel;
				let targetZ = Math.random() * JSpective._singleton._virtualSpaceDepth;
				item._projection.setTargetPosition(targetX, targetY, targetZ);
				
				item._projection.moveToTarget();
				
			} else if(item._isSelfTargeting && !item._isMouseOver) {
					item._projection.moveToTarget();
			}
		}
	}


	public reshuffle(): void {
		for(let item of this._items) {
			if(!item._isOpened && !item._isParked) {
				item._isSelfTargeting = false;
			}
		}
	}


	// WHEEL animation for menuItems
	public animateWheel(): void {
		// Remembering some maths on circles
		// Umfang, Flaeche: u=2*PI*radius, A=PI*r^2  =u^2/(4*PI)
		// Linear translation: pos = pos + 1
		// Wave translation: pos = pos + sin(iterator) with iterator staying between 0 <= i <= 2*PI
		//		y = sin(x): A full wave-period is 360 degree = 2*PI, Amplitude=1
		//			Nullpunkte:			sin(x) = 0 AT x=0 AND x=PI    //sind auch Wendepunkte
		//			Hochpunkt:	max sin(x)=1 AT x=PI/2
		//			Tiefpunkt:			min sin(x)=-1 AT x=(3*PI)/2
		//		y = a * sin(b*x): Full wave period is 360 degree = (2*PI)/b, Amplitude=a
		//			Nullpunkte:			=0 AT x=0 AND x=(PI/b)
		//			Hochpunkt:			max=a AT x=PI/(2*b)
		//			Tiefpunkt:			min=-a AT x=(3*PI)/(2*b)
		//			Parallel translation:	?
		//			Symmetry examples: sin(-x)= -sin(x); cos(-x)=cos(x);
		//			Cosinus: sin(x + PI/2)= cos(x), so the cosinus curve is the sinus curve shifted by PI/2 to the right.
		//				cos(x + PI/2)= -sin(x); sin(x+PI)= -sin(x); cos(x+PI)= -cos
		
		let initCirclePhi = 0;
		let divisor = 1;
		if(this._items.length != 0) { divisor = this._items.length };
		
		for(let item of this._items) {
			if(!item._isOpened && !item._isParked) {			
				let translationPhi = initCirclePhi + this._animIterator;
				//let tmpCenterY = this._wheelCenterY;
				//if(item._isMouseOver == 1) {
				//	 tmpCenterY = tmpCenterY - 30;
				//}
				if(this._isHorizontal) {
					item._projection.setTargetPosition(this._wheelCenterX + (this._wheelRadius * Math.sin(translationPhi)), this._wheelCenterY, this._wheelCenterZ + (this._wheelRadius * Math.cos(translationPhi)) );
				} else {
					item._projection.setTargetPosition(this._wheelCenterX, this._wheelCenterY  + (this._wheelRadius * Math.sin(translationPhi)), this._wheelCenterZ + (this._wheelRadius * Math.cos(translationPhi)) );
				}
				item._isSelfTargeting = true;
				item._projection.moveToTarget();
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			
			} else if(item._isSelfTargeting) {
					item._projection.moveToTarget();
			}
		}//for
		
		// Increase animating iterator
		this._animIterator = this._animIterator + (0.05 * this._clockwise);
		if(this._animIterator > 2 * Math.PI) { this._animIterator = 0; }
	}


	//TODO: Implement method BALL animation for menuItems
	//TODO: Implement CRYSTAL animation for menuItems

} // end class
