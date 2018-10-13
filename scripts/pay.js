var allowDot = true;
        
function getInputField(){
    return document.getElementById("amount");
}
        
function clearAmount(element){
    getInputField().value = "";
    allowDot = true
}

function addDigit(element){
    var inputField = getInputField();
    var text = inputField.value;
    var add = element.innerHTML;
    if(text.length == 0 && add == ".")
        return
                
    if(add == "."){
        if(!allowDot){
            return;
        }
        allowDot = false;
    }
            
    if(!allowDot){
        var splitted = text.split(".")
        if(splitted.length == 2 && splitted[1].length==2){
            return;
        }
    }
    inputField.value += add;
}
        
function deleteDigit(){
    var inputField = getInputField();
    var text = inputField.value;
    if(text.length == 0){
        return;
    }
    var deleted = text.substring(text.length-1, text.length);
    text = text.substring(0, text.length-1);
    inputField.value = text;
    if(deleted == "."){
        allowDot = true;
    }
}

function payAmount(){
    var inputField = getInputField();
    var text = inputField.value;
    if(text.length == 0){
        return;
    }
    var last = text.substring(text.length-1, text.length);
    if(last=="."){
        deleteDigit();
    }
    allowDot = true;
    amount = inputField.value;
    inputField.value = "";
    new_tx(amount);
}