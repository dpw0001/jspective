import { PageAvatar } from "./PageAvatar.js";
export class PageViewer {
    constructor(jspective, pageViewerId) {
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
    setContent(contentXML) {
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
    openView(lastScrollTop) {
        this.jspective.stopAnimation();
        this.isOpened = true;
        document.addEventListener('keyup', this.handleKeyUp);
        $("div#" + this.domId).show();
        if (lastScrollTop != null) {
            // Note: Property scrollTop of an element is only valid while it is visible
            $("div#" + this.domId + " .page_viewer_content")[0].scrollTop = lastScrollTop;
        }
    }
    closeView() {
        let contentDOM = $("div#" + this.domId + " .page_viewer_content")[0];
        // Note: Property scrollTop of an element is only valid while it is visible
        let currentScrollTop = contentDOM.scrollTop;
        $("div#" + this.domId).hide();
        document.removeEventListener('keyup', this.handleKeyUp, false);
        // Restart current animation mode
        this.jspective.startAnimation();
        // Close all opened items of current menu
        let activeMenuLevel = this.jspective.menuStack.getActiveMenuLevel();
        for (let item of activeMenuLevel.items) {
            if (item.isOpened && item instanceof PageAvatar) {
                // Buffer current scroll position of viewed page
                item.lastScrollTop = currentScrollTop;
                // Reset the page viewer's scroll position
                contentDOM.scrollTop = 0;
                item.closeItem();
            }
        }
        this.isOpened = false;
    }
    handleClickPageViewer(event) {
        // Nothing to do, so far.
        return false;
    }
    handleClickPageViewerShadow(event) {
        this.closeView();
        return false;
    }
    handleKeyUp(event) {
        event.cancelBubble = true;
        if (event.key === "Escape") {
            this.closeView();
        }
        return false;
    }
} // end class
//# sourceMappingURL=PageViewer.js.map