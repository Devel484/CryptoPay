


function Asset(address) {
    this.address = address;
    this.use = false;

    this.getAddress = function () {
        return this.address;
    };

    this.isInUse = function () {
        return this.use;
    };

    this.setInUse = function (use) {
        this.use = use;
    };
}