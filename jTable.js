var objColOptions = new function() {
    this.colHead = undefined;
    this.colTable = undefined;
    this.divColOptions = undefined;
    this.open = function(colH) {
	//first, get the unique entries in the list into an array. then sort array.
	colHead = $(colH);
	colTable = colHead.table();
	divColOptions = document.getElementById('colOptions');
	var divColOptionsFilter = document.getElementById('colOptionsFilter');
	var filter = colHead.filter();
	var uniqueColValues = colHead.getUniqueValues();	
	//position box and create content
	document.getElementsByName("sort")[0].checked = (colHead.sort() == 'up');
	document.getElementsByName("sort")[1].checked = (colHead.sort() == 'down');
	document.getElementById('chkDelete').checked = false;
	divColOptions.style.left = colHead.offset().left + colHead.offset().width + "px";
	divColOptions.style.top = colHead.offset().top + "px";
	divColOptions.getElementsByTagName('h3')[0].innerHTML = colHead.html();
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
	    colHead.filter(false);
	} else {
            colHead.filter(new RegExp("^" + filterArray.join("|") + "$"));
        }
	//sort
	if (document.getElementById('sort_ascending').checked)
	    colHead.sort("up");
	if (document.getElementById('sort_descending').checked)
	    colHead.sort("down");
	//hide
	if (document.getElementById('chkHide').checked) {
	    colHead.hide(true);
	}
	//add Col
	if (document.getElementById('addColLeft').checked) {
	    colHead.addColumn(false);
	}
	if (document.getElementById('addColRight').checked) {
	    colHead.addColumn(true);
	}
	if (document.getElementById('chkDelete').checked) {
	    colHead.deleteColumn();
	}
	document.getElementById('colOptions').style.display = 'none';
	document.getElementById("chkHide").checked = false;
    }
}

var tableTransform = new function() {
    this.table = undefined;
    this.open = function(tbl) {
 	table = jt(tbl).table();
	var divTableTransform = document.getElementById("tableTransform");
	// unhide
	var strUnhide = "";
	tblHide = table.getHide();
	var col = 0;
	var i = 0;
	while (table.headerCell(col)) {
	    if (table.headerCell(col).getHide()) {
	        strUnhide += '<span class="divOption"><input type="checkbox" name="chkUnhide" id="chkHide' + i + '" value="' + col + '">';
	        strUnhide += '<label for="chkHide' + i + '">' + table.headerData(col) + '</label></span>';
	        i++;
	    }
	    col++;
	}
	if (i === 0) {
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
	for (var i=0; i<chkHide.length; i++) if (chkHide[i].checked) {
	    table.setHide(false, chkHide[i].value);
	}
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
    var elem = jt(e.target ? e.target : e.srcElement);
    if (!elem) {
        return false;
    }
    var tblOffsetLeft = 0;
    var tempTbl = elem;
    while (tempTbl && !isNaN(tempTbl.offsetLeft)) {
        tblOffsetLeft += tempTbl.offsetLeft;
        tempTbl = tempTbl.parentNode
    }
    //remove all editCells;
    while (jt('editCell')) {
        jt('editCell').setEditMode(false);
    }
    //is it the sort/filter option in the header cell?
    if (/^td|th$/.test(elem.tagName.toLowerCase())) {
        if (e.clientX > (tblOffsetLeft + elem.offsetWidth - 10)) {
            objColOptions.open(elem);
	    return;
	} else if (e.clientX > (tblOffsetLeft + elem.offsetWidth - 20) && e.clientX < (tblOffsetLeft + elem.offsetWidth - 10)) {
   	    if (e.ctrlKey) {
   	        if (!elem.table().getSort()) {
   	            elem.table().setSort(elem.table().getSort().concat([{cellIndex: elem.cellIndex, 'dir': 'up'}]));
   	        }
   	    } else {
   	        elem.setSort(elem.getSort() == 'up' ? 'down' : 'up');
   	    }
   	    return;
   	}
   	elem.setEditMode(true);
	elem.getElementsByTagName("div")[0].focus();
    }
    //is it the table transform dialog box?
    if ((e.target ? e.target : e.srcElement).tagName.toLowerCase() == 'caption' && e.clientX > (elem.offsetLeft + elem.offsetWidth  - 20)) {
	tableTransform.open(elem);
	return;
    }
}
