// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
class PageViewer {

	// Private members
	// ---------------
	// None, yet.


	// Public members
	// --------------

	_id;
	_domId;
	_isOpened;

	constructor(id) {
		this._id = id;
		this._domId = "PageViewer_" + id;
		this._isOpened = 0;
	}


	// Private methods
	// ---------------


	// Public methods
	// --------------

	setContent(contentXML) {
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
		$("div#" + this._domId + " a").on("click", null, this._domId, globalThis.JSPECTIVE.handleClickAnchor);
		$("div#" + this._domId + " div.page_viewer_title").on("click", null, this._domId, globalThis.JSPECTIVE.handleClickPageViewerShadow);
		$("div#" + this._domId + " input#ButtonClosePage").on("click", null, this._domId, globalThis.JSPECTIVE.handleClickPageViewerShadow);
	}


	openView(lastScrollTop) {
		globalThis.JSPECTIVE.stopAnimation();
		this._isOpened = 1;
		
		$("div#" + this._domId).show();
		
		if(lastScrollTop != null) {
			// Note: Property scrollTop of an element is only valid while it is visible
			$("div#" + this._domId + " .page_viewer_content")[0].scrollTop = lastScrollTop;
		}
		
	}


	closeView() {
		let contentDOM = $("div#" + this._domId + " .page_viewer_content")[0];
		// Note: Property scrollTop of an element is only valid while it is visible
		let currentScrollTop = contentDOM.scrollTop;
		
		$("div#" + this._domId).hide();
		
		// Restart current animation mode
		globalThis.JSPECTIVE.startAnimation();
		// Close all opened items of current menu
		let activeMenuLevel = globalThis.JSPECTIVE._menuStack[globalThis.JSPECTIVE._activeMenuId];
		for(let i=0; i < activeMenuLevel._items.length; i++) {
			let item = activeMenuLevel._items[i];
			if(item._isOpened == 1) {
				// Buffer current scroll position of viewed page
				item._lastScrollTop = currentScrollTop;
				// Reset the page viewer's scroll position
				contentDOM.scrollTop = 0;
				
				item.closeItem();
			}
		}
		this._isOpened = 0;
	}

} // end class
