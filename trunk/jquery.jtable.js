//TODO: WRAP in (function() {}) () as per http://docs.jquery.com/Plugins/Authoring
var jTable = {
    dataTypes: {
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
    },    
    cell: function(elem, row, col) {
        //returns the <td> at the relevant row and column
        if (elem.parentNode.parentNode.tagName.toLowerCase() === "tbody") {
            return elem;
        } else {
            return jTable.table(elem).tBodies[0].rows[row] && 
              jTable.table(elem).tBodies[0].rows[row].cells[col === undefined ? elem.cellIndex : col];
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
    headerCell: function(elem, col) {
        //returns the <th> element at the top of the relevant column
        if (elem.tagName.toLowerCase() === 'table') {
            return elem.tHead.rows[0].cells[col];
        }        
        if (elem.parentNode.parentNode.tagName.toLowerCase() === "tbody") {
            return jTable.table(elem).tHead.rows[0].cells[elem.cellIndex];
        }
        return elem;
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
    },
    dataType: function(elem, col) {
        //returns the elem's headerCell dataType. table.dataType requires cellIndex parameter
        var headerCell = jTable.headerCell(elem, col);
        if (headerCell.getAttribute("data-datatype")) {
            return headerCell.getAttribute("data-datatype");
        } else {
            answer = jTable.calculateDataType(headerCell);
            headerCell.setAttribute("data-datatype", answer);
            return answer;
        }
    },
    calculateDataType: function(elem, col) {
  	//check data type of first entry. then check if all others consistent, if not then string.
	var headerCell = jTable.headerCell(elem);
	var i = 0;
	var dataType, dataType_old;
	calcCellDataType = function(data) {
	    var answer = "string";
	    for (var j in jTable.dataTypes) if (jTable.dataTypes.hasOwnProperty(j) && j !== 'string') {
	        if ((!jTable.dataTypes[j].re || jTable.dataTypes[j].re.test(data)) && (!jTable.dataTypes[j].js || jTable.dataTypes[j].js(data))) {
	            answer = j;
	            break;
	        }
	    }
	    return answer;	    
	}
	if (elem.tagName.toLowerCase() === 'td') {
	    return calcCellDataType(elem.data());
	}
	while (jTable.cell(headerCell, i)) {
	    dataType = calcCellDataType(jTable.data(headerCell, i));
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
    hide: function(elem) {
        //gets / sets hide for a column. tables require extra cellIndex parameter
        var setHide = elem.tagName.toLowerCase() === 'table' ? arguments[2] : arguments[1];
        var colHead = jTable.headerCell(elem, arguments[1]);
        var cellIndex1based = colHead.cellIndex + 1;
        var table = jTable.table(elem); 
        if (setHide === undefined) {
            //it's a GET: return the boolean hidden state
            return colHead && $(colHead).hasClass("hide");
        } else {
            //it's a SET.
            var currentHide = colHead && $(colHead).hasClass("hide");
            if (setHide && !currentHide) {
                $(table).find("tr *:nth-child(" + cellIndex1based + ")").addClass("hide");
            } 
            if (!setHide && currentHide) {
                $(table).find("tr *:nth-child(" + cellIndex1based + ")").removeClass("hide");
            }
            return elem;
        }
    },
    filter: function(elem) {
        var setFilter = elem.tagName.toLowerCase() === 'table' ? arguments[2] : arguments[1];
        var colHead = jTable.headerCell(elem, arguments[1]);
        var table = jTable.table(elem); 
        if (setFilter === undefined) {
           //it's a GET: returns the relevant header filter regexp.
            var isRegExp = /^\/(.+)\/$/.exec(colHead.getAttribute("data-filter"));
            if (isRegExp) {
                return new RegExp(isRegExp[1]);
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
	        headerCell = jTable.headerCell(table, col);
	        if (!headerCell) {
	            break;
	        }
	        if (headerCell.getAttribute("data-filter")) {
	            filters.push({cellIndex: col, filter: jTable.filter(headerCell)});
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
	            if (!filters[j].filter.test(elem.table().data(irow, filters[j].cellIndex))) {
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
        if (/^function|object$/.test(typeof answer[0])) {
            return jQuery(answer);
        } else {
            return answer;
        }
    };
});
