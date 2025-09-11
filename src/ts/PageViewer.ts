// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";

export class PageViewer {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	public _id: number;
	public _domId: string;
	public _isOpened: boolean;

	constructor(id: number) {
		this._id = id;
		this._domId = "PageViewer_" + id;
		this._isOpened = false;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	public setContent(contentXML: string): void {
		// Parse XML response
		//let pageTitle = "";
		//let pageContent = "";
		//$("page", contentXML).each( function() {
		//	pageTitle = $(this).children("title").text();
		//	pageContent = $(this).children("content").text();
		//});
		
		// Display data in PageViewer
		//$("div#" + this._domId + "/div.page_viewer_title").empty().append(pageTitle);
		//$("div#" + this._domId + "/div.page_viewer_content").empty().append(pageContent);
		
		// Use to show (untouched) html in PageViewer and append close buttons
		$("div#" + this._domId).empty().append(contentXML);
		$("div#" + this._domId + " div.page_viewer_title").append("<div style=\"position: absolute; right: 10px; top: 40px;\">close | schließen</div>");
		$("div#" + this._domId + " div.page_viewer_content").append("<br/><br/><div id=\"PageButtons\"> <input id=\"ButtonClosePage\" type=\"button\" value=\"Close\" /></div>");
		// Bind handlers for page content
		$("div#" + this._domId + " a").on("click", null, this._domId, JSpective._singleton.handleClickAnchor);
		$("div#" + this._domId + " div.page_viewer_title").on("click", null, this._domId, JSpective._singleton.handleClickPageViewerShadow);
		$("div#" + this._domId + " input#ButtonClosePage").on("click", null, this._domId, JSpective._singleton.handleClickPageViewerShadow);
	}


	public openView(lastScrollTop: number): void {
		JSpective._singleton.stopAnimation();
		this._isOpened = true;
		
		$("div#" + this._domId).show();
		
		if(lastScrollTop != null) {
			// Note: Property scrollTop of an element is only valid while it is visible
			$("div#" + this._domId + " .page_viewer_content")[0].scrollTop = lastScrollTop;
		}
	}


	public closeView(): void {
		let contentDOM = $("div#" + this._domId + " .page_viewer_content")[0];
		// Note: Property scrollTop of an element is only valid while it is visible
		let currentScrollTop = contentDOM.scrollTop;
		
		$("div#" + this._domId).hide();
		
		// Restart current animation mode
		JSpective._singleton.startAnimation();
		// Close all opened items of current menu
		let activeMenuLevel = JSpective._singleton._menuStack[JSpective._singleton._activeMenuId];
		for(let item of activeMenuLevel._items) {
			if(item._isOpened) {
				// Buffer current scroll position of viewed page
				item._lastScrollTop = currentScrollTop;
				// Reset the page viewer's scroll position
				contentDOM.scrollTop = 0;
				
				item.closeItem();
			}
		}
		this._isOpened = false;
	}

} // end class
