

function main(){
    let bch = new Asset("Bitcoin Cash", "BCH");
    bch.loadCurrentPrice();
    let bch_wallet = new Wallet(bch, "1G3sqzWVwJBsNbV1kDSS93N16CQyZ3qKb1");
    bch_wallet.loadTransactions();
}