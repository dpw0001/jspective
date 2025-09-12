import { Projection } from "./Projection.js";
export class Avatar {
    constructor(jspective, domId, label, hideLabel, width, height, baseCssClass, imageUrl) {
        this.jspective = jspective;
        this.projection = new Projection(this, width, height, jspective.defaultFontSize, jspective.initVanishX, jspective.initVanishY, jspective.initVanishZ, jspective.defaultSpeed);
        this.projection.parent = this; // Register this Avatar with its child Projection for callbacks
        this.domId = domId;
        this.domElement = null;
        this.label = label;
        this.hideLabel = hideLabel;
        this.baseCssClass = baseCssClass;
        this.imageUrl = imageUrl;
        // Bind event handlers to this
        // ---------------------------
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }
    // Private methods
    // ---------------
    // Public methods
    // --------------
    // Implements interface ProjectionUser
    createDOM() {
        let projectionScreen2dDom = document.getElementById('ProjectionScreen2D');
        if (projectionScreen2dDom == null) {
            console.error("Missing element id \"ProjectionScreen2D\" in HTML.");
        }
        else {
            this.domElement = document.createElement("div");
            let idAttr = document.createAttribute("id");
            idAttr.nodeValue = this.domId;
            this.domElement.setAttributeNode(idAttr);
            let classAttr = document.createAttribute("class");
            classAttr.nodeValue = "avatar " + this.baseCssClass;
            this.domElement.setAttributeNode(classAttr);
            projectionScreen2dDom.appendChild(this.domElement);
            let jQueryElement = $("div#" + this.domId);
            if (this.imageUrl.length > 0) {
                jQueryElement.append("<img src=\"" + this.imageUrl + "\" class=\"avatar_image\" alt=\"\" width=\"" + this.projection.projectedWidth + "\" height=\"" + this.projection.projectedHeight + "\" />");
            }
            if (!this.hideLabel) {
                let labelDOM = document.createElement("div");
                let labelClassAttr = document.createAttribute("class");
                labelClassAttr.nodeValue = "avatarLabel";
                labelDOM.setAttributeNode(labelClassAttr);
                let labelTextNode = document.createTextNode(this.label);
                labelDOM.appendChild(labelTextNode);
                this.domElement.appendChild(labelDOM);
            }
            // Register event handlers
            jQueryElement.on("click", null, this.domId, this.handleClick);
            jQueryElement.on("mouseover", null, this.domId, this.handleMouseOver);
            jQueryElement.on("mouseout", null, this.domId, this.handleMouseOut);
        }
    }
    // Implements interface ProjectionUser
    updateDOM() {
        // Note: This function is performance critical!
        //       Keep it as fast as possible.
        this.domElement.style.left = this.projection.projectedX + "px";
        this.domElement.style.top = this.projection.projectedY + "px";
        this.domElement.style.width = this.projection.projectedWidth + "px";
        // Note: avatarHeight is auto-ajusted according to its child-elements
        //this.domElement.style.height = this.projection.projectedHeight + "px";
        this.domElement.style.fontSize = this.projection.projectedFontsize + "pt";
        this.domElement.style.zIndex = (this.jspective.virtualSpaceDepth + 100) - this.projection.posZ;
        if (this.imageUrl.length > 0) {
            let imgDom = this.domElement.getElementsByTagName("img")[0];
            if (imgDom != undefined) {
                imgDom.width = this.projection.projectedWidth;
                imgDom.height = this.projection.projectedHeight;
            }
        }
        // Uncomment for debugging purposes
        //$("div#" + this.domId).empty().append(this.label + "any debug info");
    }
    // Implements interface ProjectionUser
    removeDOM() {
        // TODO: Substitude jquery with something like: this.domElement.remove();
        $("div#" + this.domId).remove();
    }
    // Implements interface ProjectionUser
    showDOM() {
        // TODO: Substitude jquery with something like: this.domElement.show();
        $("div#" + this.domId).show();
    }
    // Implements interface ProjectionUser
    hideDOM() {
        // TODO: Substitude jquery with something like: this.domElement.hide();
        $("div#" + this.domId).hide();
    }
} // end class
//# sourceMappingURL=Avatar.js.map