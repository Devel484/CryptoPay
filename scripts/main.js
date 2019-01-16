
var bch;
var bch_wallet_1;
var bch_wallet_2;
var table;

function load(){
    bch.loadCurrentPrice();
    bch_wallet_2.loadTransactions();
    table.update();
}

function main(){
    bch = new Asset("Bitcoin Cash", "BCH");
    bch.loadCurrentPrice();
    //let bch_wallet_1 = new Wallet(bch, "1G3sqzWVwJBsNbV1kDSS93N16CQyZ3qKb1");
    bch_wallet_2 = new Wallet(bch, "1BZKbSjrzzdUjpuiqGVSW16FdEzU1ktwAh");
    //bch_wallet_1.loadTransactions();
    bch_wallet_2.loadTransactions();
    table = new Table();
    table.update();
    setInterval(load, 2500);
}