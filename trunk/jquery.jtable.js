//TODO: WRAP in (function() {}) () as per http://docs.jquery.com/Plugins/Authoring
var jTable = {
    cell: function(elem, row, col) {
        //returns the <td> at the relevant row and column
        if (elem.tagName.toLowerCase() === "td") {
            return elem;
        } else {
            return jTable.table(elem).tBodies[0].rows[row] && 
              jTable.table(elem).tBodies[0].rows[row].cells[col || elem.cellIndex];
        }
    },
    data: function(elem, row, col) {
        //returns the text contents of cell(elem)
        var cellDOM = jTable.cell(elem, row, col);
        if (!cellDOM) {
            return undefined;
        }
        return cellDOM.textContent ? cellDOM.textContent : cellDOM.innerText;
    },
    headerCell: function(elem, row) {
        //returns the <th> element at the top of the relevant column
        switch (elem.tagName.toLowerCase()) {
        case "td":
            return jTable.table(elem).tHead.rows[0].cells[elem.cellIndex];
            break;
        case "th":
            return elem;
            break;
        case "table":
            return elem.tHead.rows[0].cells[row];
            break;
        }        
    },
    headerData: function(elem, row) {
        //returns the data in the <td> element at the top of the relevant column
        var cellDOM = jTable.headerCell(elem, row);
        if (!cellDOM) {
            return undefined;
        }
        return cellDOM.textContent ? cellDOM.textContent : cellDOM.innerText;
    },
    table: function(elem) {
        //returns node's container <table> element
        var parent = elem;
        while (parent.tagName.toLowerCase() !== 'table') {
            parent = parent.parentNode;
        }
        return parent;
    } 
}
jQuery.each(jTable, function(i) {
    var that = this;
    var node;
    var answer;
    var temp;
    jQuery.fn[i] = function() {
        var jTableArgs = arguments;
        answer = [];
        this.each(function() {
            //"this" is now a matching DOM node, clean up to <td>, <th>, <table>, or "do nothing"
            var node = this;
            while (!/^body|table|th|td$/.test(node.tagName.toLowerCase())) {
                node = node.parentNode;
            }
            if (node.tagName.toLowerCase() === 'body') {
                return false;
            }
            //sort is an exception because we *want* nodelist.sort() to do multiple sort
            temp = that(node, jTableArgs[0], jTableArgs[1]);
            if (temp) {
                answer.push(temp);
            }
        });
        if (answer.length === 0) {
            return undefined;
        }
        if (/^function|object$/.test(typeof answer[0])) {
            return jQuery(answer);
        } else {
            return answer;
        }
    };
});
