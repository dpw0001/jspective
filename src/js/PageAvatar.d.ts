import { Avatar } from "./Avatar.js";
import { IMenuItem } from "./IMenuItem.js";
import { JSpective } from "./JSpective.js";
import { MenuLevel } from "./MenuLevel.js";
export declare class PageAvatar extends Avatar implements IMenuItem {
    menuItemId: number;
    dataUrl: string;
    parentMenuLevel: MenuLevel;
    isSelfTargeting: boolean;
    isOpened: boolean;
    isParked: boolean;
    isClosing: boolean;
    isMouseOver: boolean;
    isExternalPage: boolean;
    lastScrollTop: number;
    constructor(jspective: JSpective, menuItemId: number, isExternal: boolean, label: string, hideLabel: boolean, dataUrl: string, parentMenuLevel: MenuLevel, width: number, height: number, baseCssClass: string, imageUrl: string);
    reachedTarget(): void;
    openItem(): void;
    closeItem(): void;
    handleClick(): boolean;
    onRequestSuccess(responseData: any): void;
    onRequestError(xmlHttpReq: any, errStr: any, exceptionObj: any): void;
    handleMouseOver(): void;
    handleMouseOut(): void;
}
//# sourceMappingURL=PageAvatar.d.ts.map