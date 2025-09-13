// ------------------------------------------------------------------
// Author: Daniel-Percy Wimpff <daniel@wimpff.de>
// Copyright (c) 2007-2025 Daniel-Percy Wimpff <daniel@wimpff.de>, Germany
// MIT License
// ------------------------------------------------------------------
import { JSpective } from "./JSpective.js";
import { PageAvatar } from "./PageAvatar.js";

export class PageViewer {

	// Private members
	// ---------------
	private jspective: JSpective;


	// Public members
	// --------------

	public pageViewerId: number;
	public domId: string;
	public isOpened: boolean;

	constructor(jspective: JSpective, pageViewerId: number) {
		this.jspective = jspective;
		this.pageViewerId = pageViewerId;
		this.domId = "PageViewer_" + pageViewerId;
		this.isOpened = false;
		
		// Bind event handlers to this
		// ---------------------------
		this.handleClickPageViewer = this.handleClickPageViewer.bind(this);
		this.handleClickPageViewerShadow = this.handleClickPageViewerShadow.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
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
		//$("div#" + this.domId + "/div.page_viewer_title").empty().append(pageTitle);
		//$("div#" + this.domId + "/div.page_viewer_content").empty().append(pageContent);
		
		// Use to show (untouched) html in PageViewer and append close buttons
		$("div#" + this.domId).empty().append(contentXML);
		$("div#" + this.domId + " div.page_viewer_title").append("<div style=\"position: absolute; right: 10px; top: 40px;\">close | schließen</div>");
		$("div#" + this.domId + " div.page_viewer_content").append("<br/><br/><div id=\"PageButtons\"> <input id=\"ButtonClosePage\" type=\"button\" value=\"Close\" /></div>");
		// Bind handlers for page content
		$("div#" + this.domId + " a").on("click", null, this.domId, this.jspective.handleClickAnchor);
		$("div#" + this.domId + " div.page_viewer_title").on("click", null, this.domId, this.handleClickPageViewerShadow);
		$("div#" + this.domId + " input#ButtonClosePage").on("click", null, this.domId, this.handleClickPageViewerShadow);
	}


	public openView(lastScrollTop: number): void {
		this.jspective.stopAnimation();
		this.isOpened = true;
		
		document.addEventListener('keyup', this.handleKeyUp);
			
		$("div#" + this.domId).show();
		
		if(lastScrollTop != null) {
			// Note: Property scrollTop of an element is only valid while it is visible
			$("div#" + this.domId + " .page_viewer_content")[0].scrollTop = lastScrollTop;
		}
	}


	public closeView(): void {
		let contentDOM = $("div#" + this.domId + " .page_viewer_content")[0];
		// Note: Property scrollTop of an element is only valid while it is visible
		let currentScrollTop = contentDOM.scrollTop;
		
		$("div#" + this.domId).hide();
		
		document.removeEventListener('keyup', this.handleKeyUp, false);
		
		// Restart current animation mode
		this.jspective.startAnimation();
		// Close all opened items of current menu
		let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
		for(let item of activeMenuLevel.items) {
			if(item.isOpened && item instanceof PageAvatar) {
				// Buffer current scroll position of viewed page
				item.lastScrollTop = currentScrollTop;
				// Reset the page viewer's scroll position
				contentDOM.scrollTop = 0;
				
				item.closeItem();
			}
		}
		this.isOpened = false;
	}


	public handleClickPageViewer(event: any): boolean {
		// Nothing to do, so far.
		return false;
	}


	public handleClickPageViewerShadow(event: any): boolean {
		this.closeView();
		return false;
	}


	public handleKeyUp(event: any): boolean {
		event.cancelBubble = true;
		if(event.key === "Escape") {
			this.closeView();
		}
		return false;
	}
} // end class
