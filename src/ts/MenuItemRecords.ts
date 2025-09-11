// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { MenuItemRecord } from "./MenuItemRecord.js";

export class MenuItemRecords {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _entries: any; //Array<MenuItemRecord>;


	constructor() {
		this._entries = new Array();
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public addMenuItemRecord(menuItemRecord: MenuItemRecord): void {
		this._entries.push(menuItemRecord);
	}


	public addEntry(itemType: string, label: string, hideLabel: boolean, contentUrl: string,
				width: number, height: number, imageUrl: string, defaultMenuMode: string|null): void {
		
		let menuItemRecord = new MenuItemRecord(itemType, label, hideLabel, contentUrl, width, height, imageUrl, defaultMenuMode);
		this.addMenuItemRecord(menuItemRecord);
	}


	public parseXML(menuXML: string): void {
		
		let self = this;
		
		//let doc = $.parseXML(menuXML);
		//console.log($($doc).find('ParentNode').attr('Symbol'))
		
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
					if(imgTag.textContent != null) {
						imageUrl = imgTag.textContent;
					}
					let attrWidth: string|null = imgTag.getAttribute("width");
					if(attrWidth != null) {
						imageWidth = parseInt(attrWidth);
					}
					
					
					let attrHeight: string|null = imgTag.getAttribute("width");
					if(attrHeight != null) {
						imageHeight = parseInt(attrHeight);
					}
				}
			}
			
			if( $(this).is("submenu") ) {
				let modeAttrVal = $(this).attr("mode");
				if(modeAttrVal == "shuffle") {
					self.addEntry(JSpective._singleton._menuItemTypeMenu, label, false, contentUrl, imageWidth, imageHeight, imageUrl, "shuffle");
				} else {
					self.addEntry(JSpective._singleton._menuItemTypeMenu, label, false, contentUrl, imageWidth, imageHeight, imageUrl, "wheel");
				}
				
			} else if( $(this).is("page") ) {
				self.addEntry(JSpective._singleton._menuItemTypePage, label, false, contentUrl, imageWidth, imageHeight, imageUrl, null);
				
			} else if( $(this).is("link") ) {
				self.addEntry(JSpective._singleton._menuItemTypeLink, label, false, contentUrl, imageWidth, imageHeight, imageUrl, null);
			}
		});//each
	}
	
} // end class
