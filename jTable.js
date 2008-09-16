var colOptions = {
    colHead: undefined,
    div: $('#colOptions'),
    open: function(colHead) {
	//first, get the unique entries in the list into an array. then sort array.
	this.colHead = colHead;
	var filter = colHead.tableFilter()[0];
	var uniqueColValues = [];
        var cellIndex = colHead.attr("cellIndex");
        var cloneHeader = colHead.table().clone().tableSort([{cellIndex: cellIndex, dir: 'up'}]).tableHeaderCell(cellIndex);
        var i = 0;
        while (cloneHeader.tableData(i)) {
            if (i===0 || cloneHeader.tableData(i)[0] !== cloneHeader.tableData(i - 1)[0]) {
                uniqueColValues.push(cloneHeader.tableData(i));    
            }
            i++;
        }
        //position box and create content
        this.div.find('input').removeAttr("checked");
        this.div.find("input[name='sort']:first").attr("checked", colHead.tableSort() == 'up');
	this.div.find("input[name='sort']:last").attr("checked", colHead.tableSort() == 'down');
	this.div.find('h3').html(colHead.html());
	this.div.find('#colOptionsFilter span').remove();
	var str = this.div.find('#colOptionsFilter').html();
	for (var i=0; i<uniqueColValues.length; i++) {
	    str += "<span class='divOption'><input type='checkbox' name='chkname" + i + "' ";
	    str += "id='chkid" + i + "' value='" + uniqueColValues[i] + "' ";
	    if (!filter || (filter instanceof RegExp && filter.test(uniqueColValues[i]))) {
	 	str += "checked";
	    }
            str += "></input><label for='chkid" + i + "'>" + uniqueColValues[i] + "</label></span>";
	}
	this.div.find('#colOptionsFilter').html(str);
	this.div.css({
	    left: colHead.offset().left + colHead.outerWidth() + "px", 
	    top: colHead.offset().top + "px", 
	    display: "block"
	});
    },
    close: function() {
	this.div.css("display", "none");
	this.colHead = undefined;
    },
    chkAllNone: function(all) {
        this.div.find("#colOptionsFilter span.divOption input").attr("checked", all);
    },
    submit: function() {
	//filter
	var filterInputs = this.div.find("#colOptionsFilter input");
	var filterArray = [];
	for (var i=0; i<filterInputs.length; i++) {
	    if (filterInputs.eq(i).attr("checked")) {
		filterArray.push(filterInputs.eq(i).attr("value"));
	    }
	}
	if (filterArray.length == filterInputs.length) {
	    this.colHead.tableFilter(false);
	} else {
            this.colHead.tableFilter(new RegExp("^" + filterArray.join("|") + "$"));
        }
	//sort
	if (this.div.find('#sort_ascending').attr("checked"))
	    this.colHead.tableSort("up");
	if (this.div.find('#sort_descending').attr("checked"))
	    this.colHead.tableSort("down");
	//hide
	if (this.div.find('#chkHide').attr("checked")) {
	    this.colHead.tableHide(true);
	}
	//add Col
	if (this.div.find('#addColLeft').attr("checked")) {
	    this.colHead.tableAddColumn(false);
	}
	if (this.div.find('#addColRight').attr("checked")) {
	    this.colHead.tableAddColumn(true);
	}
	if (this.div.find('#chkDelete').attr("checked")) {
	    this.colHead.tableRemoveColumn();
	}
	this.div.find('#chkHide').attr("checked", "false");
	this.close();
    }
};

var tableTransform = {
    table: undefined,
    div: $('#tableTransform'),
    open: function(elem) {
 	this.table = elem.table();
	// unhide
	var strUnhide = "";
	this.table.find("thead th").each(function (i) {
	    if (jTable.tableHide(this)) {
	        strUnhide += '<span class="divOption"><input type="checkbox" name="chkUnhide" id="chkHide' + i + '" value="' + i + '">';
		strUnhide += '<label for="chkHide' + i + '">' + $(this).text() + '</label></span>';
	    }
	});
	if (strUnhide === '') {
	    strUnhide = '<span class="divOption"><input type="checkbox" id="chk_nonehidden" disabled><label for="chk_nonehidden">No columns hidden</label></span>';
	}
	this.div.find('#tableTransformUnhide').html("<h4>Unhide:</h4> " + strUnhide);
	this.div.css({
	    left: this.table.offset().left + this.table.outerWidth() + "px",
	    top: this.table.offset().top + "px",
	    display: "block"
	});
    },
    close: function() {
	this.div.css("display", "none");
	this.table = undefined;
    },
    submit: function() {
	//unhide
	var table = this.table;
	this.div.find("input[name='chkUnhide'][checked]").each(function (i) {
	    table.tableHide(this.value, false);
	});
	this.close();
    }
};

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
var menu = {
    clickTab: function(tab) {
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
    },
    refresh: function(tbl) {
    // display as
	var rad = document.getElementById('display_as');
	for (var i=0; i<rad.length; i++) {
	    if (rad[i].value == tbl.getAttribute("viewAs"))
		rad[i].checked = true;
	}
    },
    style: function(cmd, str) {
	if (document.queryCommandEnabled) {
	    try {document.execCommand(cmd, null, str);}
	    catch (err) {alert("cmd" + ", " + str + ", " + err.message);}
	} else {
	    alert("no text selected");
	}
    }
};
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
	return;
    }
    //is it the table transform dialog box?
    if ((e.target ? e.target : e.srcElement).tagName.toLowerCase() === 'caption' && e.clientX > (elem.offset().left + elem.outerWidth()  - 30)) {
	tableTransform.open(elem);
	return;
    }
}
