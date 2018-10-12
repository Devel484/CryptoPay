var eurFormatter = new Intl.NumberFormat('de-DE',{ style: 'currency', currency: 'EUR',minimumFractionDigits: 2 });
var baseFormatter = new Intl.NumberFormat('en-EN',{ minimumFractionDigits: 8 });
var qrcode = new QRCode("qrcode");
        
var receiverAddress = "1Ef5dX93jhbDMcDD6xwvUuTNRBUmrdSHzi";
var STATE_PROGRESS_WIDTH = [33, 66, 100, 75, 100, 100];
var STATE_PROGRESS_COLOR = ["bg-warning", "bg-warning", "bg-success", "bg-danger", "bg-danger", "bg-danger"];
var STATE_PROGRESS_ANIMATE = ["progress-bar-animated", "progress-bar-animated", "", "progress-bar-animated", "", ""];
        
var amountQuote = null;
var amountBase = null;
var price = null;
var state = null;
var hash = null;
var current_tx_index = -1;

qrcode.makeCode("TEST");
        
function loadParameter(tx, index){
    current_tx_index = index;
    console.log(tx);
    amountQuote = tx["quote"];
    amountBase = tx["base"];
    price = tx["price"];
    state = tx["state"];
    receiverAddress = tx["address"]
    
    setBaseAmount(amountBase);
    setQuoteAmount(parseFloat(amountQuote));
    setPrice(price);

    if(state!=STATE_SEARCH && state!=STATE_FAILED){
        hash = tx["hash"]
        setTXHash(hash);
    }
    setState(state);

    setReceiverAddress(receiverAddress);
    
    setInfoText(state);

    qrcode.makeCode("bitcoincash:"+receiverAddress+"?amount="+amountBase);
}
        
function setState(state){
    document.getElementById("stateText").innerHTML = STATE_TEXT[state];
    document.getElementById("progressBar").style.width = STATE_PROGRESS_WIDTH[state]+"%";
    document.getElementById("progressBar").classList.remove("bg-danger");
    document.getElementById("progressBar").classList.remove("bg-success");
    document.getElementById("progressBar").classList.remove("bg-warning");
    document.getElementById("progressBar").classList.remove("progress-bar-animated");

    document.getElementById("progressBar").classList.add(STATE_PROGRESS_COLOR[state]);

    if (STATE_PROGRESS_ANIMATE[state]!="")
        document.getElementById("progressBar").classList.add(STATE_PROGRESS_ANIMATE[state]);           
}
        
function setReceiverAddress(address){
    document.getElementById("receiverAddress").innerHTML = address;
}
        
function setTXHash(hash){
    document.getElementById("hash").innerHTML = hash;
}
        
function setQuoteAmount(amount){
    amountQuote = eurFormatter.format(amount);
    document.getElementById("amountQuote").innerHTML = amountQuote;
}
        
function setBaseAmount(amount){
    amountBase = baseFormatter.format(amount);
    document.getElementById("amountBase").innerHTML = amountBase;
}
        
function setPrice(price){
    document.getElementById("price").innerHTML = eurFormatter.format(price);
}

function setInfoText(state){
    document.getElementById("infoText").innerHTML = STATE_INFO[state];
}
