var colOptions = {
    colHead: undefined,
    div: $('#colOptions'),
    open: function(colHead) {
	//first, get the unique entries in the list into an array. then sort array.
	this.colHead = colHead;
        var isRegExp = /^\/(.+)\/$/.exec(colHead.attr("data-filter"));
        var filter;
        if (isRegExp) {
            filter = new RegExp(isRegExp[1]);
        } else {
            filter = false;
        }
	console.log("filter = %o", filter);
	var i = 0, val = "";
        var colSelector = "*:nth-child(" + (this.colHead.attr("cellIndex") + 1) + ")";
	//set up initial values
        this.div.find('input').removeAttr("checked");
        this.div.find("input[name='sort']:first").attr("checked", colHead.attr("data-sort") == 'asc');
	this.div.find("input[name='sort']:last").attr("checked", colHead.attr("data-sort") == 'desc');
	this.div.find('h3').html(colHead.html());
	this.div.find('#colOptionsFilter span').remove();
	var filterHTML = this.div.find('#colOptionsFilter').html();
	//populate set of filter values
	colHead.parents("table").clone().find("tbody tr").tsort(colSelector).find(colSelector).each(function (i) {
	    val = $(this).text()
	    filterHTML += "<span class='divOption'><input type='checkbox' name='chkname" + i + "' ";
	    filterHTML += "id='chkid" + i + "' value='" + val + "' ";
	    if (!filter || (filter instanceof RegExp && filter.test(val))) {
	     	filterHTML += "checked";
	    }
            filterHTML += "></input><label for='chkid" + i + "'>" + val + "</label></span>";
	});
	this.div.find('#colOptionsFilter').html(filterHTML);
        //position box;
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
	var filterArray = filterInputs.filter("[checked]").map(function() {
	    return $(this).val();
	}).get();
	var regExp;
	var table = this.colHead.parents("table");
        var rows = table.find("tbody tr");
        var headers = table.find("thead th");
        var colSelector = "*:nth-child(" + (this.colHead.attr("cellIndex") + 1) + ")";
        var filterIn = rows;
        //fix filter attribute 
	if (filterArray.length == filterInputs.length) {
	    this.colHead.removeAttr("data-filter");
	} else {
            regExp = new RegExp("^" + filterArray.join("|") + "$")
            this.colHead.attr("data-filter", regExp);
        }
        //apply filters from each column to end up with remaining visible rows
        headers.each(function (i) {
            if (this.getAttribute("data-filter")) {
                regExp = /^\/(.+)\/$/.exec(this.getAttribute("data-filter"));
                if (regExp) {
                    filterIn = filterIn.filter(function (index) {
                        return (new RegExp(regExp[1])).test(this.cells[i].textContent);
                    });
                }
            }
        });
        rows.css("display", "none");
        filterIn.css("display", "");
        //sort ascending
	var sortDir = this.div.find('#colOptionsSort input[checked]').val();
	if (sortDir) {
	    this.colHead.attr("data-sort", sortDir);
	    table.attr("data-sortOrder", this.colHead.attr("cellIndex"));
	    rows.tsort(colSelector, {order: sortDir});
	}
	//hide
	if (this.div.find('#chkHide').attr("checked")) {
	    table.find("tr " + colSelector).css("display", "none");
	}
	//add Col
	if (this.div.find('#addColLeft').attr("checked")) {
	    //this.colHead.columnAdd(false);
	    table.find("thead tr " + colSelector).before("<th></th>");
	    rows.find(colSelector).before("<td></td>");
	}
	if (this.div.find('#addColRight').attr("checked")) {
	    //this.colHead.columnAdd(true);
	    table.find("thead tr " + colSelector).after("<th></th>");
	    rows.find(colSelector).after("<td></td>");	   
	}
	if (this.div.find('#chkDelete').attr("checked")) {
	    //this.colHead.columnRemove();
	    table.find("thead tr " + colSelector).remove();
	    rows.find(colSelector).remove();	  	    
	}
	this.div.find('#chkHide').attr("checked", "false");
	this.close();
    }
};

var tableTransform = {
    table: undefined,
    div: $('#tableTransform'),
    open: function(elem) {
 	this.table = elem.parents("table");
 	// unhide
	var strUnhide = "";
	this.table.find("thead th").each(function (i) {
	    if (this.style.display === "none") {
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
	var tbl = this.table;
	this.div.find("input[name='chkUnhide'][checked]").each(function (i) {
	    tbl.find("tr *:nth-child(" + (parseInt(this.value, 10) + 1) + ")").css("display", "table-cell");
	});
	this.close();
    }
};

var menu = {
    clickTab: function(e) {
        $('#tabHeaders li').removeClass("selected");
        $(e.target ? e.target : e.srcElement).parent().addClass("selected");
        $('#tabContents ul').removeClass("selected");
        $('#tabContents ul[id=tab' + $('#tabHeaders li.selected').text() + ']').addClass("selected");
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
    var table = elem.parents("table");
    var tableOffsetLeft = table.offset().left;
    var removeEditCell = function() {
        table.find("td div[contenteditable], th div[contenteditable]").each(function (i) {
            $(this).contents().appendTo($(this).parent());
            $(this).remove();
        });
    }
    //is it the sort/filter option in the header cell?
    if ($('thead th, thead td').filter(function() { return this === elem.get()[0]; }).length > 0) {
        if (e.clientX > (elem.offset().left + elem.outerWidth() - 10)) {
            colOptions.open(elem);
            removeEditCell();
	    return;
	}
	if (e.clientX > (elem.offset().left + elem.outerWidth() - 20)) {
   	    var sortDir = elem.attr("data-sort") == 'asc' ? 'desc' : 'asc';
	    elem.attr("data-sort", sortDir);
	    table.attr("data-sortOrder", elem.attr("cellIndex"));
	    table.find("tbody tr").tsort("*:nth-child(" + (elem.attr("cellIndex") + 1) + ")", {order: sortDir});
	    removeEditCell();
   	    return;
   	}
    }
    if ($('th, td').filter(function() { return this === elem.get()[0]; }).length > 0) {   	
        //enable editCell if it isn't already
   	if (elem.find("div[contenteditable]").length === 0) {
   	    removeEditCell();
   	    elem.contents().wrap("<div contenteditable=true></div>");
   	}
	elem.find("div[contenteditable]").focus();
	return;
    }
    //is it the table transform dialog box?
    if (elem.filter("caption").length > 0 && e.clientX > (elem.offset().left + elem.outerWidth()  - 30)) {
	tableTransform.open(elem);
	return;
    }
}
