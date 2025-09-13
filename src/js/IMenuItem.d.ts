import { MenuLevel } from "./MenuLevel.js";
export interface IMenuItem {
    menuItemId: number;
    dataUrl: string;
    parentMenuLevel: MenuLevel;
    isSelfTargeting: boolean;
    isOpened: boolean;
    isParked: boolean;
    isClosing: boolean;
    isMouseOver: boolean;
    openItem(): void;
    closeItem(): void;
}
//# sourceMappingURL=IMenuItem.d.ts.map