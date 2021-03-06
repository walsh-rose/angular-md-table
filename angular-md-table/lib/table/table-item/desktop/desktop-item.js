class DesktopItemController {
    constructor() {
    }

    getExcludedKeys() {
        return this.ListCtrl.exclude;
    }

    getPipes(){
        return this.ListCtrl.getPipes();
    }

    shouldHaveHoverEffet(){
        return this.ListCtrl.hasTransclude('details');
    }
}

const ttmdDesktopItemComponent = {
    bindings: {
        item: '='
    },
    transclude: true,
    require: {
        'ItemCtrl': '^ttmdTableItem',
        'ListCtrl': '^^ttmdTable'
    },
    replace: true,
    controller: DesktopItemController,
    controllerAs: 'vm',
    template: require('./desktop-item.html')
};

export default (ngModule) => {
    ngModule.component('ttmdDesktopItem', ttmdDesktopItemComponent);
}
