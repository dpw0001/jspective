import { EnumAnimationMode } from "./Enums.js";
import { JSpective } from "./JSpective.js";
import { MenuAvatar } from "./MenuAvatar.js";
import { MenuItemRecord } from "./MenuItemRecord.js";
import { MenuItemRecords } from "./MenuItemRecords.js";
import { PageAvatar } from "./PageAvatar.js";
export declare class MenuLevel {
    private jspective;
    menuLevelId: number;
    items: Array<MenuAvatar | PageAvatar>;
    isLoaded: boolean;
    groundLevel: number;
    menuAvatar: MenuAvatar | null;
    animationMode: EnumAnimationMode;
    animIterator: number;
    wheelRadius: number;
    clockwise: number;
    isHorizontal: boolean;
    wheelCenterX: number;
    wheelCenterY: number;
    wheelCenterZ: number;
    constructor(jspective: JSpective, menuLevelId: number, groundLevel: number, menuAvatar: MenuAvatar | null);
    populate(menuItemRecords: MenuItemRecords): void;
    calcWheelRadius(): void;
    addMenuItem(menuItemId: number, menuItemRecord: MenuItemRecord): void;
    requestMenuData(url: string): void;
    finishedLoading(): boolean;
    formWheel(centerX: number, centerY: number, centerZ: number, radius: number): void;
    animate(): void;
    animateLinear(animationStack: any): void;
    animateShuffle(): void;
    reshuffle(): void;
    animateWheel(): void;
}
//# sourceMappingURL=MenuLevel.d.ts.map