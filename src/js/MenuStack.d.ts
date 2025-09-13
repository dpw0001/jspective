import { MenuLevel } from "./MenuLevel.js";
export declare class MenuStack {
    menuLevels: Array<MenuLevel>;
    activeMenuLevelIndex: number;
    constructor();
    populate(menuLevels: Array<MenuLevel>): void;
    addMenuLevel(menuLevel: MenuLevel): void;
    dropMenuLevel(): void;
    getActiveMenuLevel(): MenuLevel;
    getPreviousMenuLevel(): MenuLevel;
    increaseActiveMenuLevel(): void;
    decreaseActiveMenuLevel(): void;
}
//# sourceMappingURL=MenuStack.d.ts.map