var assert = YAHOO.util.Assert; 
var tc_jTable_t = new YAHOO.tool.TestCase({
	name: "jTable.t",
	setUp : function () {
	    this.dataTable = jTable.t('testTable');
	},
	tearDown : function () {
	    delete this.dataTable;
	},
	testInputTable: function () {
	    assert.isObject(jTable.t('testTable').rows, "jTable.t() should accept DOM table parameter");
	},
	testInputTableRow: function () {
	    assert.isObject(jTable.t('firstTableRow').rows, "jTable.t() should accept DOM table row parameter");
	},
	testInputTableCell: function () {
	    assert.isObject(jTable.t('firstTableCell').rows, "jTable.t() should accept DOM table cell parameter");
	},
	testInputString: function () {
	    assert.isObject(jTable.t('testTable').rows, "jTable.t() should accept string parameter");
	},	
	testInputNotTable: function () {
	    assert.areEqual(jTable.t('menu'), undefined, "jTable should not allow non-table parameter");
	}
});
var tc_jTable_h = new YAHOO.tool.TestCase({
	name: "jTable.h",
	setUp : function () {
	    this.data = jTable.h('firstTableCell');
	},
	tearDown : function () {
	    delete this.data;
	},
	testInputTableCell: function () {
	    assert.areEqual(this.data.tagName.toLowerCase(), "th", "jTable.t() should accept DOM cell parameter");
	},
	testInputString: function () {
	    assert.areEqual(jTable.h('firstTableCell').tagName.toLowerCase(), "th", "jTable.t() should accept string parameter");
	},	
	testInputNotTableCell: function () {
	    assert.areEqual(jTable.h('menu'), undefined, "jTable should not allow non-table parameter");
	}
});
var tc_jTable_t_sort = new YAHOO.tool.TestCase({
	name: "jTable.t.sort",
	setUp : function () {
	    this.data = jTable.t('testTable').getSort();
	},
	tearDown : function () {
	    delete this.data;
	    jTable.t('testTable').setSort([]);
	},
	_should: {
	    error: {
	        testSetSortNoArray: TypeError,
	        testSetSortNoCellIndex: TypeError,
	        testSetSortNoDir: TypeError
	    }	
	},
	testGetSort: function () {
	    assert.isArray(this.data, "jTable.t().getSort() should return an array");
	    for (var i=0; i<this.data.length; i++) {
	        assert.isNumber(this.data[i].cellIndex, "cellIndex should be a number");
	        assert.isString(this.data[i].dir, "dir should be a string");
	    }
	},
	testSetSortNoArray: function() {
	    jTable.t('testTable').setSort('hello');	
	},
	testSetSortNoCellIndex: function() {
	    jTable.t('testTable').setSort([{dir: 'up'}]);
	},
	testSetSortNoDir: function() {
	    jTable.t('testTable').setSort([{cellIndex: 2, typo: 'up'}]);
	},
	testSetSingleSort: function() {
	    var tbl = jTable.t('testTable').setSort([{cellIndex: 1, dir: 'up'}]);
	    assert.areEqual(tbl.getSort()[0].cellIndex, 1, "setSort did not respect cellIndex");
	    assert.areEqual(tbl.getSort()[0].dir, 'up', "setSort did not respect dir");
	    assert.areEqual(jTable.c(tbl.tBodies[0].rows[0].cells[0]).getTextContent(), 'UK', 'setSort did not sort correctly');
	    assert.areEqual(jTable.c(tbl.tBodies[0].rows[1].cells[0]).getTextContent(), 'France', 'setSort did not sort correctly');
	},
	testSetMultipleSort: function() {
	    var tbl = jTable.t('testTable').setSort([{cellIndex: 2, dir: 'down'}, {cellIndex: 3, dir: 'up'}]);
	    assert.areEqual(tbl.getSort()[1].cellIndex, 3, "setSort did not respect the second cellIndex");
	    assert.areEqual(tbl.getSort()[1].dir, 'up', "setSort did not respect the second dir");
	    assert.areEqual(jTable.c(tbl.tBodies[0].rows[0].cells[0]).getTextContent(), 'France', 'setSort did not multi-sort correctly');
	    assert.areEqual(jTable.c(tbl.tBodies[0].rows[1].cells[0]).getTextContent(), 'USA', 'setSort did not multi-sort correctly');    
	}
});
var tc_jTable_h_sort = new YAHOO.tool.TestCase({
	name: "jTable.h.sort",
	setUp : function () {
	    this.data = jTable.h('testColHeader').getSort();
	},
	tearDown : function () {
	    delete this.data;
	    jTable.h('testColHeader').setSort();
	},
	testSort: function() {
	    jTable.h('testColHeader').setSort('up');
	    assert.areEqual(jTable.h('testColHeader').getSort(), 'up', "getSort did not reflect setSort");
	    assert.areEqual(jTable.c(jTable.t('testTable').tBodies[0].rows[0].cells[0]).getTextContent(), 'UK', 'setSort did not sort correctly');
	    assert.areEqual(jTable.c(jTable.t('testTable').tBodies[0].rows[1].cells[0]).getTextContent(), 'France', 'setSort did not sort correctly');
	}
});
var tc_jTable_datatype = new YAHOO.tool.TestCase({
	name: "jTable.datatype",
	testGetTDataType: function() {
	    assert.areEqual(jTable.t('testTable').dataType().join(), 'string,number,number,number,number', "incorrect table data types");
	    assert.areEqual(jTable.h('testColHeader').dataType(), 'number', 'incorrect column data types');
	}
});
var tc_jTable_h_hide = new YAHOO.tool.TestCase({
	name: "jTable.h.hide",
	testGetHide: function () {
	    assert.areEqual(jTable.h('testColHeader').getHide(), false, "jTable.h().getHide() didn't work");
	},
	testSetHide: function() {
	    jTable.h('testColHeader').setHide(true);
	    assert.areEqual(jTable.h('testColHeader').getHide(), true, "setHide didn't work");
	    jTable.h('testColHeader').setHide(false);
	}
});
var tc_jTable_t_hide = new YAHOO.tool.TestCase({
	name: "jTable.t.hide",
	testGetHide: function () {
	    assert.areEqual(jTable.t('testTable').getHide().length, 0, "jTable.t().getHide() should return an empty array");
	},
	testSetHide: function() {
	    jTable.t('testTable').setHide([1,3]);
	    assert.areEqual(jTable.t('testTable').getHide().length, 2, "setHide didn't hide every column");
	    assert.areEqual(jTable.t('testTable').getHide()[0], 1, "setHide didn't hide the first column");
	    assert.areEqual(jTable.t('testTable').getHide()[1], 3, "setHide didn't hide the second column");
	    jTable.t('testTable').setHide([]);
	}
});
var tc_jTable_h_filter = new YAHOO.tool.TestCase({
	name: "jTable.h.filter",
	testGetFilter: function () {
	    assert.areEqual(jTable.h('testColHeader').getFilter(), undefined, "jTable.h().getFilter() didn't return an empty object");
	},
	testSetFilter: function() {
	    jTable.h('testColHeader').setFilter(/^50|60$/);
	    var rows = jTable.t('testColHeader').tBodies[0].rows;
	    var textContent;
	    for (var i=0; i<rows.length; i++) {
	        assert.areEqual(rows[i].className.search("filtered") >= 0, jTable.c(rows[i].cells[0]).getTextContent() == "USA", "setFilter didn't filter properly");
	    }
	}
});
var tc_jTable_t_filter = new YAHOO.tool.TestCase({
	name: "jTable.t.filter",
	tearDown : function () {
	    jTable.t('testTable').setFilter([]);
	},
	testGetFilter: function () {
	    jTable.t('testTable').setFilter([]);
	    assert.areEqual(jTable.t('testTable').getFilter().length, 0, "jTable.t().getFilter() should return an empty array");
	},
	testSetFilter: function() {
	    jTable.t('testTable').setFilter([{cellIndex: 1, filter: /^50|60$/}]);
	    assert.areEqual(jTable.t('testTable').getFilter().length, 1, "setFilter didn't hide every column");
	    var rows = jTable.t('testColHeader').tBodies[0].rows;
	    var textContent;
	    for (var i=0; i<rows.length; i++) {
	        assert.areEqual(rows[i].className.search("filtered") >= 0, jTable.c(rows[i].cells[0]).getTextContent() == "USA", "setFilter didn't filter properly");
	    }
	}
});
var tc_jTable_c = new YAHOO.tool.TestCase({
	name: "jTable.c",
	setUp : function () {
	    this.data = jTable.c('testColHeader');
	},
	tearDown : function () {
	    delete this.data;
	},
	testInputTableCell: function () {
	    assert.areEqual(jTable.c(document.getElementById('testColHeader')).tagName.toLowerCase(), "th", "jTable.t() should accept DOM cell parameter");
	},
	testInputString: function () {
	    assert.areEqual(jTable.c('testColHeader').tagName.toLowerCase(), "th", "jTable.t() should accept string parameter");
	},	
	testInputNotTableCell: function () {
	    assert.areEqual(jTable.c('menu'), undefined, "jTable should not allow non-table parameter");
	}
});
var tc_jTable_c_editmode = new YAHOO.tool.TestCase({
	name: "jTable.c.editMode",
	setUp : function () {
	    this.data = jTable.c('testColHeader');
	},
	tearDown : function () {
	    delete this.data;
	},
	testGetEditMode: function () {
	    assert.areEqual(this.data.getEditMode(), false, "jTable.c('testColHeader').getEditMode() should return false");
	},
	testSetEditMode: function() {
	    this.data.setEditMode(true);
	    assert.areEqual(this.data.getElementsByTagName("div").length, 1, "jTable.c().setEditMode() did not make a cell editable");
	    assert.areEqual(this.data.getEditMode(), true, "jTable.c.setEditMode did not update jTable.c.getEditMode");
	    this.data.setEditMode(false);
	}
});
var tc_jTable_h_addcolumn = new YAHOO.tool.TestCase({
	name: "jTable.h.addColumn",
	testAddColumn: function () {
	    jTable.h('testColHeader').addColumn(false);
	    jTable.h('testColHeader').addColumn(true);
	}
});
YAHOO.tool.TestRunner.add(tc_jTable_t);
YAHOO.tool.TestRunner.add(tc_jTable_h);
YAHOO.tool.TestRunner.add(tc_jTable_t_sort);
YAHOO.tool.TestRunner.add(tc_jTable_h_sort);
YAHOO.tool.TestRunner.add(tc_jTable_datatype);
YAHOO.tool.TestRunner.add(tc_jTable_h_hide);
YAHOO.tool.TestRunner.add(tc_jTable_t_hide);
YAHOO.tool.TestRunner.add(tc_jTable_h_filter);
YAHOO.tool.TestRunner.add(tc_jTable_t_filter);
YAHOO.tool.TestRunner.add(tc_jTable_c);
YAHOO.tool.TestRunner.add(tc_jTable_c_editmode);
YAHOO.tool.TestRunner.add(tc_jTable_h_addcolumn);
var oLogger = new YAHOO.tool.TestLogger(); 
YAHOO.tool.TestRunner.run();