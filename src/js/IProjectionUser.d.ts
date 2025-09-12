import { Projection } from "./Projection.js";
export interface IProjectionUser {
    projection: Projection;
    domId: string;
    domElement: any;
    createDOM(): void;
    updateDOM(): void;
    removeDOM(): void;
    showDOM(): void;
    hideDOM(): void;
    reachedTarget(): void;
}
//# sourceMappingURL=IProjectionUser.d.ts.map