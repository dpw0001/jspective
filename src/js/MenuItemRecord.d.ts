import { EnumAnimationMode, EnumMenuItemType } from "./Enums";
export declare class MenuItemRecord {
    itemType: EnumMenuItemType;
    label: string;
    hideLabel: boolean;
    contentUrl: string;
    width: number;
    height: number;
    imageUrl: string;
    defaultAnimationMode: EnumAnimationMode | null;
    constructor(itemType: EnumMenuItemType, label: string, hideLabel: boolean, contentUrl: string, width: number, height: number, imageUrl: string, defaultAnimationMode: EnumAnimationMode | null);
}
//# sourceMappingURL=MenuItemRecord.d.ts.map