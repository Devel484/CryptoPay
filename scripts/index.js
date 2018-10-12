var cur_page = 1;
var STATE_TEXT = ["suche Transaktion", "warte auf Bestätigung", "Transaktion erfolgreich!", "Fehlender Betrag!", "Fehlgeschlagen", "Zeitüberschreitung"];
var TABLE_COLOR = ["table-info", "table-warning", "table-success", "table-danger", "table-danger", "table-secondary"];

function update_table(){
    var row = 1;
    for(var row = 1; row <= 4; ++row){
        var i = (transactions.length - row)-((cur_page-1)*4);
        var ele_row = document.getElementById("table-row-"+row);
        var state = "";
        var base = "";
        var quote = "";
        for(var e in TABLE_COLOR)
            ele_row.classList = ele_row.classList.remove(e);
        if(i >= 0 && i < transactions.length){
            var tx = transactions[i];
            state = STATE_TEXT[tx["state"]];
            base = tx["base"];
            quote = tx["quote"];
            ele_row.classList.add(TABLE_COLOR[tx["state"]])
        }else{
            ele_row.classList.add("table-light")
        }
        var child_ele_row = ele_row.childNodes;
        if(i >= 0)
            child_ele_row[1].innerHTML = i+1;
        else
            child_ele_row[1].innerHTML = 0;
        child_ele_row[3].innerHTML = state;
        child_ele_row[5].innerHTML = base;
        child_ele_row[7].innerHTML = quote
    }
    
    var e = document.getElementById("page_next");
    e.classList.remove("disabled");
    e.innerHTML = "<a class='page-link' href='#'>Next</a>";
    if(transactions.length <= cur_page*4){
        e.classList.add("disabled")
        e.innerHTML = "<a class='page-link'>Next</a>";
    }
    
    e = document.getElementById("page_previous");
    e.classList.remove("disabled");
    e.innerHTML = "<a class='page-link' href='#'>Previous</a>";
    if(cur_page==1){
        e.classList.add("disabled")
        e.innerHTML = "<a class='page-link'>Previous</a>";
    }
    
    var page_link_1 = document.getElementById("page-link-1");
    var page_link_2 = document.getElementById("page-link-2");
    var page_link_3 = document.getElementById("page-link-3");
    if(cur_page==1){
        page_link_1.innerHTML = "<span class='page-link'>1<span class='sr-only'>(current)</span></span>"
        
        page_link_2.classList.remove("disabled");
        if((cur_page*4)<=transactions.length){
            page_link_2.innerHTML = "<a class='page-link' href='#'>"+(cur_page+1)+"</a>";
        }else{
            page_link_2.innerHTML = "<a class='page-link'>"+(cur_page+1)+"</a>";
            page_link_2.classList.add("disabled");
        }
        
        page_link_3.classList.remove("disabled");
        if(((cur_page+1)*4)<=transactions.length){
            page_link_3.innerHTML = "<a class='page-link' href='#'>"+(cur_page+2)+"</a>";
        }else{
            page_link_3.innerHTML = "<a class='page-link'>"+(cur_page+2)+"</a>";
            page_link_3.classList.add("disabled");
        }
    }
    
    if(cur_page==1){
        page_link_1.classList.remove("active");
        page_link_1.classList.add("active");
        page_link_1.innerHTML = "<span class='page-link'>1<span class='sr-only'>(current)</span></span>";
        
        page_link_2.classList.remove("disabled");
        page_link_2.classList.remove("active");
        if((cur_page*4)<transactions.length){
            page_link_2.innerHTML = "<a class='page-link' href='#'>"+(cur_page+1)+"</a>";
        }else{
            page_link_2.innerHTML = "<a class='page-link'>"+(cur_page+1)+"</a>";
            page_link_2.classList.add("disabled");
        }
        
        page_link_3.classList.remove("disabled");
        if(((cur_page+1)*4)<transactions.length){
            page_link_3.innerHTML = "<a class='page-link' href='#'>"+(cur_page+2)+"</a>";
        }else{
            page_link_3.innerHTML = "<a class='page-link'>"+(cur_page+2)+"</a>";
            page_link_3.classList.add("disabled");
        }
    }else{
        page_link_1.classList.remove("active");
        page_link_1.innerHTML = "<a class='page-link' href='#'>"+(cur_page-1)+"</a>";
        page_link_2.classList.remove("active");
        page_link_2.classList.add("active");
        page_link_2.innerHTML = "<span class='page-link'>"+cur_page+"<span class='sr-only'>(current)</span></span>";
        page_link_3.classList.remove("disabled");
        if((cur_page*4)<transactions.length){
            page_link_3.innerHTML = "<a class='page-link' href='#'>"+(cur_page+1)+"</a>";
        }else{
            page_link_3.innerHTML = "<a class='page-link'>"+(cur_page+1)+"</a>";
            page_link_3.classList.add("disabled");
        }
    }
}

function previousPage(){
    if(cur_page==1)
        return;
    --cur_page;
    update_table();
} 

function nextPage(){
    if((cur_page*4)>=transactions.length)
        return;
    ++cur_page;
    update_table();
    
}

function openPage(element){
    if(element.classList.contains("disabled") || element.classList.contains("active"))
        return;
    
    cur_page = parseInt(element.childNodes[0].innerHTML);
    update_table();
}

function load_state_from_table(element){
    var index = element.childNodes[1].innerHTML-1;
    if(index >= 0){
        loadParameter(transactions[index], index);
        loadStateView();
    }
    
}