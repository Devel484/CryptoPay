
function Wallet(asset, address) {
    this.asset = asset;
    this.address = address;
    this.incomming = false;
    this.awaitTransaction = null;
    this.page = 1;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.wallet = this;
    this.transactions = {};

    this.getAsset = function () {
        return this.asset;
    };

    this.getaddress = function () {
        return this.address;
    };

    this.awaitsInput = function () {
        return this.incomming;
    };

    this.setAwaitsInput = function (state) {
        this.incomming = state
    };

    this.setAwaitTransaction = function(tx) {
        this.awaitTransaction = tx;
    };

    this.onTransactionsLoaded = function (data) {
        data = data["data"];
        let page = data["page"];
        let pageSize = data["pagesize"];
        let length = data["total_count"];

        for (let i=0; i<length; ++i){
            let createdAt = data["list"][i]["created_at"];
            let confirmations = data["list"][i]["conformations"];
            let state = Transaction.STATE.WAIT;
            if (confirmations >= 0) {
                state = Transaction.STATE.SUCCESS;
            }
            let hash = data["list"][i]["hash"];
            for (let j=0; j<data["list"][i]["outputs"].length; ++j){
                if ( data["list"][i]["outputs"][j]["addresses"].includes(this.address) ) {
                    let amount = parseFloat(data["list"][i]["outputs"][j]["value"]) / Math.pow(10, 8);
                    let price = this.getAsset().getPrice();
                    let transaction = new Transaction(hash, this, amount, price, state, createdAt, page);
                    console.log(transaction)
                    let old_transaction = null;
                    if ( hash in this.transactions ) {
                        old_transaction = this.transactions[hash];
                    } else {
                        if ( this.awaitsInput() ){
                            old_transaction = this.awaitTransaction;
                        }
                    }
                    this.onTransactionUpdate(transaction, old_transaction)
                }
            }
        }
    };

    this.onTransactionUpdate = function (newTransaction, oldTransaction) {
        if (oldTransaction == null){
            this.transactions[newTransaction.getHash()] = newTransaction;
            return;
        }

        if ( oldTransaction.getHash() == null){
            oldTransaction.setHash(newTransaction.getHash());
            oldTransaction.setState(newTransaction.getState());
            console.log("awaited transaction found");
        }

        if ( oldTransaction.getAmount() > newTransaction.getAmount()){
            console.log("missing amount");
            oldTransaction.setState(Transaction.STATE.MISSING)
        }

        if (newTransaction.getState() !== oldTransaction.getState()){
            console.log("stateChanged");
        }

    };

    this.loadTransactions = function () {
        this.xmlHttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200)
                this.wallet.onTransactionsLoaded(JSON.parse(this.responseText));
        };
        this.xmlHttp.open( "GET", "https://bch-chain.api.btc.com/v3/address/"+this.address+"/tx?page="+this.page, true );
        this.xmlHttp.send( null );
    };
}