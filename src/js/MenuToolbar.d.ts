import { Avatar } from "./Avatar.js";
import { JSpective } from "./JSpective.js";
export declare class MenuToolbar extends Avatar {
    menuToolbarId: number;
    bgColor: string;
    fontColor: string;
    borderColor: string;
    isSelfTargeting: boolean;
    isOpened: boolean;
    isClosing: boolean;
    isParked: boolean;
    isMouseOver: boolean;
    isWatching: boolean;
    constructor(jspective: JSpective, menuToolbarId: number, label: string, width: number, height: number, bgColor: string, fontColor: string, borderColor: string, imageUrl: string);
    createDOM(): void;
    updateDOM(): void;
    reachedTarget(): void;
    openView(): void;
    closeView(): void;
    warpToActiveMenu(): void;
    handleMenuToolAxis(event: any): boolean;
    handleMenuToolClockwise(event: any): boolean;
    handleMenuToolMode(event: any): boolean;
    handleClick(event: Event): boolean;
    handleMouseOver(event: Event): void;
    handleMouseOut(event: Event): void;
}
//# sourceMappingURL=MenuToolbar.d.ts.map