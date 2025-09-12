import { Avatar } from "./Avatar.js";
import { EnumAnimationMode } from "./Enums.js";
import { IMenuItem } from "./IMenuItem.js";
import { JSpective } from "./JSpective.js";
import { MenuLevel } from "./MenuLevel.js";
export declare class MenuAvatar extends Avatar implements IMenuItem {
    menuItemId: number;
    dataUrl: string;
    parentMenuLevel: MenuLevel;
    isSelfTargeting: boolean;
    isOpened: boolean;
    isParked: boolean;
    isClosing: boolean;
    isMouseOver: boolean;
    defaultAnimationMode: EnumAnimationMode;
    constructor(jspective: JSpective, menuItemId: number, label: string, hideLabel: boolean, dataUrl: string, parentMenuLevel: MenuLevel, width: number, height: number, baseCssClass: string, imageUrl: string, defaultAnimationMode: EnumAnimationMode);
    reachedTarget(): void;
    openItem(): void;
    closeItem(): void;
    handleClick(): boolean;
    handleMouseOver(): boolean;
    handleMouseOut(): boolean;
}
//# sourceMappingURL=MenuAvatar.d.ts.map