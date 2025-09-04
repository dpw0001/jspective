// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class MenuLevel {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_items;
	_isLoaded;
	_groundLevel;
	_menuAvatar;
	_animationMode;
	_animIterator;
	_wheelRadius;
	_clockwise;
	_isHorizontal;
	_wheelCenterX;
	_wheelCenterY;
	_wheelCenterZ;


	constructor(id, groundLevel, menuAvatar) {
		this._id = id;
		this._items = new Array(); // Container for objects that apply to interface MenuItem.
		this._isLoaded = 0;
		this._groundLevel = groundLevel;
		this._menuAvatar = menuAvatar;	// Related front end object
		
		//new stuff
		this._animationMode = "wheel";
		if(menuAvatar != null) { this._animationMode = menuAvatar._defaultMenuMode; }
		this._animIterator = 0;
		this._wheelRadius = 0;
		this._clockwise = 1; // Set to -1 or 1
		this._isHorizontal = 1;
		this._wheelCenterX = parseInt(globalThis.JSPECTIVE._virtualSpaceWidth / 2); // Init center for wheel animation
		this._wheelCenterY = groundLevel; //parseInt(globalThis.JSPECTIVE._virtualSpaceHeight / 2);
		this._wheelCenterZ = parseInt(globalThis.JSPECTIVE._virtualSpaceDepth / 2);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	populate(menuItemRecords) {
		for (let i=0; i < menuItemRecords._entries.length; i++) {
			this.addMenuItem(i, menuItemRecords._entries[i]);
		}
		
		this.calcWheelRadius();
		
		this._isLoaded = 1;
	}


	calcWheelRadius() {
		// Calculate radius for wheel animation
		this._wheelRadius = this._items.length * 45; //25;
		if(this._wheelRadius < 150) { this._wheelRadius = 150; }
		if(this._wheelRadius > 400) { this._wheelRadius = 400; }
	}


	addMenuItem(menuItemId, menuItemRecord) {
		// Generate new avatar for the item
		let newAvatar = null;

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
		
		if(menuItemRecord._itemType == globalThis.JSPECTIVE._menuItemTypePage) {
			newAvatar = new PageAvatar(menuItemId, 0, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "page_avatar", menuItemRecord._imageUrl);
			
		} else if(menuItemRecord._itemType == globalThis.JSPECTIVE._menuItemTypeLink) {
			newAvatar = new PageAvatar(menuItemId, 1, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "link_avatar", menuItemRecord._imageUrl);
			
		} else if(menuItemRecord._itemType == globalThis.JSPECTIVE._menuItemTypeMenu) {
			if(menuItemRecord._defaultMenuMode == "shuffle") {
				newAvatar = new MenuAvatar(menuItemId, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "menu_avatar", menuItemRecord._imageUrl, "shuffle");
			} else {
				newAvatar = new MenuAvatar(menuItemId, menuItemRecord._label, menuItemRecord._hideLabel, menuItemRecord._contentUrl, this, defaultWidth, defaultHeight, "menu_avatar", menuItemRecord._imageUrl, "wheel");
			}
			
		} else {
			console.debug("MenuLevel.addMenuItem(): Unknown value \"" + menuItemRecord._itemType + "\" for MenuItemRecord._itemType.");
		}
		
		// Lift vanishing point to menu ground level
		newAvatar._projection._vanishY = this._groundLevel - globalThis.JSPECTIVE._levelHeight;
		
		let randX = 50;
		let randY = this._groundLevel;
		let randZ = Math.random() * globalThis.JSPECTIVE._virtualSpaceDepth;
		
		newAvatar._projection.set3DPosition(randX, randY, randZ);
		this._items.push(newAvatar);
	}


	// Request menu data from server
	requestMenuData(url) {
		let self = this;
		$.ajax({
			type: "GET",
			url: url,
			dataType: "xml",
			success: function(responseXML){
				let menuItemRecords = new MenuItemRecords();
				menuItemRecords.parseXML(responseXML);
				
				self.populate(menuItemRecords);
				
			},
			error: function(xmlHttpReq, errStr, exceptionObj){
				window.clearInterval(globalThis.JSPECTIVE._openMenuInterval);
				alert("Error: Failed to fetch menu data from server. (Message: " + errStr + ")");
			},
			timeout: function(xmlHttpReq, errStr, exceptionObj){
				window.clearInterval(globalThis.JSPECTIVE._openMenuInterval);
				alert("Timeout: Failed to fetch menu data from server. (Message: " + errStr + ")");
			}
		});
	}


	finishedLoading() {
		// Menu data may not be available until asynchron request finishes
		let success = 0;
		if(this._isLoaded == 1) {
			if(globalThis.JSPECTIVE._openMenuInterval != null) {
				window.clearInterval(globalThis.JSPECTIVE._openMenuInterval); // Also cleared in request timeout and error handlers for save fallback.
			}
			for(let i=0; i < this._items.length; i++) {
				this._items[i].showDOM();
			};
			success = 1;
		} else {
			success = 0;
		}
		return success;
	}


	formWheel(centerX, centerY, centerZ, radius) {
		this._wheelCenterX = centerX;
		this._wheelCenterY = centerY;
		this._wheelCenterZ = centerZ;
		this._wheelRadius = radius;
		
		let divisor = 1;
		if(this._items.length != 0) { divisor = this._items.length };
		
		let initCirclePhi = 0;
		for(let i=0; i < this._items.length; i++) {
			if(this._items[i]._isOpened == 0 && this._items[i]._isParked == 0) {
				this._items[i]._projection.set3DPosition(centerX + (this._wheelRadius * Math.sin(initCirclePhi)), centerY, centerZ + (radius * Math.cos(initCirclePhi)) );
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			}
		}
	}


	animate() {
		// PERFORMANCE CRITICAL FROM HERE ON: avaid any cpu-step possible!
		
		// Animate temporary movements
		for(let i=0; i < globalThis.JSPECTIVE._tempAnimationStack.length; i++) {
			if(globalThis.JSPECTIVE._tempAnimationStack[i]._isSelfTargeting == 1) {
				this.animateLinear(globalThis.JSPECTIVE._tempAnimationStack);
			}
		}
		
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
	animateLinear(AnimationStack) {
		for(let i=0; i < AnimationStack.length; i++) {
			if(AnimationStack[i]._isSelfTargeting == 1) {
				AnimationStack[i]._projection.stepToTarget();
			}
		}
	}


	// SHUFFLE animation for menu items
	animateShuffle() {
		for(let i=0; i < this._items.length; i++) {
			// Identify idle avatars and start them moving again
			if(this._items[i]._isSelfTargeting == 0 && this._items[i]._isOpened == 0 && this._items[i]._isParked == 0 && this._items[i]._isMouseOver == 0) {
			
				// Choose random target and start moving again
				this._items[i]._isSelfTargeting = 1; // Flag instantly as being busy with moving
				// Set a random target in virtual space within Y-ground layer
				let targetX = Math.random() * globalThis.JSPECTIVE._virtualSpaceWidth;
				let targetY = this._groundLevel;
				let targetZ = Math.random() * globalThis.JSPECTIVE._virtualSpaceDepth;
				this._items[i]._projection.setTargetPosition(targetX, targetY, targetZ);
				
				this._items[i]._projection.moveToTarget();
				
			} else {
				if(this._items[i]._isSelfTargeting == 1 && this._items[i]._isMouseOver == 0) {
					this._items[i]._projection.moveToTarget();
				}
			}
		}
	}


	reshuffle() {
		for(let m=0; m < this._items.length; m++) {
			if(this._items[m]._isOpened == 0 && this._items[m]._isParked == 0) {
				this._items[m]._isSelfTargeting = 0;
			}
		}
	}


	// WHEEL animation for menuItems
	animateWheel() {
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
		for(let i=0; i < this._items.length; i++) {
			if(this._items[i]._isOpened == 0 && this._items[i]._isParked == 0) {			
				let translationPhi = initCirclePhi + this._animIterator;
				//let tmpCenterY = this._wheelCenterY;
				//if(this._items[i]._isMouseOver == 1) {
				//	 tmpCenterY = tmpCenterY - 30;
				//}
				if(this._isHorizontal == 1) {
					this._items[i]._projection.setTargetPosition(this._wheelCenterX + (this._wheelRadius * Math.sin(translationPhi)), this._wheelCenterY, this._wheelCenterZ + (this._wheelRadius * Math.cos(translationPhi)) );
				} else {
					this._items[i]._projection.setTargetPosition(this._wheelCenterX, this._wheelCenterY  + (this._wheelRadius * Math.sin(translationPhi)), this._wheelCenterZ + (this._wheelRadius * Math.cos(translationPhi)) );
				}
				this._items[i]._isSelfTargeting = 1;
				this._items[i]._projection.moveToTarget();
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				let divisor = 1;
				if(this._items.length != 0) { divisor = this._items.length };
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			
			} else {
				if(this._items[i]._isSelfTargeting == 1) {
					this._items[i]._projection.moveToTarget();
				}
			}
		}//for
		
		// Increase animating iterator
		this._animIterator = this._animIterator + (0.05 * this._clockwise);
		if(this._animIterator > 2 * Math.PI) { this._animIterator = 0; }
	}


	//TODO: Implement method BALL animation for menuItems
	//TODO: Implement CRYSTAL animation for menuItems

} // end class
