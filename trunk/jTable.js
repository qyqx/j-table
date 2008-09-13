var colOptions = {
    colHead: undefined,
    divColOptions: jQuery('#colOptions'),
    open: function(colHead) {
	//first, get the unique entries in the list into an array. then sort array.
	colOptions.colHead = colHead;
	var divColOptionsFilter = document.getElementById('colOptionsFilter');
	var filter = colHead.tableFilter();
	var uniqueColValues = [];
        var cellIndex = colHead.attr("cellIndex");
        var cloneHeaderCell = colHead.table().clone().tableSort([{cellIndex: cellIndex, dir: 'up'}]).tableHeaderCell(cellIndex);
        var i = 0;
        while (cloneHeaderCell.tableData(i)) {
            if (i===0 || cloneHeaderCell.tableData(i) !== cloneHeaderCell.tableData(i - 1)) {
                uniqueColValues.push(cloneHeaderCell.tableData(i));    
            }
            i++;
        }
	//position box and create content
	colOptions.divColOptions.find("input[name='sort']:first").attr("checked", colHead.tableSort() == 'up');
	colOptions.divColOptions.find("input[name='sort']:last").attr("checked", colHead.tableSort() == 'down');
	//document.getElementsByName("sort")[0].checked = (colHead.tableSort() == 'up');
	//document.getElementsByName("sort")[1].checked = (colHead.tableSort() == 'down');
	colOptions.divColOptions.filter('#chkDelete').attr("checked", "false");
	colOptions.divColOptions.css({left: colHead.outerWidth() + "px", top: colHead.offset().top + "px"})
	colOptions.divColOptions.html(colHead.html());
	colOptions.divColOptions.remove("span");
	var str = "";
	for (var i=0; i<uniqueColValues.length; i++) {
	    str = "<span class='divOption'><input type='checkbox' name='chkname" + i + "' ";
	    str += "id='chkid" + i + "' value='" + uniqueColValues[i] + "' ";
	    if (!filter || (filter instanceof RegExp && filter.test(uniqueColValues[i]))) {
	 	str += "checked";
	    }
            str += "></input><label for='chkid" + i + "'>" + uniqueColValues[i] + "</label></span>";
	}
	colOptions.divColOptions.find('#colOptionsFilter').html(str);
	colOptions.divColOptions.css("display", "block");
    },
    close: function() {
	colOptions.divColOptions.css("display", "none");
	colOptions.colHead = undefined;
    },
    chkAllNone: function(all) {
        colOptions.divColOptions.find("span.divOption input").attr("checked", all);
    },
    submit: function() {
	//filter
	var filterInputs = colOptions.divColOption.find("#colOptionsFilter input");
	var filterArray = [];
	for (var i=0; i<filterInputs.length; i++) {
	    if (filterInputs[i].attr("checked")) {
		filterArray.push(filterInputs[i].attr("value"));
	    }
	}
	if (filterArray.length == filterInputs.length) {
	    colOptions.colHead.filter(false);
	} else {
            colOptions.colHead.filter(new RegExp("^" + filterArray.join("|") + "$"));
        }
	//sort
	if (document.getElementById('sort_ascending').checked)
	    colOptions.colHead.tableSort("up");
	if (document.getElementById('sort_descending').checked)
	    colOptions.colHead.tableSort("down");
	//hide
	if (document.getElementById('chkHide').checked) {
	    colOptions.colHead.tableHide(true);
	}
	//add Col
	if (document.getElementById('addColLeft').checked) {
	    colOptions.colHead.tableAddColumn(false);
	}
	if (document.getElementById('addColRight').checked) {
	    colOptions.colHead.tableAddColumn(true);
	}
	if (document.getElementById('chkDelete').checked) {
	    colOptions.colHead.tableDeleteColumn();
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
    var elem = $(e.target ? e.target : e.srcElement);
    if (!elem.table()) {
        return false;
    }
    var tableOffsetLeft = elem.table().offset().left;
    //remove all editCells;
    $('#editCell').tableCellEditMode(false);
    //is it the sort/filter option in the header cell?
    //if (/^td|th$/.test(elem.tagName.toLowerCase())) {
    if (elem.is("td, th")) {
        if (e.clientX > (elem.offset().left + elem.outerWidth() - 10)) {
            colOptions.open(elem);
	    return;
	}
	if (e.clientX > (elem.offset().left + elem.outerWidth() - 20)) {
   	    if (e.ctrlKey) {
   	        if (!elem.table().tableSort()) {
   	            elem.table().tableSort(elem.table().tableSort()[0].concat([{cellIndex: elem.cellIndex, 'dir': 'up'}]));
   	        }
   	    } else {
   	        elem.tableSort(elem.tableSort() == 'up' ? 'down' : 'up');
   	    }
   	    return;
   	}
   	elem.tableCellEditMode(true);
	elem.get()[0].getElementsByTagName("div")[0].focus();
    }
    //is it the table transform dialog box?
    if ((e.target ? e.target : e.srcElement).tagName.toLowerCase() == 'caption' && e.clientX > (elem.offsetLeft + elem.offsetWidth  - 20)) {
	tableTransform.open(elem);
	return;
    }
}
