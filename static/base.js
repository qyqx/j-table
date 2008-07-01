var objColOptions = new function() {
    this.colHead = undefined;
    this.colTable = undefined;
    this.divColOptions = undefined;
    this.open = function(colH) {
	//first, get the unique entries in the list into an array. then sort array.
	colHead = jTable.h(colH);
	colTable = jTable.t(colH);
	divColOptions = jTable.$('colOptions');
	var divColOptionsFilter = jTable.$('colOptionsFilter');
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
	while (jTable.$('chkid' + i))
  	    jTable.$('chkid' + i++).checked = all;
    }
    this.submit = function() {
	//filter
	var filterInputs = jTable.$('colOptionsFilter').getElementsByTagName('input');
	var filterArray = [];
	for (var i=0; i<filterInputs.length; i++) {
	    if (filterInputs[i].checked)
		filterArray.push(filterInputs[i].getAttribute("value"));
	}
	if (filterArray.length == filterInputs.length) {
	    colHead.setFilter();
	} else {
            colHead.setFilter(new RegExp(filterArray.join("|")));
        }
	//sort
	if (jTable.$('sort_ascending').checked)
	    colHead.setSort("up");
	if (jTable.$('sort_descending').checked)
	    colHead.setSort("down");
	//hide
	if (jTable.$('chkHide').checked) {
	    colHead.setHide(true);
	}
	jTable.$('colOptions').style.display = 'none';
	jTable.$("chkHide").checked = false;
    }
}

var tableTransform = new function() {
    this.table = undefined;
    this.open = function(tbl) {
 	table = jTable.t(tbl);
	var divTableTransform = jTable.$("tableTransform");
	// unhide
	var strUnhide = "";
	tblHide = table.getHide();
	for (var i=0; i<tblHide.length; i++) {
	    strUnhide += '<span class="divOption"><input type="checkbox" name="chkHide" id="chkHide' + i + '" value="' + tblHide[i] + '">';
	    strUnhide += '<label for="chkHide' + i + '">' + table.hCells[tblHide[i]].textContent + '</label></span>';
	}
	if (strUnhide == "")
	    strUnhide += '<span class="divOption"><input type="checkbox" id="chk_nonehidden" disabled><label for="chk_nonehidden">No columns hidden</label></span>';
	jTable.$('tableTransformUnhide').innerHTML = "<h4>Unhide:</h4> " + strUnhide;
	divTableTransform.style.left = tbl.offsetLeft + tbl.offsetWidth + "px";
	divTableTransform.style.top = tbl.offsetTop + "px";
	divTableTransform.style.display = "block";	
    }
    this.close = function() {
	jTable.$("tableTransform").style.display = "none";
	table = undefined;
    }
    this.submit = function() {
	//unhide
	var chkHide = document.getElementsByName("chkHide");
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
		var tabHeaders = jTable.$('tabHeaders').getElementsByTagName('li');
		for (var i=0; i<tabHeaders.length; i++) {
			if (tabHeaders[i].innerHTML.indexOf(tab) > -1)
				tabHeaders[i].className = 'selected';
			else
				tabHeaders[i].className = '';
		}
		var tabContents = jTable.$('tabContents').getElementsByTagName('ul');
		for (var i=0; i<tabContents.length; i++) {
			if (tabContents[i].id.indexOf(tab) > -1)
				tabContents[i].className = 'selected';
			else
				tabContents[i].className = '';
		}
	}
	this.refresh = function(tbl) {
		// display as
		var rad = jTable.$('display_as');
		for (var i=0; i<rad.length; i++) {
			if (rad[i].value == tbl.getAttribute("viewAs"))
				rad[i].checked = true;
		}
	}
	this.style = function(cmd, str) {
		document.execCommand(cmd, null, str);
	}
}
function mDown(e) {
	var t, h;
	if (!e)
	    var e = window.event;
	if (e.target)
	    t = e.target;
	else if (e.srcElement)
	    t = e.srcElement;
	
	if (t.tagName.toLowerCase() == 'th' && t.parentNode.parentNode.tagName.toLowerCase() == 'thead') {
	    var h = jTable.h(t);
	    var tbl = jTable.t(t);
	    if (e.clientX > (h.offsetLeft + h.offsetWidth + tbl.offsetLeft - 10))
		objColOptions.open(t);
	    if (e.clientX > (h.offsetLeft + h.offsetWidth + tbl.offsetLeft - 20) &&
   	     e.clientX < (h.offsetLeft + h.offsetWidth + tbl.offsetLeft - 10)) {
   	        switch(h.getSort()) {
   	 	case 'up':
   	 	    h.setSort('down');
   	            break;
   	 	case 'down':
   	 	    h.setSort('up'); 
   	 	    break;
   	 	default:
   	 	    h.setSort('up');
   	 	    break;   		 	
   	        }
   	    }
   	}
	if (t.tagName.toLowerCase() == 'caption' && e.clientX > (t.offsetLeft + t.offsetWidth  - 20))
	    tableTransform.open(t.parentNode);
}
