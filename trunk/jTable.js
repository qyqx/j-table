jTable = {};
jTable.t = function(tDom) {
    //first, create a table object, raising a TypeError if appropriate
    var tbl = ((typeof tDom) == "string") ? document.getElementById(tDom) : tDom;
    if (tbl == undefined) {
        return undefined;
    }
    while (tbl.tagName.toLowerCase() != 'table' && tbl.tagName.toLowerCase() != 'body') {
        tbl = tbl.parentNode;
    }
    if (tbl.tagName.toLowerCase() == 'body') {
        return undefined;
    }
    //then, add utility methods to tbl
    tbl.hCells = [];
    if (tbl.tHead) {
        for (var i=0; i<tbl.tHead.rows[0].cells.length; i++) {
            tbl.hCells.push(jTable.h(tbl.tHead.rows[0].cells[i]));
        }
    }
    tbl.getSort = function () {
        var aSort = [], hSort;
        if (tbl.tHead.getAttribute("data-sortOrder")) {
            hSort = tbl.tHead.getAttribute("data-sortOrder").split(",");
            for (var i=0; i<hSort.length; i++) {
                aSort.push({cellIndex: hSort[i], dir: tbl.hCells[hSort[i]].getSort()});
            }
        }
        return aSort;
    }
    tbl.setSort = function(aSort) {
        if (typeof aSort != "object" || aSort.constructor != Array) {
            throw new TypeError ("jTable.setSort() expects an array parameter");
        }
        for (var i=0; i<aSort.length; i++) {
            if (aSort[i].cellIndex == undefined || aSort[i].dir == undefined) {
                throw new TypeError ("jTable.setSort() expects cellIndex and dir for array item " + i);
            }
        }
	//this is a comb sort. O(n log n), but O(n) if already sorted
	//for now, just sort using first item in sort array
	var tblDataTypes = tbl.dataType();
	var currentSort = tbl.getSort();
	var rows = tbl.tBodies[0].rows;
	var swapTest = function(a, b, direction, type) {
	    if (a===b) {
		return 0;
	    }
	    var dir = (direction == 'up') ? 1 : -1;
	    switch (type) {
		case 'number':
		    return dir * (Number(a) > Number(b) ? 1 : -1);
		    break;
		case 'string':
		    return dir * (a > b ? 1 : -1);
		    break;
	    }
	}
	//update sort attributes
	for (var i=0; i < tbl.hCells.length; i++) {
	    tbl.hCells[i].removeAttribute("data-sort");
	}
	var sortOrder = [];
	for (var i=0; i < aSort.length; i++)  {
	    tbl.hCells[aSort[i].cellIndex].setAttribute("data-sort", aSort[i].dir);
	    sortOrder.push(aSort[i].cellIndex)
	}
	tbl.tHead.setAttribute("data-sortOrder", sortOrder.join(","));
	if (aSort.length == 0) {
	    return tbl;
	}
	//if it's already sorted the opposite way, just reflect it
	if (currentSort.length == 1 && aSort.length == 1 && currentSort[0].cellIndex == aSort[0].cellIndex 
	  && currentSort[0].dir != aSort[0].dir) {
	    for (var i=rows.length - 1; i>=0; i--) {
	        rows[0].parentNode.appendChild(rows[0].parentNode.removeChild(rows[i]));
	    }	  
	} else {
	//use comb sort O(n log n)
	    var gap = rows.length;
	    var swapped = true;
	    var swapResult;
	    while (gap > 1 || swapped) {
	    //update the gap value for a next comb
	        if (gap > 1) {
	            gap = Math.floor (gap / 1.3);
	            if (gap == 10 || gap == 9)
	                gap = 11;
	        }
	        swapped = false;
	        //a single "comb" over the input list
	        for (var i=0; i + gap < rows.length; i++) {
	            for (var j=0; j<aSort.length; j++) {
	                swapResult = swapTest(jTable.c(rows[i].cells[aSort[j].cellIndex]).getTextContent(), jTable.c(rows[i + gap].cells[aSort[j].cellIndex]).getTextContent(), aSort[j].dir, tblDataTypes[aSort[j].cellIndex]);
	                if (swapResult == -1) {
	                    break;
	                }
	                else if (swapResult == 1) {
	                    var tempRowiPlusGap = rows[i].parentNode.replaceChild(rows[i], rows[i+gap]);
	                    rows[i].parentNode.insertBefore(tempRowiPlusGap, rows[i]);
	                    swapped = true;
	                    break;
	                }
	            
	            }
	        }
	    }
	}
	return tbl;
    }
    tbl.dataType = function() {
        var answer = [];
        for (var i=0; i<tbl.hCells.length; i++) {
            answer.push(tbl.hCells[i].dataType())            
        }
        return answer;        
    }
    tbl.getHide = function() {
        var answer = [];        
        for (var i=0; i<tbl.hCells.length; i++) if (tbl.hCells[i].getHide()) {
            answer.push(i);
        }
        return answer;
    }
    tbl.setHide = function(hide) {
        var currentHide = tbl.getHide();
        var removeHide = [];
        var newHide = [];
        for (var i=0; i<hide.length; i++) {
            if (("|" + currentHide.join("|") + "|").indexOf("|" + hide[i] + "|") == -1) {
                newHide.push(hide[i]);
            }
        }
        for (var i=0; i<currentHide.length; i++) {
            if (("|" + hide.join("|") + "|").indexOf("|" + currentHide[i] + "|") == -1) {
                removeHide.push(currentHide[i]);
            }
        }
        for (var i=0; i<newHide.length; i++) {
            tbl.hCells[newHide[i]].setHide(true);
        }
        for (var i=0; i<removeHide.length; i++) {
	    tbl.hCells[removeHide[i]].setHide(false);
        }
        return tbl;
    }
    tbl.getFilter = function() {
        var answer = [];
        for (var i=0; i<tbl.hCells.length; i++) if (tbl.hCells[i].getFilter()) {
             answer.push({cellIndex: i, filter: tbl.hCells[i].getFilter()});
        }
        return answer;
    }
    tbl.setFilter = function(filters) {
	for (var i=0; i<tbl.hCells.length; i++) {
	    tbl.hCells[i].removeAttribute("data-filter")
	}
	for (var i=0; i<filters.length; i++) {
	    tbl.hCells[filters[i].cellIndex].setAttribute("data-filter", filters[i].filter);	            
	}
	//iterate through each row, put filter in then remove if necessary
	var rows = tbl.tBodies[0].rows;
	var rowpass;
	for (var irow=0; irow < rows.length; irow++) {
	    rowpass = true;
	    for (var j=0; j < filters.length; j++) {
	    //if any of the filters doesn't match, then mark the row as filtered
	        if (!filters[j].filter.test(jTable.c(rows[irow].cells[filters[j].cellIndex]).getTextContent())) {
	            rowpass = false;
	            break;
	        }
	    }
	    if (rowpass) {
	        rows[irow].className = rows[irow].className.replace(/filtered/g, "");
	    }
	    else if (rows[irow].className.search(" filtered") == -1) {
	        rows[irow].className += " filtered";
	    }
	}
	return filters;
    }
    return tbl;
}
jTable.h = function(hDom) {
    //first,check the hDom type and raise a TypeError if appropriate
    var rHead = ((typeof hDom) == "string") ? document.getElementById(hDom) : hDom;
    if (rHead == undefined) { 
        return undefined;
    }
    while (rHead.tagName.toLowerCase() != 'th' && rHead.tagName.toLowerCase() != 'body') {
        rHead = rHead.parentNode;
    }
    if (rHead.tagName.toLowerCase() == 'body') {
        return undefined;
    }
    //then, return a new object based on the header DOM but with more methods
    rHead.getSort = function() {
    	return rHead.getAttribute("data-sort");
    }
    rHead.setSort = function(dir) {
        if (dir) {
            jTable.t(rHead).setSort([{cellIndex: rHead.cellIndex, dir: dir}]);
        }
        else {
            jTable.t(rHead).setSort([]);
        }
        return rHead;
    }
    rHead.dataType = function() {
	//check data type of first entry. then check if all others consistent, if not then string.
	var dataTypes = [{dataType: "number", re: /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i}];
	var cellIndex = this.cellIndex;
	var rows = jTable.t(this).tBodies[0].rows;
	var dataType, dataType_old;
	for (var i=0; i<rows.length; i++) {
	    dataType = "string";
	    for (var j=0; j<dataTypes.length; j++) {
	        if (dataTypes[j].re.test(jTable.c(rows[i].cells[cellIndex]).getTextContent())) {
	            dataType = dataTypes[j].dataType;
	            break;
	        }
	    }
	    if (i==0) {
	        dataType_old = dataType;
	    }
	    if (dataType == "string") {
	        break;
	    }
	    if (dataType != dataType_old) {
	        dataType = "string";
	        break;
	    }
	    dataType_old = dataType;
	}	
	return dataType;
    }
    rHead.getHide = function() {
        var answer = false;
        var col = jTable.t(rHead).getElementsByTagName("col")[rHead.cellIndex];
        if (col && (col.style.visibility == 'collapse' || col.style.display == 'none')) {
            answer = true;
        }
        return answer;        
    }
    rHead.setHide = function(hide) {
	var currentHide = rHead.getHide();
	var rows;
	var cellIndex = rHead.cellIndex;
	var tbl = jTable.t(rHead);
	var colgroup = tbl.getElementsByTagName("colgroup")[0];
	//create the colgroup if it doesn't already exist
	if (!colgroup) {
	    colgroup = tbl.appendChild(document.createElement("colgroup"));
	}
	//create the cols if they don't already exist in the right number
	if (colgroup.getElementsByTagName("col").length !== tbl.hCells.length) {
	    for (var i=0; i<colgroup.getElementsByTagName("col").length; i++) {
	        colgroup.removeChild(colgroup.getElementsByTagName("col")[i]);
	    }
	    for (var i=0; i<tbl.hCells.length; i++) {
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
	    if (col.style.display == 'none') {
	        col.style.display = '';
	    } else {
	        col.style.visibility = '';
	    }
	}
	return rHead;
    }
    rHead.getFilter = function() {
        var isRegExp = /^\/(.+)\/$/.exec(rHead.getAttribute("data-filter")) 
        if (isRegExp) {
            return new RegExp(isRegExp[1]);
        }
    }
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
    }
    rHead.getUniqueValues = function() {
        //first, create array containing every value
        var values = [];
        var cellIndex = rHead.cellIndex;
        var cloneTable = jTable.t(jTable.t(rHead).cloneNode(true)).setSort([{cellIndex: cellIndex, dir: 'up'}]);
        var rows = cloneTable.tBodies[0].rows;
        for (var i=0; i<rows.length; i++) {
            if (i==0 || jTable.c(rows[i].cells[cellIndex]).getTextContent() != jTable.c(rows[i-1].cells[cellIndex]).getTextContent()) {
                values.push(jTable.c(rows[i].cells[cellIndex]).getTextContent());    
            }
        }
        return values;
    }
    return rHead;    
}
jTable.c = function(cDom) {
    //first,check the cDom type and raise a TypeError if appropriate
    var cell = (typeof cDom == "string") ? document.getElementById(cDom) : cDom;
    if (cell == undefined) {
        return undefined;
    }
    while (cell.tagName.toLowerCase().search(/^th|td$/) == -1 && cell.tagName.toLowerCase() != 'body') {
        cell = cell.parentNode;
    }
    if (cell.tagName.toLowerCase() == 'body') {
        return undefined;
    }
    //then, return a new object based on the header DOM but with more methods
    cell.setEditMode = function(ed) {
        var currentEd = cell.getEditMode();
        if (ed && !currentEd) {
            var div = document.createElement("div");
            div.contentEditable = true;
            while (cell.hasChildNodes()) {
                div.appendChild(cell.removeChild(cell.childNodes[0]));
            }
            cell.appendChild(div);
	   //warning: this could create duplicates
	    if (cell.id) {
	        cell.setAttribute("old_id", cell.id);
	    }
            cell.id = "editCell";
        } 
        if (!ed && currentEd) {
            //find the child div with contentEditable==true
            var div;
            for (var i=0; i < cell.childNodes.length; i++) {
                if (cell.childNodes[i].nodeType == 1 && cell.childNodes[i].nodeName.toLowerCase() == 'div' && cell.childNodes[i].contentEditable) {
                    div = cell.childNodes[i];
                    break;
                }            
            }
            div.removeAttribute("contentEditable");
            while (div.hasChildNodes()) {
                cell.appendChild(div.removeChild(div.childNodes[0]))
            }
            cell.removeChild(div);
            if (cell.getAttribute("old_id")) {
                cell.id = cell.getAttribute("old_id");
                cell.removeAttribute("old_id");
            } else {
                cell.removeAttribute("id");
            }
        }
        return cell;
    }
    cell.getEditMode = function() {
        var divs = cell.getElementsByTagName("div");
        for (var i=0; i < divs.length; i++) if (divs[i].contentEditable) {
            return true;
        }
        return false;
    }
    cell.getTextContent = function() {
        return cell.textContent ? cell.textContent : cell.innerText;    
    }
    return cell;
}