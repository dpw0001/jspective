import { EnumAnimationMode, EnumMenuItemType } from "./Enums.js";
import { MenuItemRecord } from "./MenuItemRecord.js";
export declare class MenuItemRecords {
    entries: Array<MenuItemRecord>;
    constructor();
    addMenuItemRecord(menuItemRecord: MenuItemRecord): void;
    addEntry(itemType: EnumMenuItemType, label: string, hideLabel: boolean, contentUrl: string, width: number, height: number, imageUrl: string, defaultAnimationMode: EnumAnimationMode | null): void;
    parseXML(menuXML: string): void;
}
//# sourceMappingURL=MenuItemRecords.d.ts.map