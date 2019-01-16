

function Transaction(hash, wallet, amount, price, state, timestamp, page){
    this.hash = hash;
    this.wallet = wallet;
    this.amount = amount;
    this.price = price;
    this.state = state;
    this.fiat = amount * price;
    this.timestamp = timestamp;
    this.page = page;

    this.getHash = function() {
        return this.hash;
    };

    this.setHash = function (hash) {
        this.hash = hash;
    };

    this.getPage = function() {
        return this.page;
    };

    this.getWallet = function () {
        return this.wallet;
    };

    this.getAmount = function() {
        return this.amount;
    };

    this.getPrice = function () {
        return this.price;
    };

    this.setPrice = function (price) {
        this.price = price;
        this.fiat = amount * price;
    };

    this.getState = function () {
        return this.state;
    };

    this.setState = function (state) {
        this.state = state.state;
    };

    this.getFiat = function () {
        return this.fiat;
    };

    this.getTimestamp = function () {
        return this.timestamp
    };

}

Transaction.all = [];

Transaction.add = function(tx) {
    Transaction.all.push(tx);
    Transaction.all.sort(function(a, b){a.getTimestamp()-b.getTimestamp()})
};

Transaction.STATE = {
    SEARCH:     {
                TEXT: "Transaktion wird gesucht.",
                INFO: "Die Transaktion wird online gesucht.",
                COLOR: "table-info",
                PROGRESS: {WIDTH: 33, COLOR: "bg-warning", ANIMATE: "progress-bar-animated"}
    },
    WAIT:       {
                TEXT: "Transaktion wird bestätigt.",
                INFO: "Die Transaktion wurde gefunden und muss bestätigt werden.",
                COLOR: "table-warning",
                PROGRESS: {WIDTH: 66, COLOR: "bg-warning", ANIMATE: "progress-bar-animated"}
    },
    SUCCESS:    {
                TEXT: "Transaktion Erfolgreich!",
                INFO: "Die Transaktion wurde erfolgreich bestätigt.",
                COLOR: "table-success",
                PROGRESS: {WIDTH: 100, COLOR: "bg-success", ANIMATE: ""}
    },
    MISSING:    {
                TEXT: "Fehlender Betrag!",
                INFO: "Es Betrag fehlt! Bitte erneut QR-Code erneut scannen.",
                COLOR: "table-danger",
                PROGRESS: {WIDTH: 75, COLOR: "bg-danger", ANIMATE: "progress-bar-animated"}
    },
    FAILED:     {
                TEXT: "Fehlgeschlagen!",
                INFO: "Es ist ein Fehler aufgetreten!",
                COLOR: "table-danger",
                PROGRESS: {WIDTH: 100, COLOR: "bg-danger", ANIMATE: ""}
    },
    TIMEOUT:    {
                TEXT: "Zeitüberschreitung.",
                INFO: "Keine Transaction gefunden...",
                COLOR: "table-secondary",
                PROGRESS: {WIDTH: 100, COLOR: "bg-danger", ANIMATE: ""}
    }
};

var TABLE_COLOR = ["table-info", "table-warning", "table-success", "table-danger", "table-danger", "table-secondary"];