import { IProjectionUser } from "./IProjectionUser.js";
export declare class Projection {
    parent: IProjectionUser;
    posX: number;
    posY: number;
    posZ: number;
    targetPosX: number;
    targetPosY: number;
    targetPosZ: number;
    speed: number;
    width: number;
    height: number;
    fontsize: number;
    vanishX: number;
    vanishY: number;
    vanishZ: number;
    projectedX: number;
    projectedY: number;
    projectedWidth: number;
    projectedHeight: number;
    projectedFontsize: number;
    movementVectorX: number;
    movementVectorY: number;
    movementVectorZ: number;
    constructor(parent: IProjectionUser, width: number, height: number, fontsize: number, vanishX: number, vanishY: number, vanishZ: number, speed: number);
    set3DPosition(x: number, y: number, z: number): void;
    setTargetPosition(x: number, y: number, z: number): void;
    projection(): void;
    moveToTarget(): void;
    stepToTarget(): void;
}
//# sourceMappingURL=Projection.d.ts.map