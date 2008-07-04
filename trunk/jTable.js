jTable = {};
jTable.t = function(tDom) {
    //first, create a table object, raising a TypeError if appropriate
    var tbl = (typeof tDom == "string") ? jTable.$(tDom) : tDom;
    if (tbl == undefined) {
        throw new TypeError("jTable.t() expects a table DOM element");
    }
    while (tbl.tagName.toLowerCase() != 'table' && tbl.tagName.toLowerCase() != 'body') {
        tbl = tbl.parentNode;
    }
    if (tbl.tagName.toLowerCase() == 'body') {
        throw new TypeError("jTable.t() expects an element inside a table");
    }
    //then, add utility methods to tbl
    tbl.hCells = [];
    if (tbl.tHead) {
        for (var i=0; i<tbl.tHead.rows[0].cells.length; i++) {
            tbl.hCells.push(jTable.h(tbl.tHead.rows[0].cells[i]));
        }
    }
    tbl.getSort = function () {
        var aSort = [];
        for (var i=0; i<tbl.hCells.length; i++) if (tbl.hCells[i].getSort()) {
            aSort.push({cellIndex: i, dir: tbl.hCells[i].getSort()})
        }
        return aSort;
    }
    tbl.setSort = function(aSort) {
        if (aSort[0] == undefined) {
            throw new TypeError ("jTable.setSort() expects an array parameter");
        }
        for (var i=0; i<aSort.length; i++) {
            if (aSort[i].cellIndex == undefined || aSort[i].dir == undefined) {
                throw new TypeError ("jTable.setSort() expects cellIndex and dir for array item " + i);
            }
        }
	//this is a comb sort. O(n log n), but O(n) if already sorted
	//for now, just sort using first item in sort array
	var colDataType = tbl.hCells[aSort[0].cellIndex].dataType();
	var currentSort = tbl.getSort();
	for (var i = 0; i < tbl.hCells.length; i++)
	    tbl.hCells[i].removeAttribute("sort");
	tbl.hCells[aSort[0].cellIndex].setAttribute("sort", aSort[0].dir);
	var rows = tbl.tBodies[0].rows;
	
	//use comb sort O(n log n), but only if it's not already sorted - reflect is O(n) 
	if (currentSort.length == 0 || (currentSort[0].cellIndex != aSort[0].cellIndex || currentSort[0].dir == aSort[0].dir)) {
	    var gap = rows.length;
	    var swapped = true;
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
	            if (jTable.swapme(rows[i].cells[aSort[0].cellIndex].textContent, rows[i + gap].cells[aSort[0].cellIndex].textContent, aSort[0].dir, colDataType)) {
	                var tempRowiPlusGap = rows[i].parentNode.replaceChild(rows[i], rows[i+gap]);
	                rows[i].parentNode.insertBefore(tempRowiPlusGap, rows[i]);
	                swapped = true;
	            }
	        }
	    }
	}
	else {
	    var currentNode = "";
	    for (var i=rows.length - 1; i>=0; i--) {
	        currentNode = rows[0].parentNode.removeChild(rows[i]);
	        rows[0].parentNode.appendChild(currentNode);
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
jTable.$ = function() {
    var elements = [];
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string')
            element = document.getElementById(element);
        if (arguments.length == 1)
            return element;
        elements.push(element);
    }
    return elements;
}
jTable.h = function(hDom) {
    //first,check the hDom type and raise a TypeError if appropriate
    if (typeof hDom == 'string')
        hDom = jTable.$(hDom);
    var rHead = "";
    if (hDom.tagName) {
        if (hDom.tagName.toLowerCase() == 'th')
            rHead = hDom;
        else {
            throw new TypeError("jTable.h() expects a TH element");
            return -1;
        }
    }
    else {
        throw new TypeError("jTable.h() expects a DOM element");
        return -1;        
    }
    //then, return a new object based on the header DOM but with more methods
    rHead.getSort = function() {
    	return rHead.getAttribute("sort");
    }
    rHead.setSort = function(dir) {
        return jTable.t(rHead).setSort([{cellIndex: rHead.cellIndex, dir: dir}])
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
	return true;
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
jTable.swapme = function(a, b, direction, type) {
    var answer = false;
    if (type == 'number') {
 	if (Number(a) > Number(b))
            answer = (direction == 'up');
	else if (Number(a) < Number(b))
	    answer = (direction == 'down');
    }
    if (type == 'string') {
	if (a > b)
	    answer = (direction == 'up');
	else if (a < b)
	    answer = (direction == 'down');
    }
    return answer;
}
