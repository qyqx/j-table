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
    hide: function(elem, setHide, col) {
        var colDOM;
        if (setHide === undefined) {
            //returns the hidden state (true or false). table.getHide requires cellIndex parameter.
            colDOM = jTable.table(elem).getElementsByTagName("col")[elem.cellIndex === undefined ? col : elem.cellIndex];
            if (colDOM && (colDOM.style.visibility === 'collapse' || colDOM.style.display === 'none')) {
                return true;
            }
            return false;
        } else {
            //sets the hidden state (true or false). table.setHide requires extra cellIndex parameter.
            var currentHide = jTable.hide(elem.getHide(arguments[1]));
            var colgroup = elem.table().getElementsByTagName("colgroup")[0];
            //create the colgroup if it doesn't already exist
            if (!colgroup) {
                colgroup = elem.table().appendChild(document.createElement("colgroup"));
            }
            //create the cols if they don't already exist in the right number
            if (colgroup.getElementsByTagName("col").length !== elem.table().tHead.rows[0].cells.length) {
                for (var i=0; i<colgroup.getElementsByTagName("col").length; i++) {
                    colgroup.removeChild(colgroup.getElementsByTagName("col")[i]);
                }
                for (i=0; i < elem.table().tHead.rows[0].cells.length; i++) {
                    colgroup.appendChild(document.createElement("col"));
                }	
            }
            colDOM = colgroup.getElementsByTagName("col")[arguments[1] || elem.cellIndex];
            try { //Fx, Safari
                if (setHide && !currentHide) {
                    colDOM.style.visibility = 'collapse';
                } 
            } catch(err) {
                colDOM.style.display = 'none';
            }
            if (!setHide && currentHide) {
                if (colDOM.style.display === 'none') {
                    colDOM.style.display = '';
                } else {
                    colDOM.style.visibility = '';
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
