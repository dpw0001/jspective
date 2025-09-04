// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class MenuItemRecords {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_entries;


	constructor() {
		this._entries = new Array();
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	addMenuItemRecord(menuItemRecord) {
		this._entries.push(menuItemRecord);
	}


	addEntry(itemType, label, hideLabel, contentUrl, width, height, imageUrl, defaultMenuMode) {
		let menuItemRecord = new MenuItemRecord(itemType, label, hideLabel, contentUrl, width, height, imageUrl, defaultMenuMode);
		this.addMenuItemRecord(menuItemRecord);
	}


	parseXML(menuXML) {
		let self = this;
		
		// Parse XML containing menu item records
		$("menu > *", menuXML).each( function() {
			// Access to selected xml-element via $(this)
			let label = "";
			let contentUrl = "";
			let imageUrl = "";
			let imageWidth = 100;
			let imageHeight = 100;
			if( $(this).children("title") ) { label= $(this).children("title").text(); }
			if( $(this).children("url") ) { contentUrl = $(this).children("url").text(); }
			if( $(this).children("image").length > 0 ) {
				let imgTag = $(this).children("image")[0];
				if( imgTag != null) {
					imageUrl = imgTag.textContent;
					imageWidth = parseInt(imgTag.attributes.width.value);
					imageHeight = parseInt(imgTag.attributes.height.value);
				}
			}
			
			if( $(this).is("submenu") ) {
				let modeAttrVal = $(this).attr("mode");
				if(modeAttrVal == "shuffle") {
					self.addEntry(globalThis.JSPECTIVE._menuItemTypeMenu, label, false, contentUrl, imageWidth, imageHeight, imageUrl, "shuffle");
				} else {
					self.addEntry(globalThis.JSPECTIVE._menuItemTypeMenu, label, false, contentUrl, imageWidth, imageHeight, imageUrl, "wheel");
				}
				
			} else if( $(this).is("page") ) {
				self.addEntry(globalThis.JSPECTIVE._menuItemTypePage, label, false, contentUrl, imageWidth, imageHeight, imageUrl, null);
				
			} else if( $(this).is("link") ) {
				self.addEntry(globalThis.JSPECTIVE._menuItemTypeLink, label, false, contentUrl, imageWidth, imageHeight, imageUrl, null);
			}
		});//each
	}
	
} // end class
