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
        if (elem.parentNode !== undefined && elem.parentNode.parentNode.tagName.toLowerCase() === "tbody") {
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
        while (parent && parent.tagName.toLowerCase() !== 'table') {
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
    },
    tableSort: function (elem, setSort) {
        var tbl = jTable.table(elem);
        if (setSort === undefined) {
            //GET SORT. for columns returns "up", "down" or undefined
            //for tables returns array [{cellIndex:n, dir: 'up'}, ...]
            var aSort = [], hSort;
            if (elem.tagName.toLowerCase() === 'th' || elem.tagName.toLowerCase() === 'td') {
                return jTable.tableHeaderCell(elem).getAttribute("data-sort");
            } else {
                if (tbl.getAttribute("data-sortOrder")) {
                    hSort = tbl.getAttribute("data-sortOrder").split(",");
                    for (var i=0; i<hSort.length; i++) {
                        aSort.push({cellIndex: hSort[i], dir: jTable.tableSort(jTable.tableHeaderCell(elem, hSort[i]))});
                    }
                }
                return aSort;
            }
        } else {
            //SET SORT
            var i;
            if (elem.tagName.toLowerCase() === 'th' || elem.tagName.toLowerCase() === 'td') {
                if (setSort !== "up" && setSort !== "down" && setSort !== "") {
                    throw new TypeError("setSort should be 'up', 'down', or ''");
                }
                if (setSort) {
                    setSort = [{cellIndex: elem.cellIndex, dir: setSort}];
                } else {
                    setSort = [];
                }
            }
            if (typeof setSort !== "object" || setSort.constructor !== Array) {
                throw new TypeError("setSort() expects an array parameter");
            }
            for (i=0; i<setSort.length; i++) {
                if (setSort[i].cellIndex === undefined || setSort[i].dir === undefined) {
                    throw new TypeError("setSort() expects cellIndex and dir for array item " + i);
                }
            }
    	    //this is a comb sort. O(n log n), but O(n) if already sorted
	    //for now, just sort using first item in sort array
	    var currentSort = jTable.tableSort(tbl);
	    var rows = tbl.tBodies[0].rows;
	    //update sort attributes
	    i = 0;
	    while (jTable.tableHeaderCell(tbl, i)) {
	        jTable.tableHeaderCell(tbl, i).removeAttribute("data-sort");
	        i++;
	    }
	    var sortOrder = [];
	    for (i=0; i < setSort.length; i++)  {
	        jTable.tableHeaderCell(tbl, setSort[i].cellIndex).setAttribute("data-sort", setSort[i].dir);
	        sortOrder.push(setSort[i].cellIndex);
	    }
	    tbl.setAttribute("data-sortOrder", sortOrder.join(","));
	    if (setSort.length === 0) {
	        return tbl;
	    }
	    //if it's already sorted the opposite way, just reflect it
	    if (currentSort.length === 1 && setSort.length === 1 && currentSort[0].cellIndex === setSort[0].cellIndex &&
	      currentSort[0].dir !== setSort[0].dir) {
	        for (i=rows.length - 1; i>=0; i--) {
	            rows[0].parentNode.appendChild(rows[0].parentNode.removeChild(rows[i]));
	        }	  
	    } else {
	    //TODO: SURELY WE CAN JUST USE rows.sort(cleverfunction())?
	    //use comb sort O(n log n)
	        var gap = rows.length;
	        var swapped = true;
	        var swapResult;
	        var a, b;
	        while (gap > 1 || swapped) {
	       //update the gap value for a next comb
	            if (gap > 1) {
	                gap = Math.floor (gap / 1.3);
	                if (gap === 10 || gap === 9) {
	                    gap = 11;
	                }
	            }
	            swapped = false;
	            //a single "comb" over the input list
	            for (i=0; i + gap < rows.length; i++) for (var j=0; j<setSort.length; j++) {
	                a = jTable.tableData(tbl, i, setSort[j].cellIndex);
	                b = jTable.tableData(tbl, i + gap, setSort[j].cellIndex);
	                if (a !== b) {
	                    if (jQuery.tableDataTypes[jTable.tableDataType(tbl, setSort[j].cellIndex)].swap(a,b) ? setSort[j].dir === 'up' : setSort[j].dir === 'down') {
	                        var tempRowiPlusGap = rows[i].parentNode.replaceChild(rows[i], rows[i+gap]);
	   	                rows[i].parentNode.insertBefore(tempRowiPlusGap, rows[i]);
		     	        swapped = true;
	                    } 
	                    break;
	                }
	            }
	        }
	    }
	    return elem;
        }
    },
    tableCellEditMode: function(elem, mode) {
        if (elem.tagName.toLowerCase() === 'table') {
            return undefined;
        }
        if (mode === undefined) {
            //GET editmodel. returns boolean depending on contenteditable state
            var divs = elem.getElementsByTagName("div");
            for (var i=0; i < divs.length; i++) if (divs[i].contentEditable) {
                return true;
            }
            return false;        
        } else {
            //sets the cell to contenteditable or not
            var currentMode = jTable.tableCellEditMode(elem);
            var div;
            if (mode && !currentMode) {
                div = document.createElement("div");
                div.contentEditable = true;
                while (elem.hasChildNodes()) {
                    div.appendChild(elem.removeChild(elem.childNodes[0]));
                }
                elem.appendChild(div);
                div.focus();
                //warning: this could create duplicates
                if (elem.id) {
	            elem.setAttribute("old_id", elem.id);
	        }
                elem.id = "editCell";
            } 
            if (!mode && currentMode) {
                //find the child div with contentEditable==true
                for (var i=0; i < elem.childNodes.length; i++) {
                    if (elem.childNodes[i].nodeType === 1 && elem.childNodes[i].nodeName.toLowerCase() === 'div' && elem.childNodes[i].contentEditable) {
                        div = elem.childNodes[i];
                        break;
                    }            
                }
                div.removeAttribute("contentEditable");
                while (div.hasChildNodes()) {
                    elem.appendChild(div.removeChild(div.childNodes[0]));
                }
                elem.removeChild(div);
                if (elem.getAttribute("old_id")) {
                    elem.id = elem.getAttribute("old_id");
                    elem.removeAttribute("old_id");
                } else {
                    elem.removeAttribute("id");
                }
                //re-calculate the dataType. should only need to do this if incompatible.
                var head = jTable.tableHeaderCell(elem);
                head.setAttribute("data-datatype", jTable.tableCalculateDataType(head));
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
