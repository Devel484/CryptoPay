var cur_page = 1;
var STATE_TEXT = ["suche Transaktion", "warte auf Bestätigung", "Transaktion erfolgreich!", "Fehlender Betrag!", "Fehlgeschlagen", "Zeitüberschreitung"];
var TABLE_COLOR = ["table-info", "table-warning", "table-success", "table-danger", "table-danger", "table-secondary"];

function Row(id) {
    this.id = id;
    this.element = document.getElementById("table-row-"+id);
    this.transaction = null;
    this.counter = this.element.childNodes[1];
    this.state = this.element.childNodes[3];
    this.base = this.element.childNodes[5];
    this.quote = this.element.childNodes[7];

    this.setTransaction = function (transaction) {
        this.transaction = transaction;
    };

    this.setCounter = function (counter) {
        this.counter.innerHTML = counter;
    };

    this.setBaseAmount = function (amount) {
        this.base.innerHTML = amount;
    };

    this.setQuoteAmount = function (amount) {
        this.quote.innerHTML = amount;
    };

    this.setState = function (state) {
        this.state.innerHTML = state;
    };

    this.setColor = function (color) {
        if (color === "")
            return;
        this.element.classList.add(color);
    };

    this.removeColors = function () {
        let classList = this.element.classList;
        for (let state in Transaction.STATE){
            let color = Transaction.STATE[state].COLOR;
            classList.remove(color);
        }
        classList.remove("table-light");
        this.element.classList = classList
    };

    this.update = function (id, transaction) {
        this.removeColors();

        this.setTransaction(transaction);

        let state = "";
        let counter = " ";
        let base = "";
        let quote = "";
        let color = "table-light";
        if ( transaction != null ){
            state = transaction.getState().TEXT;
            base = transaction.getAmount();
            quote = transaction.getFiat();
            color = transaction.getState().COLOR;
            counter = id;
        }

        this.setState(state);
        this.setBaseAmount(base);
        this.setQuoteAmount(quote);
        this.setCounter(counter);
        this.setColor(color);
    };
}

function Pager(table) {
    this.next = document.getElementById("page_next");
    this.next.pager = this;
    this.previous = document.getElementById("page_previous");
    this.previous.pager = this;
    this.pageLink = [];
    this.onLoadPage = null;
    this.table = table;
    this.currentPage = 1;

    this.disableElement = function (element) {
        element.classList.add("disabled");
    };

    this.enableElement = function(element){
        element.classList.remove("disabled");
    };

    this.next.onclick = function () {
        if ( this.pager.table.onLoadPage != null)
            this.pager.table.onLoadPage(this.pager.currentPage + 1);
    };

    this.previous.onclick = function () {
        if ( this.pager.table.onLoadPage != null)
            this.pager.table.onLoadPage(this.pager.currentPage - 1);
    };

    this.loadPage = function (element) {
        let d = element.srcElement.innerHTML;
        try{
            d = parseInt(d);
            if ( d === this.pager.currentPage )
                return;

            if ( this.pager.table.onLoadPage == null )
                return;

            this.pager.table.onLoadPage(d);
        }catch (e) {
            console.log(e);
        }
    };

    this.update = function (currentPage, pageSize) {
        this.currentPage = currentPage;

        let maxPages = parseInt(Transaction.all.length / pageSize + 1);

        this.enableElement(this.next);
        this.enableElement(this.previous);
        for (let i = 0; i < this.pageLink.length; ++i)
            this.enableElement(this.pageLink[i]);

        let currentButton = 1;

        if ( this.currentPage === maxPages ){
            this.disableElement(this.next);
            currentButton = 2;
        }

        if ( currentPage === 1 ) {
            this.disableElement(this.previous);
            currentButton = 0;
        }

        for (let i = 0; i < this.pageLink.length ; ++i){
            this.pageLink[i].classList.remove("active");
            let page = this.currentPage - currentButton + i;

            if ( i === currentButton ){
                this.pageLink[i].classList.add("active");
            }
            if ( page > maxPages ){
                this.disableElement(this.pageLink[i]);
                this.pageLink[i].innerHTML = "<a class='page-link'>"+(page)+"</a>";
            }else{
                this.pageLink[i].innerHTML = "<a class='page-link' href='#'>"+(page)+"</a>";
            }
        }

    };

    for ( let i = 1; i <= 3; ++i) {
        let element = document.getElementById("page-link-" + i);
        this.pageLink.push(element);
        element.onclick = this.loadPage;
        element.pager = this;
    }
}


function Table() {
    this.rows = [];
    this.currentPage = 1;
    this.pager = new Pager(this);
    this.pageSize = 4;
    for (let i = 1; i <= this.pageSize; ++i)
        this.rows.push(new Row(i));

    this.update = function () {
        let transactions = Transaction.all;
        for ( let i = 0; i < this.pageSize; ++i){
            let row = this.rows[i];
            let counter = (transactions.length - 1 - i)-(this.currentPage-1)*this.pageSize;
            let transaction = null;
            if (counter >= 0)
                transaction = transactions[i];

            row.update(counter, transaction);
        }

        this.pager.update(this.currentPage, this.pageSize);
    };

    this.onLoadPage = function (page) {
        console.log(page);
        let maxPages = Transaction.all.length / this.pageSize + 1;
        if ( page > 0 && page <= maxPages){
            this.currentPage = page;
            this.update()
        }
    };

}

function update_table(){
    var row = 1;
    let transactions = Transaction.all;
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
            state = tx.getState().TEXT;
            base = tx.getAmount();
            quote = tx.getFiat();
            ele_row.classList.add(tx.getState().COLOR)
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