
// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { EnumAnimationMode, EnumMenuItemType } from "./Enums.js";
import { JSpective } from "./JSpective.js";
import { MenuAvatar } from "./MenuAvatar.js";
import { MenuItemRecord } from "./MenuItemRecord.js";
import { MenuItemRecords } from "./MenuItemRecords.js";
import { PageAvatar } from "./PageAvatar.js";

export class MenuLevel {

	// Private members
	// ---------------
	private jspective: JSpective;


	// Public members
	// --------------

	public menuLevelIndex: number;
	public items: Array<MenuAvatar|PageAvatar>;
	public isLoaded: boolean;
	public groundLevel: number;
	public menuAvatar: MenuAvatar|null;
	public animationMode: EnumAnimationMode;
	public animIterator: number;
	public wheelRadius: number;
	public clockwise: number;
	public isHorizontal: boolean;
	public wheelCenterX: number;
	public wheelCenterY: number;
	public wheelCenterZ: number;


	constructor(jspective: JSpective, groundLevel: number, menuAvatar: MenuAvatar|null) {
		this.jspective = jspective;
		this.menuLevelIndex = -1;
		this.items = new Array(); // Container for objects that apply to interface MenuItem.
		this.isLoaded = false;
		this.groundLevel = groundLevel;
		this.menuAvatar = menuAvatar;	// Related front end object
		
		//new stuff
		this.animationMode = EnumAnimationMode.wheel;
		if(menuAvatar != null) { this.animationMode = menuAvatar.defaultAnimationMode; }
		this.animIterator = 0;
		this.wheelRadius = 0;
		this.clockwise = 1; // Set to -1 or 1
		this.isHorizontal = true;
		this.wheelCenterX = Math.round(jspective.virtualSpaceWidth / 2); // Init center for wheel animation
		this.wheelCenterY = groundLevel; //Math.round(this.jspective.virtualSpaceHeight / 2);
		this.wheelCenterZ = Math.round(jspective.virtualSpaceDepth / 2);
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public populate(menuItemRecords: MenuItemRecords): void {
		for (let i=0; i < menuItemRecords.entries.length; i++) {
			this.addMenuItem(i, menuItemRecords.entries[i]);
		}
		
		this.calcWheelRadius();
		
		this.isLoaded = true;
	}


	public calcWheelRadius(): void {
		// Calculate radius for wheel animation
		this.wheelRadius = this.items.length * 45; //25;
		if(this.wheelRadius < 150) { this.wheelRadius = 150; }
		if(this.wheelRadius > 400) { this.wheelRadius = 400; }
	}


	public addMenuItem(menuItemId: number, menuItemRecord: MenuItemRecord): void {
		// Generate new avatar for the item
		let newAvatar: MenuAvatar|PageAvatar|null = null;

		// Calculate initial avatar sizes
		// TODO: substitute with browser auto-sizing of boxes
		let defaultWidth = 12 * menuItemRecord.label.length;
		let defaultHeight = 20;
		if(menuItemRecord.label.length > 9) {
			defaultWidth = 6 * menuItemRecord.label.length;
			defaultHeight = 40;
		}
		if(menuItemRecord.label.length > 30) {
			defaultWidth = 6 * menuItemRecord.label.length;
			defaultHeight = 60;
		}
		
		if(menuItemRecord.imageUrl.length > 0) {
			// Has image url
			defaultWidth = menuItemRecord.width;
			defaultHeight = menuItemRecord.height;
		}
		
		if(menuItemRecord.itemType == EnumMenuItemType.page) {
			newAvatar = new PageAvatar(this.jspective, menuItemId, false, menuItemRecord.label, menuItemRecord.hideLabel, menuItemRecord.contentUrl, this, defaultWidth, defaultHeight, "page_avatar", menuItemRecord.imageUrl);
			
		} else if(menuItemRecord.itemType == EnumMenuItemType.link) {
			newAvatar = new PageAvatar(this.jspective, menuItemId, true, menuItemRecord.label, menuItemRecord.hideLabel, menuItemRecord.contentUrl, this, defaultWidth, defaultHeight, "link_avatar", menuItemRecord.imageUrl);
			
		} else if(menuItemRecord.itemType == EnumMenuItemType.menu) {
			if(menuItemRecord.defaultAnimationMode == null) {
				menuItemRecord.defaultAnimationMode = EnumAnimationMode.wheel;
			}
			newAvatar = new MenuAvatar(this.jspective, menuItemId, menuItemRecord.label, menuItemRecord.hideLabel, menuItemRecord.contentUrl, this, defaultWidth, defaultHeight, "menu_avatar", menuItemRecord.imageUrl, menuItemRecord.defaultAnimationMode);
			
		} else {
			console.error("MenuLevel.addMenuItem(): Unknown value \"" + menuItemRecord.itemType + "\" for MenuItemRecord.itemType.");
		}
		
		if(newAvatar != null) {
			// Lift vanishing point to menu ground level
			newAvatar.projection.vanishY = this.groundLevel - this.jspective.levelHeight;
			
			let randX = 50;
			let randY = this.groundLevel;
			let randZ = Math.random() * this.jspective.virtualSpaceDepth;
			
			newAvatar.projection.set3DPosition(randX, randY, randZ);
			this.items.push(newAvatar);
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
				window.clearInterval(this.jspective.openMenuIntervalId);
				alert("Error: Failed to fetch menu data from server. (Message: " + errStr + ")");
			}
//			, timeout: function(xmlHttpReq: any, errStr: any, exceptionObj: any){
//				window.clearInterval(this.jspective.openMenuIntervalId);
//				alert("Timeout: Failed to fetch menu data from server. (Message: " + errStr + ")");
//			}
		});
	}


	public finishedLoading(): boolean {
		// Menu data may not be available until asynchron request finishes
		let success = false;
		if(this.isLoaded) {
			if(this.jspective.openMenuIntervalId != undefined) {
				window.clearInterval(this.jspective.openMenuIntervalId); // Also cleared in request timeout and error handlers for save fallback.
			}
			for(let item of this.items) {
				item.showDOM();
			};
			success = true;
		}
		
		return success;
	}


	public formWheel(centerX: number, centerY: number, centerZ: number, radius: number): void {
		this.wheelCenterX = centerX;
		this.wheelCenterY = centerY;
		this.wheelCenterZ = centerZ;
		this.wheelRadius = radius;
		
		let divisor = 1;
		if(this.items.length != 0) { divisor = this.items.length };
		
		let initCirclePhi = 0;
		for(let item of this.items) {
			if(!item.isOpened && !item.isParked) {
				item.projection.set3DPosition(centerX + (this.wheelRadius * Math.sin(initCirclePhi)), centerY, centerZ + (radius * Math.cos(initCirclePhi)) );
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			}
		}
	}


	public animate(): void {
		// PERFORMANCE CRITICAL FROM HERE ON
		
		// Animate temporary movements
		// FIXME???
//		for(let entry of this.jspective.tempAnimationStack) {
//			if(entry.isSelfTargeting) {
//				this.animateLinear(this.jspective.tempAnimationStack);
//			}
//		}
		
		// Animate menu items depending on current mode
		if(this.animationMode == EnumAnimationMode.wheel) {
			this.animateWheel();
			return; // !
			
		} else if(this.animationMode == EnumAnimationMode.shuffle) {
			this.animateShuffle();
			return; // !
			
		} else if(this.animationMode == EnumAnimationMode.linear) {
			//this.animateLinear();
			return; // !
			
		} else {
			console.error("MenuLevel with menuLevelId \"" + this.menuLevelIndex + "\" has unknown animationMode: \"" + this.animationMode + "\"");
		}
	}


	// LINEAR animation for menu items
	public animateLinear(animationStack: any): void {
		for(let entry of animationStack) {
			if(entry.isSelfTargeting) {
				entry.projection.stepToTarget();
			}
		}
	}


	// SHUFFLE animation for menu items
	public animateShuffle(): void {
		for(let item of this.items) {
			// Identify idle avatars and start them moving again
			if(!item.isSelfTargeting && !item.isOpened && !item.isParked && !item.isMouseOver) {
			
				// Choose random target and start moving again
				item.isSelfTargeting = true; // Flag instantly as being busy with moving
				// Set a random target in virtual space within Y-ground layer
				let targetX = Math.random() * this.jspective.virtualSpaceWidth;
				let targetY = this.groundLevel;
				let targetZ = Math.random() * this.jspective.virtualSpaceDepth;
				item.projection.setTargetPosition(targetX, targetY, targetZ);
				
				item.projection.moveToTarget();
				
			} else if(item.isSelfTargeting && !item.isMouseOver) {
					item.projection.moveToTarget();
			}
		}
	}


	public reshuffle(): void {
		for(let item of this.items) {
			if(!item.isOpened && !item.isParked) {
				item.isSelfTargeting = false;
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
		if(this.items.length != 0) { divisor = this.items.length };
		
		for(let item of this.items) {
			if(!item.isOpened && !item.isParked) {			
				let translationPhi = initCirclePhi + this.animIterator;
				//let tmpCenterY = this.wheelCenterY;
				//if(item.isMouseOver == 1) {
				//	 tmpCenterY = tmpCenterY - 30;
				//}
				if(this.isHorizontal) {
					item.projection.setTargetPosition(this.wheelCenterX + (this.wheelRadius * Math.sin(translationPhi)), this.wheelCenterY, this.wheelCenterZ + (this.wheelRadius * Math.cos(translationPhi)) );
				} else {
					item.projection.setTargetPosition(this.wheelCenterX, this.wheelCenterY  + (this.wheelRadius * Math.sin(translationPhi)), this.wheelCenterZ + (this.wheelRadius * Math.cos(translationPhi)) );
				}
				item.isSelfTargeting = true;
				item.projection.moveToTarget();
				
				// Increase initCirclePhi iterator, full circle is 2 * PI
				initCirclePhi = initCirclePhi + (2 * Math.PI) / divisor;
				if(initCirclePhi > 2 * Math.PI) { initCirclePhi = 0; }
			
			} else if(item.isSelfTargeting) {
					item.projection.moveToTarget();
			}
		}//for
		
		// Increase animating iterator
		this.animIterator = this.animIterator + (0.05 * this.clockwise);
		if(this.animIterator > 2 * Math.PI) { this.animIterator = 0; }
	}


	//TODO: Implement method BALL animation for menuItems
	//TODO: Implement CRYSTAL animation for menuItems

} // end class
