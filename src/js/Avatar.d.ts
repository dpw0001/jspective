import { IProjectionUser } from "./IProjectionUser.js";
import { JSpective } from "./JSpective.js";
import { Projection } from "./Projection.js";
export declare abstract class Avatar implements IProjectionUser {
    jspective: JSpective;
    projection: Projection;
    domId: string;
    domElement: any;
    label: string;
    hideLabel: boolean;
    baseCssClass: string;
    imageUrl: string;
    constructor(jspective: JSpective, domId: string, label: string, hideLabel: boolean, width: number, height: number, baseCssClass: string, imageUrl: string);
    createDOM(): void;
    updateDOM(): void;
    removeDOM(): void;
    showDOM(): void;
    hideDOM(): void;
    abstract reachedTarget(): void;
    abstract handleClick(event: Event): boolean;
    abstract handleMouseOver(event: Event): void;
    abstract handleMouseOut(event: Event): void;
}
//# sourceMappingURL=Avatar.d.ts.map