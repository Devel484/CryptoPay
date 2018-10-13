
var MIN_CONFORMATIONS = 0;

var STATE_SEARCH = 0;
var STATE_WAIT = 1;
var STATE_SUCCESS = 2;
var STATE_MISSING_AMOUNT = 3;
var STATE_FAILED = 4;
var STATE_TIMEOUT = 5;
var STATE_TEXT = ["suche Transaktion", "warte auf Bestätigung", "Transaktion erfolgreich!", "Fehlender Betrag!", "Fehlgeschlagen", "Zeitüberschreitung"];
var STATE_INFO = ["Transaktion wird gesucht.", "Wartet auf Bestätigung.", "Transaktion erfolgreich abgeschlossen!", "Fehlender Betrag!", "Es ist ein Fehler aufgetreten.", "Keine Transaktion gefunden..."];
var possible_address_counter = 0;
var possible_addresses = [{"address": "1G3sqzWVwJBsNbV1kDSS93N16CQyZ3qKb1", "in_use": false, "last_use": 0, "state": STATE_SEARCH, "page":1},
                         {"address": "1BZKbSjrzzdUjpuiqGVSW16FdEzU1ktwAh", "in_use": false, "last_use": 0, "state": STATE_SEARCH, "page":1}];

var transactions = []
var search_transactions = []

var indexView = document.getElementById("indexView");
var payView = document.getElementById("payView");
var stateView = document.getElementById("stateView");
var mainView = document.getElementById("mainView");
var current_price = 400.00;
        
function loadIndexView(){
    mainView.innerHTML = indexView.innerHTML;
    update_table();
}

function loadPayView(){
    mainView.innerHTML = payView.innerHTML;
}

function loadStateView(){
    mainView.innerHTML = stateView.innerHTML;
}

function init(){
    loadIndexView();
    setInterval(load_transactions, 2500);
    setInterval(loadCurrentPrice, 2500);
}

function load_transactions(){
    var address = possible_addresses[possible_address_counter]["address"];
    var page = possible_addresses[possible_address_counter]["page"]
    get_transactions(address);
    ++possible_address_counter;
    if(possible_address_counter>=possible_addresses.length){
        possible_address_counter = 0;
    }
}
        
function loadCurrentPrice(){
    var xmlHttp = new XMLHttpRequest();
     xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            onPriceLoaded(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open( "GET", "https://api.pro.coinbase.com/products/BCH-EUR/ticker", true ); // false for synchronous request
    xmlHttp.send( null );
}

function onPriceLoaded(data){
    current_price = parseFloat(data["ask"]);
    updateFooter();
}

function getCurrentPrice(){
    return current_price;
}

function updateFooter(){
    document.getElementById("footer").innerHTML = "BCH-EUR: "+eurFormatter.format(getCurrentPrice());
}

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function get_transactions(address, page=1){
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            on_get_transactions(JSON.parse(xmlHttp.responseText), address);
    }
    xmlHttp.open( "GET", "https://bch-chain.api.btc.com/v3/address/"+address+"/tx?page="+page, true ); // false for synchronous request
    xmlHttp.send( null );
}

function addresses_contains(addresses, address){
    for(var l = 0; l < addresses.length; ++l){
        if(addresses[l]==address){
            return true;
        }
    }
    return false;
}

function get_outputs_contains(outputs, address){
    for(var k = 0; k < outputs.length; ++k){
        var output = outputs[k];
        var addresses = output["addresses"];
                
        if(addresses_contains(addresses, address)){
            return output;
        }
    }
    return null;
}

function addTx(hash, block_height, confirmations, value, address, timestamp, state){
    if(transactions.length==0){
        var newtx = {"height" : block_height, "confirmations" : confirmations, "hash" : hash, "value" : value, "address" : address, "timestamp":timestamp, "state":state};
        transactions.splice(i, 0, newtx);
        return newtx;
    }
    
    for(var i=transactions.length-1; i>0; --i){
        var tx = transactions[i];
        if(hash == tx["hash"] && tx["state"] != STATE_SUCCESS){
            tx["confirmations"] = confirmations;
            if(confirmations>0)
                tx["state"] = STATE_SUCCESS
            return tx;
        }
        
        if(block_height >= tx["height"]){
            var newtx = {"height" : block_height, "confirmations" : confirmations, "hash" : hash, "value" : value, "address" : address, "timestamp":timestamp, "state":state};
            transactions.splice(i, 0, newtx);
            return newtx;
        }
    }
}

function update_Tx(hash, confirmations, base, address, timestamp){    
    for(var i=transactions.length-1; i>=0; --i){
        var tx = transactions[i];
        if(hash == tx["hash"] && tx["state"] != STATE_SUCCESS){
            tx["confirmations"] = confirmations;
            if(confirmations>=MIN_CONFORMATIONS){
                if(base>=tx["base"]){
                    tx["state"] = STATE_SUCCESS;
                }else{
                    tx["state"] = STATE_MISSING_AMOUNT;
                }
                tx["total"] = base;
                return i;
            }
        }
        if(tx["hash"]=="" && tx["state"]==STATE_SEARCH && tx["address"]==address && tx["timestamp"] < timestamp){
            
            tx["hash"]=hash;
            tx["confirmations"] = confirmations;
            tx["timestamp"] = timestamp;
            if(confirmations>=MIN_CONFORMATIONS){
                if(base>=tx["base"]){
                    tx["state"] = STATE_SUCCESS;
                }else{
                    tx["state"] = STATE_MISSING_AMOUNT;
                }
                tx["total"] = base;
            }else{
                tx["state"] = STATE_WAIT
            }
            return i;
        }
    }
    return -1;
}

function on_get_transactions(response, address, timestamp){
    var data = response["data"];
    if(!data)
        return
    var list = data["list"];
    for(var i = 0 ; i < list.length; ++i){
        var tx = list[i];
        var outputs = tx["outputs"];
        var output = get_outputs_contains(outputs, address);
        if(output){
            var hash = tx["hash"];
            var confirmations = tx["confirmations"];
            var height = tx["block_height"];
            var quote = parseFloat(output["value"])/100000000;
            var timestamp = tx["created_at"]
            var cur_i;
            if((cur_i=update_Tx(hash, confirmations, quote, address, timestamp))>=0){
                //console.log("updated")
                update_table();
                if(current_tx_index==cur_i){
                    loadParameter(transactions[cur_i], cur_i);
                }
            }
            else{
                //console.log("not updated")
            }
        }
    }
}

function get_incoming_tx_status(tx){
    
}

function getLatestTxWithAddress(address){
    for(var i = transactions.length-1; i>=0; --i){
        var tx = transactions[i];
        if(tx["address"]==address)
            return tx;
    }
    return null;
}

function getFreeAddress(){
    
    // Search unused address
    for(var i = 0; i < possible_addresses.length; ++i){
        if(!possible_addresses[i]["in_use"]){
            return possible_addresses[i];
        }
    }
    
    // Search finished address
    for(var i = 0; i < possible_addresses.length; ++i){
        if(possible_addresses[i]["state"]==STATE_SUCCESS || possible_addresses[i]["state"]==STATE_TIMEOUT || possible_addresses[i]["state"]==STATE_FAILED){
            return possible_addresses[i];
        }
    }
    
    // Get longest waited address
    var k = 0
    for(var i = 1; i < possible_addresses.length; ++i){
        if(possible_addresses[i]["last_use"] < possible_addresses[k]["last_use"]){
            k = i;
            
        }
    }
    var tx = getLatestTxWithAddress(possible_addresses[k]["address"])
    if(tx)
        tx["state"] = STATE_TIMEOUT;
    return possible_addresses[k];
}

function new_tx(amountQuote){
    var address = getFreeAddress();
    address["in_use"] = true;
    address["last_use"] = Date.now() / 1000;
    address["state"] = STATE_SEARCH;
    var price = getCurrentPrice();
    var base = baseFormatter.format(amountQuote / price);
    var new_tx = {"address": address["address"],"hash": "", "quote":amountQuote, "base":base, "total":0, "price":price, "timestamp":address["last_use"], "state":STATE_SEARCH, "confirmations":0};
    transactions.push(new_tx);
    loadParameter(new_tx, transactions.length-1);
    loadStateView();
    
}























