

function Transaction(hash, address, amount, price, state, timestamp, page){
    this.hash = hash;
    this.address = address;
    this.amount = amount;
    this.price = price;
    this.state = state;
    this.fiat = amount * price;
    this.timestamp = timestamp;
    this.page = page;

    this.getHash = function() {
        return this.hash;
    };

    this.getPage = function() {
        return this.page;
    };

    this.getAddress = function () {
        return this.address;
    };

    this.getAmount = function() {
        return this.amount;
    };

    this.getPrice = function () {
        return this.price;
    };

    this.getState = function () {
        return this.state;
    };

    this.setState = function (state) {
        this.state = state
    };

    this.getFiat = function () {
        return this.fiat;
    };

    this.getTimestamp = function () {
        return this.timestamp
    };
}

Transaction.STATE = {
    SEARCH:     {
                TEXT: "Transaktion wird gesucht.",
                INFO: "Die Transaktion wird online gesucht.",
                PROGRESS: {WIDTH: 33, COLOR: "bg-warning", ANIMATE: "progress-bar-animated"}
    },
    WAIT:       {
                TEXT: "Transaktion wird bestätigt.",
                INFO: "Die Transaktion wurde gefunden und muss bestätigt werden.",
                PROGRESS: {WIDTH: 66, COLOR: "bg-warning", ANIMATE: "progress-bar-animated"}
    },
    SUCCESS:    {
                TEXT: "Transaktion Erfolgreich!",
                INFO: "Die Transaktion wurde erfolgreich bestätigt.",
                PROGRESS: {WIDTH: 100, COLOR: "bg-success", ANIMATE: ""}
    },
    MISSING:    {
                TEXT: "Fehlender Betrag!",
                INFO: "Es Betrag fehlt! Bitte erneut QR-Code erneut scannen.",
                PROGRESS: {WIDTH: 75, COLOR: "bg-danger", ANIMATE: "progress-bar-animated"}
    },
    FAILED:     {
                TEXT: "Fehlgeschlagen!",
                INFO: "Es ist ein Fehler aufgetreten!",
                PROGRESS: {WIDTH: 100, COLOR: "bg-danger", ANIMATE: ""}
    },
    TIMEOUT:    {
                TEXT: "Zeitüberschreitung.",
                INFO: "Keine Transaction gefunden...",
                PROGRESS: {WIDTH: 100, COLOR: "bg-danger", ANIMATE: ""}
    }
};
