jTable = {};
jTable.t = function(tDom) {
    //first, create a table object, raising a TypeError if appropriate
    var tbl = (typeof tDom == "string") ? document.getElementById(tDom) : tDom;
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
        if (tbl.tHead.getAttribute("sortOrder")) {
            hSort = tbl.tHead.getAttribute("sortOrder").split(",");
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
	    tbl.hCells[i].removeAttribute("sort");
	}
	var sortOrder = [];
	for (var i=0; i < aSort.length; i++)  {
	    tbl.hCells[aSort[i].cellIndex].setAttribute("sort", aSort[i].dir);
	    sortOrder.push(aSort[i].cellIndex)
	}
	tbl.tHead.setAttribute("sortOrder", sortOrder.join(","));
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
	                swapResult = swapTest(rows[i].cells[aSort[j].cellIndex].textContent, rows[i + gap].cells[aSort[j].cellIndex].textContent, aSort[j].dir, tblDataTypes[aSort[j].cellIndex]);
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
        for (var i=0; i<tbl.hCells.length; i++) if (tbl.hCells[i].getAttribute("hide")) {
            answer.push(i);
        }
        return answer;
    }
    tbl.setHide = function(hide) {
 	//delete and re-create <col> elements with appropriate styles
	if (this.getElementsByTagName("colgroup").length > 0)
	    this.removeChild(this.getElementsByTagName("colgroup")[0]);
	var colgroup = this.appendChild(document.createElement("colgroup"));
	var col = "";
	for (var i=0; i<tbl.hCells.length; i++) {
	    col = document.createElement("col");
	    for (var j=0; j<hide.length; j++) {
	        if (hide[j] == i)
	            col.setAttribute("style", "visibility:collapse");
	    }
	    if (col.getAttribute("style"))
	        tbl.hCells[i].setAttribute("hide", "hide");
	    else
	        tbl.hCells[i].removeAttribute("hide");
	    colgroup.appendChild(col);
        }
        return hide;
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
	    tbl.hCells[i].removeAttribute("filter")
	}
	for (var i=0; i<filters.length; i++) {
	    tbl.hCells[filters[i].cellIndex].setAttribute("filter", filters[i].filter);	            
	}
	//iterate through each row, put filter in then remove if necessary
	var rows = tbl.tBodies[0].rows;
	var rowpass;
	for (var irow=0; irow < rows.length; irow++) {
	    rowpass = true;
	    for (var j=0; j < filters.length; j++) {
	    //if any of the filters doesn't match, then mark the row as filtered
	        if (!filters[j].filter.test(rows[irow].cells[filters[j].cellIndex].textContent)) {
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
    var rHead = (typeof hDom == "string") ? document.getElementById(hDom) : hDom;
    if (rHead == undefined || rHead.tagName.toLowerCase() != "th") {
        return undefined;
    }
    //then, return a new object based on the header DOM but with more methods
    rHead.getSort = function() {
    	return rHead.getAttribute("sort");
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
	        if (dataTypes[j].re.test(rows[i].cells[cellIndex].textContent)) {
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
        answer = false;
        if (rHead.getAttribute("hide"))
            answer = true;
        return answer;        
    }
    rHead.setHide = function(hide) {
	var currentHide = jTable.t(rHead).getHide();
	if (hide)
	    jTable.t(rHead).setHide(currentHide.concat([rHead.cellIndex]));
	else {
	    for (var j=0; j<currentHide.length; j++) {
	        if (currentHide[j] == rHead.cellIndex) 
	            currentHide.splice(j,1);
	    }
	    jTable.t(rHead).setHide(currentHide);
	}
	return rHead;
    }
    rHead.getFilter = function() {
        var isRegExp = /^\/(.+)\/$/.exec(rHead.getAttribute("filter")) 
        if (isRegExp) {
            return new RegExp(isRegExp[1]);
        }
    }
    rHead.setFilter = function(f) {
        var t = jTable.t(rHead);
        if (f) {
            rHead.setAttribute("filter", f);
        }
        else {
            rHead.removeAttribute("filter");
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
            if (i==0 || rows[i].cells[cellIndex].textContent != rows[i-1].cells[cellIndex].textContent) {
                values.push(rows[i].cells[cellIndex].textContent);    
            }
        }
        return values;
    }
    return rHead;    
}
jTable.c = function(cDom) {
    //first,check the cDom type and raise a TypeError if appropriate
    var cell = (typeof cDom == "string") ? document.getElementById(cDom) : cDom;
    if (cell == undefined || cell.tagName.toLowerCase().search(/^th|td$/) == -1 ) {
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
            //remove all other editCells;
            while (document.getElementById("editCell")) {
	        jTable.c("editCell").setEditMode(false);
            }
            cell.id = "editCell";
        } 
        if (!ed && currentEd) {
            var div = cell.getElementsByTagName("div")[0];
            div.removeAttribute("contentEditable");
            while (div.hasChildNodes()) {
                cell.appendChild(div.removeChild(div.childNodes[0]))
            }
            cell.removeChild(div);
            cell.removeAttribute("id");
        }
        return cell;
    }
    cell.getEditMode = function() {
        return (cell.getElementsByTagName("div").length == 0) ? false : true;
    }
    return cell;
}