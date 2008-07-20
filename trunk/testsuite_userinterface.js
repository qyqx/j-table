var objColOptions = new function() {
    this.colHead = undefined;
    this.colTable = undefined;
    this.divColOptions = undefined;
    this.open = function(colH) {
	//first, get the unique entries in the list into an array. then sort array.
	colHead = jTable.h(colH);
	colTable = jTable.t(colH);
	divColOptions = document.getElementById('colOptions');
	var divColOptionsFilter = document.getElementById('colOptionsFilter');
	var filter = colHead.getFilter();
	var uniqueColValues = colHead.getUniqueValues();	
	//position box and create content
	document.getElementsByName("sort")[0].checked = (colHead.getSort() == 'up');
	document.getElementsByName("sort")[1].checked = (colHead.getSort() == 'down');
	divColOptions.style.left = colHead.offsetLeft + colHead.offsetWidth + colTable.offsetLeft + "px";
	divColOptions.style.top = colHead.offsetTop + colTable.offsetTop + "px";
	divColOptions.getElementsByTagName('h3')[0].innerHTML = colH.innerHTML;
	while (divColOptionsFilter.getElementsByTagName('span').length > 0)
	    divColOptionsFilter.removeChild(divColOptionsFilter.getElementsByTagName('span')[0]);
	var str = "";
	for (var i=0; i<uniqueColValues.length; i++) {
	    str = "<span class='divOption'><input type='checkbox' name='chkname" + i + "' ";
	    str += "id='chkid" + i + "' value='" + uniqueColValues[i] + "' ";
	    if (filter == undefined || filter.test(uniqueColValues[i])) {
	 	str += "checked";
	    }
            str += "></input><label for='chkid" + i + "'>" + uniqueColValues[i] + "</label></span>";
            divColOptionsFilter.innerHTML += str;
	}
	divColOptions.style.display = "block";
    }
    this.close = function() {
	divColOptions.style.display = "none";
	this.colHead = undefined;
	this.colTable = undefined;
    }
    this.chkAllNone = function(all) {
	var i = 0;
	while (document.getElementById('chkid' + i))
  	    document.getElementById('chkid' + i++).checked = all;
    }
    this.submit = function() {
	//filter
	var filterInputs = document.getElementById('colOptionsFilter').getElementsByTagName('input');
	var filterArray = [];
	for (var i=0; i<filterInputs.length; i++) {
	    if (filterInputs[i].checked)
		filterArray.push(filterInputs[i].getAttribute("value"));
	}
	if (filterArray.length == filterInputs.length) {
	    colHead.setFilter();
	} else {
            colHead.setFilter(new RegExp("^" + filterArray.join("|") + "$"));
        }
	//sort
	if (document.getElementById('sort_ascending').checked)
	    colHead.setSort("up");
	if (document.getElementById('sort_descending').checked)
	    colHead.setSort("down");
	//hide
	if (document.getElementById('chkHide').checked) {
	    colHead.setHide(true);
	}
	document.getElementById('colOptions').style.display = 'none';
	document.getElementById("chkHide").checked = false;
    }
}

var tableTransform = new function() {
    this.table = undefined;
    this.open = function(tbl) {
 	table = jTable.t(tbl);
	var divTableTransform = document.getElementById("tableTransform");
	// unhide
	var strUnhide = "";
	tblHide = table.getHide();
	for (var i=0; i<tblHide.length; i++) {
	    strUnhide += '<span class="divOption"><input type="checkbox" name="chkUnhide" id="chkHide' + i + '" value="' + tblHide[i] + '">';
	    strUnhide += '<label for="chkHide' + i + '">' + table.hCells[tblHide[i]].getTextContent() + '</label></span>';
	}
	if (strUnhide == "") {
	    strUnhide = '<span class="divOption"><input type="checkbox" id="chk_nonehidden" disabled><label for="chk_nonehidden">No columns hidden</label></span>';
	}
	document.getElementById('tableTransformUnhide').innerHTML = "<h4>Unhide:</h4> " + strUnhide;
	divTableTransform.style.left = tbl.offsetLeft + tbl.offsetWidth + "px";
	divTableTransform.style.top = tbl.offsetTop + "px";
	divTableTransform.style.display = "block";	
    }
    this.close = function() {
	document.getElementById("tableTransform").style.display = "none";
	table = undefined;
    }
    this.submit = function() {
	//unhide
	var chkHide = document.getElementsByName("chkUnhide");
	var setHide = [];
	for (var i=0; i<chkHide.length; i++) if (!chkHide[i].checked) {
	    setHide.push(chkHide[i].value);
	}
	table.setHide(setHide);	
	this.close();
    }
}

function getRange() {
	var userSelection;
	if (window.getSelection)
		userSelection = window.getSelection();
	else if (document.selection)
		userSelection = document.selection.createRange();

	if (userSelection.getRangeAt)
		return userSelection.getRangeAt(0);
	else { // Safari!
		var range = document.createRange();
		range.setStart(userSelection.anchorNode,userSelection.anchorOffset);
		range.setEnd(userSelection.focusNode,userSelection.focusOffset);
		return range;
	}
}
var menu = new function() {
    this.clickTab = function(tab) {
        var tabHeaders = document.getElementById('tabHeaders').getElementsByTagName('li');
	for (var i=0; i<tabHeaders.length; i++) {
	    if (tabHeaders[i].innerHTML.indexOf(tab) > -1)
		tabHeaders[i].className = 'selected';
	    else
		tabHeaders[i].className = '';
	    }
	    var tabContents = document.getElementById('tabContents').getElementsByTagName('ul');
	    for (var i=0; i<tabContents.length; i++) {
	    if (tabContents[i].id.indexOf(tab) > -1)
	 	tabContents[i].className = 'selected';
	    else
		tabContents[i].className = '';
	}
    }
    this.refresh = function(tbl) {
    // display as
	var rad = document.getElementById('display_as');
	for (var i=0; i<rad.length; i++) {
	    if (rad[i].value == tbl.getAttribute("viewAs"))
		rad[i].checked = true;
	}
    }
    this.style = function(cmd, str) {
	if (document.queryCommandEnabled) {
	    try {document.execCommand(cmd, null, str);}
	    catch (err) {alert("cmd" + ", " + str + ", " + err.message);}
	} else {
	    alert("no text selected");
	}
    }
}
function mDown(e) {
    var e = e ? e : window.event;
    var t = e.target ? e.target : e.srcElement;
    var tbl = jTable.t(t);
    var h = jTable.h(t);
    var c = jTable.c(t);
    var tblOffsetLeft = 0;
    var tempTbl = tbl;
    while (tempTbl && !isNaN(tempTbl.offsetLeft)) {
        tblOffsetLeft += tempTbl.offsetLeft;
        tempTbl = tempTbl.parentNode
    }
    //remove all editCells;
    while (jTable.c('editCell')) {
        jTable.c('editCell').setEditMode(false);
    }        
    //is it the sort/filter option in the header cell?
    if (h) {
    	if (e.clientX > (h.offsetLeft + h.offsetWidth + tblOffsetLeft - 10)) {
            objColOptions.open(t);
	    return;
	} else if (e.clientX > (h.offsetLeft + h.offsetWidth + tblOffsetLeft - 20) &&
   	 e.clientX < (h.offsetLeft + h.offsetWidth + tblOffsetLeft - 10)) {
   	    if (e.ctrlKey) {
   	        if (!h.getSort()) {
   	            tbl.setSort(tbl.getSort().concat([{cellIndex: h.cellIndex, 'dir': 'up'}]));
   	        }
   	    } else {
   	        h.setSort(h.getSort() == 'up' ? 'down' : 'up');
   	    }
   	    return;
   	}
    }
    //is it the table transform dialog box?
    if (t.tagName.toLowerCase() == 'caption' && e.clientX > (t.offsetLeft + t.offsetWidth  - 20)) {
	tableTransform.open(t.parentNode);
	return;
    }
    //ok so it's a normal cell, let's edit it
    if (c && !c.getEditMode()) {
	c.setEditMode(true);
	//alert(c.innerHTML);
	c.getElementsByTagName("div")[0].focus();
    }
}
