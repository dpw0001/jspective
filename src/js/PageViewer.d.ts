import { JSpective } from "./JSpective";
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
}
//# sourceMappingURL=PageViewer.d.ts.map