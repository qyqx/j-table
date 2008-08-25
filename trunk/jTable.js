var jt = function (elem) {
    // resolve elem to a <table>, <th> or <td>, otherwise return undefined
    elem = ((typeof elem) === "string") ? document.getElementById(elem) : elem;
    if (!elem) {
        return undefined;
    } 
    var i, j;
    while (!/^body|table|th|td$/.test(elem.tagName.toLowerCase())) {
        elem = elem.parentNode;
    }
    if (elem.tagName.toLowerCase() === 'body') {
        return undefined;
    }
    //shared functions
    elem.cell = function() {
        //returns the jt'd <td> element
        switch (elem.tagName.toLowerCase()) {
        case "td":
            return elem;
            break;
        case "th":
            return elem.table().tBodies[0].rows[arguments[0]] && 
              jt(elem.table().tBodies[0].rows[arguments[0]].cells[elem.cellIndex]);
            break;
        case "table":
            return elem.tBodies[0].rows[arguments[0]] && 
              jt(elem.tBodies[0].rows[arguments[0]].cells[arguments[1]]);
            break;
        }
    }
    elem.data = function() {
        //returns the value in the relevant table cell
        var cell = elem.cell(arguments[0], arguments[1]);
        if (!cell) {
            return undefined;
        }
        return cell.textContent ? cell.textContent : cell.innerText;
    }
    elem.headerCell = function() {
        //returns the jt'd <th> element at the top of the relevant column
        switch (elem.tagName.toLowerCase()) {
        case "td":
            return jt(elem.table().tHead.rows[0].cells[elem.cellIndex]);
            break;
        case "th":
            return elem;
            break;
        case "table":
            return jt(elem.tHead.rows[0].cells[arguments[0]]);
            break;
        }        
    };    
    elem.headerData = function() {
        //returns the data in the <td> element at the top of the relevant column
        var cell = elem.headerCell(arguments[0]);
        if (!cell) {
            return undefined;
        }
        return cell.textContent ? cell.textContent : cell.innerText;
    };
    elem.table = function() {
        //returns elem's container <table> element
        if (elem.tagName.toLowerCase() === 'table') {
            return elem;
        }
        var parent = elem;
        while (parent.tagName.toLowerCase() !== 'table') {
            parent = parent.parentNode;
        }
        return jt(parent);
    };
    elem.dataType = function() {
        //returns the elem's headerCell dataType. table.dataType requires cellIndex parameter
        var headerCell = elem.headerCell(arguments[0]);
        if (headerCell.getAttribute("data-datatype")) {
            return headerCell.getAttribute("data-datatype");
        } else {
            answer = headerCell.calculateDataType();
            headerCell.setAttribute("data-datatype", answer);
            return answer;
        }
    };  
    elem.addColumn = function(dir) {
        //adds col to the left if dir===false, right if dir===true. table.addColumn has extra cellIndex argument
        if (typeof dir !== 'boolean') {
            throw new TypeError("must pass boolean to jt().addColumn");
        }
        var th = document.createElement("th");
        var td = document.createElement("td");
        var headerCell = elem.headerCell(arguments[1]);
        var dataCell;
        var i = 0;
        while (true) {
            dataCell = headerCell.cell(i);
            if (!dataCell) {
                break;
            }
            dataCell.parentNode.insertBefore(td.cloneNode(false), dir ? dataCell.nextSibling : dataCell);
            i++;
        }
        headerCell.parentNode.insertBefore(th, dir ? headerCell.nextSibling : headerCell);
        return elem;
    };
    elem.deleteColumn = function() {
        //deletes the relevant column. table.deleteColumn has cellIndex argument
        var headerCell = elem.headerCell(arguments[0]);
        var i = 0;
        while (headerCell.cell(i)) {
            headerCell.cell(i).parentNode.removeChild(headerCell.cell(i));
            i++;
        }
        return headerCell.parentNode.removeChild(headerCell);
    };
    if (/^td|th$/.test(elem.tagName.toLowerCase())) {
        elem.setEditMode = function(ed) {
            //sets the cell to contenteditable or not
            var currentEd = elem.getEditMode();
            var div;
            if (ed && !currentEd) {
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
            if (!ed && currentEd) {
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
                var head = elem.headerCell();
                head.setAttribute("data-datatype", head.calculateDataType());
            }
            return elem;
        };
        elem.getEditMode = function() {
            //returns boolean depending on contenteditable state
            var divs = elem.getElementsByTagName("div");
            for (var i=0; i < divs.length; i++) if (divs[i].contentEditable) {
                return true;
            }
            return false;
        };
        elem.calculateDataType = function() {
  	    //check data type of first entry. then check if all others consistent, if not then string.
	    var headerCell = elem.headerCell();
	    var i = 0;
	    var dataType, dataType_old;
	    calcCellDataType = function(data) {
	        var answer = "string";
	        for (var j in jTable.dataTypes) if (jTable.dataTypes.hasOwnProperty(j) && j !== 'string') {
	            if ((!jTable.dataTypes[j].re || jTable.dataTypes[j].re.test(data)) &&
                     (!jTable.dataTypes[j].js || jTable.dataTypes[j].js(data))) {
	                answer = j;
	                break;
	            }
	        }
	        return answer;	    
	    }
	    if (elem.tagName.toLowerCase() === 'td') {
	        return calcCellDataType(elem.data());
	    }
	    while (headerCell.cell(i)) {
	        dataType = calcCellDataType(headerCell.data(i));
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
        };
    }
    if (/^th|table$/.test(elem.tagName.toLowerCase())) {
        elem.getHide = function() {
            //returns the hidden state (true or false). table.getHide requires cellIndex parameter.
            var answer = false;
            var col = elem.table().getElementsByTagName("col")[elem.cellIndex || arguments[0]];
            if (col && (col.style.visibility === 'collapse' || col.style.display === 'none')) {
                answer = true;
            }
            return answer;        
        };
        elem.setHide = function(hide) {
            //sets the hidden state (true or false). table.setHide requires extra cellIndex parameter.
    	    var currentHide = elem.getHide(arguments[1]);
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
	    var col = colgroup.getElementsByTagName("col")[arguments[1] || elem.cellIndex];
	    try { //Fx, Safari
	        if (hide && !currentHide) {
	            col.style.visibility = 'collapse';
	        } 
	    } catch(err) {
	        col.style.display = 'none';
	    }
	    if (!hide && currentHide) {
	        if (col.style.display === 'none') {
	            col.style.display = '';
	        } else {
	            col.style.visibility = '';
	        }
	    }
	    return elem;
        };
        elem.getFilter = function() {
            //returns the filter regexp for the relevant header. table.getFilter requires cellIndex parameter
            var isRegExp = /^\/(.+)\/$/.exec(elem.headerCell(arguments[0]).getAttribute("data-filter"));
            if (isRegExp) {
                return new RegExp(isRegExp[1]);
            }
        };
        elem.setFilter = function(f) {
            //sets the filter regexp for the relevant header, pass undefined to remove it
            //table.setFilter requires extra cellIndex parameter
            var header = elem.headerCell(arguments[1]);
            if (f) {
                header.setAttribute("data-filter", f);
            }
            else {
                header.removeAttribute("data-filter");
            }
	    //build the filters array, [{cellIndex: n, filter: /filterme/},...]
	    var col = 0;
	    var filters = [];
	    var headerCell;
	    while (true) {
	        headerCell = elem.table().headerCell(col);
	        if (!headerCell) {
	            break;
	        }
	        if (headerCell.getAttribute("data-filter")) {
	            filters.push({cellIndex: col, filter: headerCell.getFilter()});
	        }
	        col++;
	    }
	    //iterate through each row, put filter in then remove if necessary
	    var rows = elem.table().tBodies[0].rows;
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
	            rows[irow].className = rows[irow].className.replace(/filtered/g, "");
	        }
	        else if (rows[irow].className.search(" filtered") === -1) {
	            rows[irow].className += " filtered";
	        }
   	    }
            return elem;
        };
    }
    return elem;
};
var jTable = {};
jTable.t = function(tDom) {
    //first, create a table object, raising a TypeError if appropriate
    var tbl = ((typeof tDom) === "string") ? document.getElementById(tDom) : tDom;
    if (tbl === undefined) {
        return undefined;
    }
    while (tbl.tagName.toLowerCase() !== 'table' && tbl.tagName.toLowerCase() !== 'body') {
        tbl = tbl.parentNode;
    }
    if (tbl.tagName.toLowerCase() === 'body') {
        return undefined;
    }
    var i,j;
    //then, add utility methods to tbl
    tbl.headerCell = function(i) {
        return jTable.h(tbl.tHead.rows[0].cells[i]);
    };
    tbl.headData = function(col) {
        var hCell = tbl.headerCell(col);
        return hCell.textContent ? hCell.textContent : hCell.innerText;
    };
    tbl.data = function(row, col) {
        var cell = tbl.tBodies[0].rows[row].cells[col];
        return cell.textContent ? cell.textContent : cell.innerText;    
    };
    tbl.getSort = function () {
        var aSort = [], hSort;
        if (tbl.tHead.getAttribute("data-sortOrder")) {
            hSort = tbl.tHead.getAttribute("data-sortOrder").split(",");
            for (var i=0; i<hSort.length; i++) {
                aSort.push({cellIndex: hSort[i], dir: tbl.headerCell(hSort[i]).getSort()});
            }
        }
        return aSort;
    };
    tbl.setSort = function(aSort) {
        var i;
        if (typeof aSort !== "object" || aSort.constructor !== Array) {
            throw new TypeError ("jTable.setSort() expects an array parameter");
        }
        for (i=0; i<aSort.length; i++) {
            if (aSort[i].cellIndex === undefined || aSort[i].dir === undefined) {
                throw new TypeError ("jTable.setSort() expects cellIndex and dir for array item " + i);
            }
        }
	//this is a comb sort. O(n log n), but O(n) if already sorted
	//for now, just sort using first item in sort array
	var tblDataTypes = tbl.dataType();
	var currentSort = tbl.getSort();
	var rows = tbl.tBodies[0].rows;
	//update sort attributes
	i = 0;
	while (tbl.headerCell(i)) {
	    tbl.headerCell(i).removeAttribute("data-sort");
	    i++;
	}
	var sortOrder = [];
	for (i=0; i < aSort.length; i++)  {
	    tbl.headerCell(aSort[i].cellIndex).setAttribute("data-sort", aSort[i].dir);
	    sortOrder.push(aSort[i].cellIndex);
	}
	tbl.tHead.setAttribute("data-sortOrder", sortOrder.join(","));
	if (aSort.length === 0) {
	    return tbl;
	}
	//if it's already sorted the opposite way, just reflect it
	if (currentSort.length === 1 && aSort.length === 1 && currentSort[0].cellIndex === aSort[0].cellIndex &&
	  currentSort[0].dir !== aSort[0].dir) {
	    for (i=rows.length - 1; i>=0; i--) {
	        rows[0].parentNode.appendChild(rows[0].parentNode.removeChild(rows[i]));
	    }	  
	} else {
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
	        for (i=0; i + gap < rows.length; i++) for (var j=0; j<aSort.length; j++) {
	            a = tbl.data(i, aSort[j].cellIndex);
	            b = tbl.data(i + gap, aSort[j].cellIndex);
	            if (a !== b) {
	                if (jTable.dataTypes[tblDataTypes[aSort[j].cellIndex]].swap(a,b) ? aSort[j].dir === 'up' : aSort[j].dir === 'down') {
	                    var tempRowiPlusGap = rows[i].parentNode.replaceChild(rows[i], rows[i+gap]);
		            rows[i].parentNode.insertBefore(tempRowiPlusGap, rows[i]);
			    swapped = true;
	                } 
	                break;
	            }
	        }
	    }
	}
	return tbl;
    };
    tbl.dataType = function() {
        var answer = [];
        var i = 0;
        while (tbl.headerCell(i)) {
            answer.push(tbl.headerCell(i).dataType())
            i++;
        }
        return answer;        
    };
    tbl.getHide = function() {
        var answer = [];
        var i = 0;
        while (tbl.headerCell(i)) {
            if (tbl.headerCell(i).getHide()) {
                answer.push(i);
            }
            i++;
        }
        return answer;
    };
    tbl.setHide = function(hide) {
        var currentHide = tbl.getHide();
        var removeHide = [];
        var newHide = [];
        for (var i=0; i<hide.length; i++) {
            if (("|" + currentHide.join("|") + "|").indexOf("|" + hide[i] + "|") === -1) {
                newHide.push(hide[i]);
            }
        }
        for (i=0; i<currentHide.length; i++) {
            if (("|" + hide.join("|") + "|").indexOf("|" + currentHide[i] + "|") === -1) {
                removeHide.push(currentHide[i]);
            }
        }
        for (i=0; i<newHide.length; i++) {
            tbl.headerCell(newHide[i]).setHide(true);
        }
        for (i=0; i<removeHide.length; i++) {
	    tbl.headerCell(removeHide[i]).setHide(false);
        }
        return tbl;
    };
    tbl.getFilter = function() {
        var answer = [];
        var headerCell, headerCellFilter;
        for (var i = 0; true; i++) {
            headerCell = tbl.headerCell(i);
            if (!headerCell) {
                break;
            }
            headerCellFilter = headerCell.getFilter();
            if (headerCellFilter) {
                answer.push({cellIndex: i, filter: headerCellFilter});
            }
        }
        return answer;
    };
    tbl.setFilter = function(filters) {
	var i = 0;
	while (tbl.headerCell(i)) {
	    tbl.headerCell(i).removeAttribute("data-filter");
	    i++;
	}
	for (i = 0; i<filters.length; i++) {
	    tbl.headerCell(filters[i].cellIndex).setAttribute("data-filter", filters[i].filter);	            
	}
	//iterate through each row, put filter in then remove if necessary
	var rows = tbl.tBodies[0].rows;
	var rowpass;
	for (var irow=0; irow < rows.length; irow++) {
	    rowpass = true;
	    for (var j=0; j < filters.length; j++) {
	    //if any of the filters doesn't match, then mark the row as filtered
	        if (!filters[j].filter.test(tbl.data(irow, filters[j].cellIndex))) {
	            rowpass = false;
	            break;
	        }
	    }
	    if (rowpass) {
	        rows[irow].className = rows[irow].className.replace(/filtered/g, "");
	    }
	    else if (rows[irow].className.search(" filtered") === -1) {
	        rows[irow].className += " filtered";
	    }
	}
	return filters;
    };
    return tbl;
};
jTable.h = function(hDom) {
    //first,check the hDom type and raise a TypeError if appropriate
    var rHead = ((typeof hDom) === "string") ? document.getElementById(hDom) : hDom;
    if (rHead === undefined) { 
        return undefined;
    }
    while (rHead.tagName.toLowerCase() !== 'th' && rHead.tagName.toLowerCase() !== 'body') {
        rHead = rHead.parentNode;
    }
    if (rHead.tagName.toLowerCase() === 'body') {
        return undefined;
    }
    var i, temp;
    //then, return a new object based on the header DOM but with more methods
    temp = rHead;
    while(temp.tagName.toLowerCase() !== 'table') {
        temp = temp.parentNode;
    }
    rHead.table = temp;
    rHead.data = function(row) {
        temp = rHead.table.tBodies[0].rows[row].cells[rHead.cellIndex];
        return temp.textContent ? temp.textContent : temp.innerText;
    
    };
    rHead.getSort = function() {
    	return rHead.getAttribute("data-sort");
    };
    rHead.setSort = function(dir) {
        if (dir) {
            jTable.t(rHead).setSort([{cellIndex: rHead.cellIndex, dir: dir}]);
        }
        else {
            jTable.t(rHead).setSort([]);
        }
        return rHead;
    };
    rHead.dataType = function() {
        var answer;
        if (rHead.getAttribute("data-datatype")) {
            return rHead.getAttribute("data-datatype")
        } else {
            answer = rHead.calculateDataType();
            rHead.setAttribute("data-datatype", answer);
            return answer;
        }
    };
    rHead.calculateDataType = function() {
	//check data type of first entry. then check if all others consistent, if not then string.
	var cellIndex = this.cellIndex;
	var dataType, dataType_old;
	for (var i=0; i<rHead.table.tBodies[0].rows.length; i++) {
	    dataType = "string";
	    for (var j in jTable.dataTypes) if (jTable.dataTypes.hasOwnProperty(j) && j !== 'string') {
	        if ((!jTable.dataTypes[j].re || jTable.dataTypes[j].re.test(rHead.data(i))) &&
	          (!jTable.dataTypes[j].js || jTable.dataTypes[j].js(rHead.data(i)))) {
	            dataType = j;
	            break;
	        }
	    }
	    if (i===0) {
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
	}	
	return dataType;
    };
    rHead.getHide = function() {
        var answer = false;
        var col = rHead.table.getElementsByTagName("col")[rHead.cellIndex];
        if (col && (col.style.visibility === 'collapse' || col.style.display === 'none')) {
            answer = true;
        }
        return answer;        
    };
    rHead.setHide = function(hide) {
	var currentHide = rHead.getHide();
	var cellIndex = rHead.cellIndex;
	var colgroup = rHead.table.getElementsByTagName("colgroup")[0];
	//create the colgroup if it doesn't already exist
	if (!colgroup) {
	    colgroup = rHead.table.appendChild(document.createElement("colgroup"));
	}
	//create the cols if they don't already exist in the right number
	if (colgroup.getElementsByTagName("col").length !== rHead.parentNode.cells.length) {
	    for (var i=0; i<colgroup.getElementsByTagName("col").length; i++) {
	        colgroup.removeChild(colgroup.getElementsByTagName("col")[i]);
	    }
	    for (i=0; i<rHead.parentNode.cells.length; i++) {
	        colgroup.appendChild(document.createElement("col"));
	    }	
	}
	var col = colgroup.getElementsByTagName("col")[cellIndex];
	if (hide && !currentHide) {
	    try { //Fx, Safari
	        col.style.visibility = 'collapse';
	    } catch(err) {
	        col.style.display = 'none';
	    }
	}
	if (!hide && currentHide) {
	    if (col.style.display === 'none') {
	        col.style.display = '';
	    } else {
	        col.style.visibility = '';
	    }
	}
	return rHead;
    };
    rHead.getFilter = function() {
        var isRegExp = /^\/(.+)\/$/.exec(rHead.getAttribute("data-filter"));
        if (isRegExp) {
            return new RegExp(isRegExp[1]);
        }
    };
    rHead.setFilter = function(f) {
        var t = jTable.t(rHead);
        if (f) {
            rHead.setAttribute("data-filter", f);
        }
        else {
            rHead.removeAttribute("data-filter");
        }
        t.setFilter(t.getFilter());
        return rHead;
    };
    rHead.getUniqueValues = function() {
        //first, create array containing every value
        var values = [];
        var cellIndex = rHead.cellIndex;
        var cloneTable = jTable.t(rHead.table.cloneNode(true)).setSort([{cellIndex: cellIndex, dir: 'up'}]);
        var rows = cloneTable.tBodies[0].rows;
        //var colData = jTable.h(rHead.table.cloneNode(true)).setSort('up').data;
        for (var i=0; i<rows.length; i++) {
            if (i===0 || cloneTable.data(i, cellIndex) !== cloneTable.data(i - 1, cellIndex)) {
                values.push(cloneTable.data(i, cellIndex));    
            }
        }
        return values;
    };
    rHead.addColumn = function(dir) {
        //left if dir===false, right if dir===true
        if (typeof dir !== 'boolean') {
            throw new TypeError("must pass boolean to jTable.h.addColumn");
        }
        var rows = rHead.table.tBodies[0].rows;
        var cellIndex = rHead.cellIndex;
        var th = document.createElement("th");
        var td = document.createElement("td");
        rHead.parentNode.insertBefore(th, dir ? rHead.nextSibling : rHead);
        for (var i=0; i<rows.length; i++) {
            rows[i].insertBefore(td.cloneNode(true), dir ? rows[i].cells[cellIndex].nextSibling : rows[i].cells[cellIndex]);
        }
    };
    rHead.deleteColumn = function() {
        var cellIndex = rHead.cellIndex;
        var rows = rHead.table.tBodies[0].rows;
        for (var i=0; i<rows.length; i++) {
            rows[i].removeChild(rows[i].cells[cellIndex]);
        }
        rHead = rHead.parentNode.removeChild(rHead);
    };
    return rHead;
};
jTable.c = function(cDom) {
    //first,check the cDom type and raise a TypeError if appropriate
    var cell = (typeof cDom === "string") ? document.getElementById(cDom) : cDom;
    if (cell === undefined || cell === null) {
        return undefined;
    }
    while (cell.tagName.toLowerCase().search(/^th|td$/) === -1 && cell.tagName.toLowerCase() !== 'body') {
        cell = cell.parentNode;
    }
    if (cell.tagName.toLowerCase() === 'body') {
        return undefined;
    }
    //then, return a new object based on the header DOM but with more methods
    cell.setEditMode = function(ed) {
        var currentEd = cell.getEditMode();
        var div;
        if (ed && !currentEd) {
            div = document.createElement("div");
            div.contentEditable = true;
            while (cell.hasChildNodes()) {
                div.appendChild(cell.removeChild(cell.childNodes[0]));
            }
            cell.appendChild(div);
            div.focus();
 	    //warning: this could create duplicates
	    if (cell.id) {
	        cell.setAttribute("old_id", cell.id);
	    }
            cell.id = "editCell";
        } 
        if (!ed && currentEd) {
            //find the child div with contentEditable==true
            for (var i=0; i < cell.childNodes.length; i++) {
                if (cell.childNodes[i].nodeType === 1 && cell.childNodes[i].nodeName.toLowerCase() === 'div' && cell.childNodes[i].contentEditable) {
                    div = cell.childNodes[i];
                    break;
                }            
            }
            div.removeAttribute("contentEditable");
            while (div.hasChildNodes()) {
                cell.appendChild(div.removeChild(div.childNodes[0]));
            }
            cell.removeChild(div);
            if (cell.getAttribute("old_id")) {
                cell.id = cell.getAttribute("old_id");
                cell.removeAttribute("old_id");
            } else {
                cell.removeAttribute("id");
            }
            //re-calculate the dataType. should only need to do this if incompatible.
            var head = jTable.t(cell).headerCell(cell.cellIndex);
            head.setAttribute("data-datatype", head.calculateDataType());
        }
        return cell;
    };
    cell.getEditMode = function() {
        var divs = cell.getElementsByTagName("div");
        for (var i=0; i < divs.length; i++) if (divs[i].contentEditable) {
            return true;
        }
        return false;
    };
    return cell;
};
jTable.dataTypes = {
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
