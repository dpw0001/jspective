import { JSpective } from "./JSpective.js";
export declare class PageViewer {
    private jspective;
    pageViewerId: number;
    domId: string;
    isOpened: boolean;
    constructor(jspective: JSpective, pageViewerId: number);
    setContent(contentXML: string): void;
    openView(lastScrollTop: number): void;
    closeView(): void;
    handleClickPageViewer(event: any): boolean;
    handleClickPageViewerShadow(event: any): boolean;
    handleKeyUp(event: any): boolean;
}
//# sourceMappingURL=PageViewer.d.ts.map