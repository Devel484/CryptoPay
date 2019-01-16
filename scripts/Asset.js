


function Asset(name, ticker) {
    this.name = name;
    this.ticker = ticker;
    this.price = null;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.asset = this;

    this.getName = function () {
        return this.name;
    };

    this.getTicker = function () {
        return this.ticker;
    };

    this.getPrice = function () {
        return this.price
    };

    this.onPriceUpdate = function(data){
        this.price = parseFloat(data["ask"]);
    };

    this.loadCurrentPrice = function () {
        this.xmlHttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200)
                this.asset.onPriceUpdate(JSON.parse(this.responseText));
        };
        this.xmlHttp.open( "GET", "https://api.pro.coinbase.com/products/BCH-EUR/ticker", true ); // false for synchronous request
        this.xmlHttp.send( null );
    };

}