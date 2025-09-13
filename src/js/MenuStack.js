export class MenuStack {
    constructor() {
        this.menuLevels = new Array();
        this.activeMenuLevelIndex = -1;
    }
    // Private methods
    // ---------------
    // Public methods
    // --------------
    populate(menuLevels) {
        for (let item of menuLevels) {
            this.addMenuLevel(item);
        }
    }
    addMenuLevel(menuLevel) {
        menuLevel.menuLevelIndex = this.activeMenuLevelIndex + 1;
        this.menuLevels.push(menuLevel);
    }
    dropMenuLevel() {
        this.menuLevels.pop();
        this.decreaseActiveMenuLevel();
    }
    getActiveMenuLevel() {
        let activeMenuLevel = this.menuLevels[this.activeMenuLevelIndex];
        if (activeMenuLevel == undefined) {
            throw "Exception in MenuStack: Active menu level is undefined for activeMenuLevelIndex \"" + this.activeMenuLevelIndex + "\".";
        }
        return activeMenuLevel;
    }
    getPreviousMenuLevel() {
        let prevMenuLevel = this.menuLevels[this.activeMenuLevelIndex - 1];
        if (prevMenuLevel == undefined) {
            throw "Exception in MenuStack: Previous menu level is undefined for current activeMenuLevelIndex \"" + this.activeMenuLevelIndex + "\".";
        }
        return prevMenuLevel;
    }
    increaseActiveMenuLevel() {
        this.activeMenuLevelIndex = this.activeMenuLevelIndex + 1;
    }
    decreaseActiveMenuLevel() {
        this.activeMenuLevelIndex = this.activeMenuLevelIndex - 1;
    }
} // end class
//# sourceMappingURL=MenuStack.js.map