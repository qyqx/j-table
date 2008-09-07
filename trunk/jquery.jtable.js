//TODO: WRAP in (function() {}) () as per http://docs.jquery.com/Plugins/Authoring
jQuery.tableDataTypes = {
    number: {
        re: /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i, 
        swap: function(a,b) {
            return Number(a) > Number(b);
        }
    },
    currency: {
        re: /^-?\d+(?:\.\d*)?$/i,
        swap: function(a,b) {
            return Number(a) > Number(b);
        }
    },
    date: {
        js: function(x) {
            var scratch = new Date(x); 
            return scratch.toString() !== 'NaN' && scratch.toString() !== 'Invalid Date';
        },
        swap: function(a,b) {
            return Date.parse(a) > Date.parse(b);
        }
    },
    string: {
        swap: function(a,b) {
            return a > b;
        }
    }
};
var jTable = {
    tableCell: function(elem, row, col) {
        //returns the <td> at the relevant row and column
        if (elem.parentNode.parentNode.tagName.toLowerCase() === "tbody") {
            return elem;
        } else {
            return jTable.table(elem).tBodies[0].rows[row] && 
              jTable.table(elem).tBodies[0].rows[row].cells[col === undefined ? elem.cellIndex : col];
        }
    },
    tableData: function(elem, row, col) {
        //returns the text contents of cell(elem)
        var cellDOM = jTable.tableCell(elem, row, col);
        if (!cellDOM) {
            return undefined;
        }
        return cellDOM.textContent ? cellDOM.textContent : cellDOM.innerText;
    },
    tableHeaderCell: function(elem, col) {
        //returns the <th> element at the top of the relevant column
        if (elem.tagName.toLowerCase() === 'table') {
            return elem.tHead.rows[0].cells[col];
        }        
        if (elem.parentNode.parentNode.tagName.toLowerCase() === "tbody") {
            return jTable.table(elem).tHead.rows[0].cells[elem.cellIndex];
        }
        return elem;
    },
    tableHeaderData: function(elem, row) {
        //returns the data in the <td> element at the top of the relevant column
        var cellDOM = jTable.tableHeaderCell(elem, row);
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
    },
    tableDataType: function(elem, col) {
        //returns the elem's headerCell dataType. table.dataType requires cellIndex parameter
        var headerCell = jTable.tableHeaderCell(elem, col);
        if (headerCell.getAttribute("data-datatype")) {
            return headerCell.getAttribute("data-datatype");
        } else {
            answer = jTable.tableCalculateDataType(headerCell);
            headerCell.setAttribute("data-datatype", answer);
            return answer;
        }
    },
    tableCalculateDataType: function(elem, col) {
  	//check data type of first entry. then check if all others consistent, if not then string.
	var headerCell = jTable.tableHeaderCell(elem);
	var i = 0;
	var dataType, dataType_old;
	calcCellDataType = function(data) {
	    var answer = "string";
	    for (var j in jQuery.tableDataTypes) if (j !== 'string') {
	        if ((!jQuery.tableDataTypes[j].re || jQuery.tableDataTypes[j].re.test(data)) && (!jQuery.tableDataTypes[j].js || jQuery.tableDataTypes[j].js(data))) {
	            answer = j;
	            break;
	        }
	    }
	    return answer;	    
	}
	if (elem.tagName.toLowerCase() === 'td') {
	    return calcCellDataType(jTable.tableData(elem));
	}
	while (jTable.tableCell(headerCell, i)) {
	    dataType = calcCellDataType(jTable.tableData(headerCell, i));
	    if (i === 0) {
	        dataType_old = dataType;
	    }
	    if (dataType === "string") {
	        break;
	    }
	    if (dataType !== dataType_old) {
	        dataType = "string";
	        break;
	    }
	    dataType_old = dataType;
	    i++;
	}	
	return dataType;
    },
    tableHide: function(elem) {
        //gets / sets hide for a column. tables require extra cellIndex parameter
        var setHide = elem.tagName.toLowerCase() === 'table' ? arguments[2] : arguments[1];
        var colHead = jTable.tableHeaderCell(elem, arguments[1]);
        if (setHide === undefined) {
            //it's a GET: return the boolean hidden state
            return colHead.style.display === "none";
        } else {
            //it's a SET.
            var currentHide = colHead.style.display === "none";
            var cellIndex1based = colHead.cellIndex + 1;
            var table = jTable.table(elem); 
            if (setHide && !currentHide) {
                $(table).find("tr *:nth-child(" + cellIndex1based + ")").css("display", "none");
            } 
            if (!setHide && currentHide) {
                $(table).find("tr *:nth-child(" + cellIndex1based + ")").css("display", "");
            }
            return elem;
        }
    },
    tableFilter: function(elem) {
        var setFilter = elem.tagName.toLowerCase() === 'table' ? arguments[2] : arguments[1];
        var colHead = jTable.tableHeaderCell(elem, arguments[1]);
        var table = jTable.table(elem); 
        if (setFilter === undefined) {
           //it's a GET: returns the relevant header filter regexp.
            var isRegExp = /^\/(.+)\/$/.exec(colHead.getAttribute("data-filter"));
            if (isRegExp) {
                return new RegExp(isRegExp[1]);
            } else {
                return false;
            }
        } else {
            //it's a SET. sets the filter regexp for the relevant header, pass false to remove it
            if (setFilter === false) {
                colHead.removeAttribute("data-filter");
            }
            else {
                colHead.setAttribute("data-filter", setFilter);
            }
	    //build the filters array, [{cellIndex: n, filter: /filterme/},...]
	    var col = 0;
	    var filters = [];
	    var headerCell;
	    while (true) {
	        headerCell = jTable.tableHeaderCell(table, col);
	        if (!headerCell) {
	            break;
	        }
	        if (headerCell.getAttribute("data-filter")) {
	            filters.push({cellIndex: col, filter: jTable.tableFilter(headerCell)});
	        }
	        col++;
	    }
	    //iterate through each row, put filter in then remove if necessary
	    var rows = table.tBodies[0].rows;
	    var rowpass;
	    for (var irow=0; irow < rows.length; irow++) {
	        rowpass = true;
	        for (var j=0; j < filters.length; j++) {
	        //if any of the filters doesn't match, then mark the row as filtered
	            if (!filters[j].filter.test(jTable.tableData(table, irow, filters[j].cellIndex))) {
	                rowpass = false;
	                break;
	            }
	        }
	        if (rowpass) {
	            $(rows[irow]).removeClass("filtered");
	        }
	        else if (!$(rows[irow]).hasClass("filtered")) {
	            $(rows[irow]).addClass("filtered");
	        }
   	    }
            return elem;
        }
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
            if (temp !== undefined) {
                answer.push(temp);
            }
        });
        if (answer.length === 0) {
            return undefined;
        }
        if (answer[0].style) { //crude test: is it a DOM object
            return jQuery(answer);
        } else {
            return answer;
        }
    };
});
