var assert = YAHOO.util.Assert; 
var tc_jt_cell = new YAHOO.tool.TestCase({
    name: "jt_cell",
    testCellTable: function() {
        assert.areEqual(jt('testTable').cell(10,10) === undefined, true, "jt().cell() should pass undefined for cells out of bounds");
        assert.areEqual(jt('testTable').cell(0,1).id, 'testCell1', "jt().cell(0,0) should return the first cell");
        assert.areEqual(jt('testTable').cell(1,3).id, 'testCell2', "jt().cell(0,0) should return the relevant cell");
    },
    testCellHeader: function() {
        assert.areEqual(jt('testColHeader').cell(10) === undefined, true, "jt().cell() should pass undefined for cells out of bounds");
        assert.areEqual(jt('testColHeader').cell(0).id, 'testCell1', "jt().cell(0) should return the first cell");
        assert.areEqual(jt('testColHeader').cell(1).id, 'testCell3', "jt().cell(1) should return the relevant cell");
    },
    testCellCell: function() {
        assert.areEqual(jt('testCell1').cell().id, 'testCell1', "jt().cell() should return itself for cells");
    }      
});
var tc_jt_data = new YAHOO.tool.TestCase({
    name: "jt_data",
    testDataTable: function() {
        assert.areEqual(jt('testTable').data(10,10) === undefined, true, "jt().data() should pass undefined for cells out of bounds");
        assert.areEqual(jt('testTable').data(0,0), 'USA', "jt().cell(0,0) should return the first cell contents");
        assert.areEqual(jt('testTable').data(1,3), 120, "jt().cell(0,0) should return the relevant cell");
    },
    testDataHeader: function() {
        assert.areEqual(jt('testColHeader').data(10) === undefined, true, "jt() should pass undefined for cells out of bounds");
        assert.areEqual(jt('testColHeader').data(0), 100, "jt().data(0) should return the first cell data");
        assert.areEqual(jt('testColHeader').data(1), 50, "jt().data(1) should return the relevant cell data");
    },
    testDataCell: function() {
        assert.areEqual(jt('testCell1').data(), 100, "jt().data() should return its contents");
    }      
});
var tc_jt_headercell = new YAHOO.tool.TestCase({
    name: "jt_headercell",
    testHeaderCellTable: function() {
        assert.areEqual(jt('testTable').headerCell(1).id, 'testColHeader', "jt().headerCell() didn't return the correct header cell");
        assert.areEqual(jt('testTable').headerCell(100) === undefined, true, "jt().headerCell() should return undefined if it doesn't find the cell");
    },
    testHeaderCellHeader: function() {
        assert.areEqual(jt('testColHeader').headerCell().id, 'testColHeader', "jt().headerCell should return itself");
    },
    testHeaderCellCell: function() {
        assert.areEqual(jt('testCell1').headerCell().id, 'testColHeader', "jt().headerCell() should return the header cell of a cell");
    }      
});
var tc_jt_headerdata = new YAHOO.tool.TestCase({
    name: "jt_headerdata",
    testHeaderDataTable: function() {
        assert.areEqual(jt('testTable').headerData(1), 'Q1', "jt().headerData() didn't return the correct header cell");
        assert.areEqual(jt('testTable').headerData(100) === undefined, true, "jt().headerData() should return undefined if it doesn't find the cell");
    },
    testHeaderDataHeader: function() {
        assert.areEqual(jt('testColHeader').headerData(), 'Q1', "jt().headerData should return its contents");
    },
    testHeaderDataCell: function() {
        assert.areEqual(jt('testCell1').headerData(), 'Q1', "jt().headerData() should return the contents of the relevant header cell");
    }      
});
var tc_jt_table = new YAHOO.tool.TestCase({
    name: "jt_table",
    testTableTable: function() {
        assert.areEqual(jt('testTable').table().id, 'testTable', "jt().table() should return itself");
    },
    testTableHeader: function() {
        assert.areEqual(jt('testColHeader').table().id, 'testTable', "jt().table() should return the parent table");
    },
    testTableCell: function() {
        assert.areEqual(jt('testCell1').table().id, 'testTable', "jt().table() should return the parent table");
    }
});
var tc_jt_datatype = new YAHOO.tool.TestCase({
	name: "jt.datatype",
	testGetTDataType: function() {
	    assert.areEqual(jt('testTable').dataType(0), 'string', "incorrect table data types");
	    assert.areEqual(jt('testColHeader').dataType(), 'number', 'incorrect column data types');
	    assert.areEqual(jt('testCell1').dataType(), 'number', 'incorrect column data type');
	}
});
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
	    assert.areEqual(tbl.data(0, 0), 'UK', 'setSort did not sort correctly');
	    assert.areEqual(tbl.data(1, 0), 'France', 'setSort did not sort correctly');
	},
	testSetMultipleSort: function() {
	    var tbl = jTable.t('testTable').setSort([{cellIndex: 2, dir: 'down'}, {cellIndex: 3, dir: 'up'}]);
	    assert.areEqual(tbl.getSort()[1].cellIndex, 3, "setSort did not respect the second cellIndex");
	    assert.areEqual(tbl.getSort()[1].dir, 'up', "setSort did not respect the second dir");
	    assert.areEqual(tbl.data(0, 0), 'France', 'setSort did not multi-sort correctly');
	    assert.areEqual(tbl.data(1, 0), 'USA', 'setSort did not multi-sort correctly');    
	}
});
var tc_jTable_h_sort = new YAHOO.tool.TestCase({
	name: "jTable.h.sort",
	setUp : function () {
	    this.data = jTable.h('testColHeader');
	},
	tearDown : function () {
	    delete this.data;
	    delete this.sort;
	    jTable.h('testColHeader').setSort();
	},
	testSort: function() {
	    jTable.h('testColHeader').setSort('up');
	    assert.areEqual(this.data.getSort(), 'up', "getSort did not reflect setSort");
	    assert.areEqual(this.data.data(0), '50', 'setSort did not sort correctly');
	    assert.areEqual(this.data.data(1), '60', 'setSort did not sort correctly');
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
	    var header = jTable.h('testColHeader').setFilter(/^50|60$/);
	    var rows = jTable.t('testColHeader').tBodies[0].rows;
	    for (var i = 0; i < rows.length; i++) {
	        assert.areEqual(rows[i].className.search("filtered") >= 0, header.data(i) === "100", "setFilter didn't filter properly");
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
	        assert.areEqual(rows[i].className.search("filtered") >= 0, jTable.t('testTable').data(i, 0) == "USA", "setFilter didn't filter properly");
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
var tc_jt_editmode = new YAHOO.tool.TestCase({
	name: "jt.editMode",
	setUp : function () {
	    this.data = jt('testColHeader');
	},
	tearDown : function () {
	    delete this.data;
	},
	testGetEditMode: function () {
	    assert.areEqual(this.data.getEditMode(), false, "jt('testColHeader').getEditMode() should return false");
	},
	testSetEditMode: function() {
	    this.data.setEditMode(true);
	    assert.areEqual(this.data.getElementsByTagName("div").length, 1, "jt.setEditMode() did not make a cell editable");
	    assert.areEqual(this.data.getEditMode(), true, "jt.setEditMode did not update jt.getEditMode");
	    this.data.setEditMode(false);
	}
});
var tc_jTable_h_addremovecolumn = new YAHOO.tool.TestCase({
	name: "jTable.h.addRemoveColumn",
	testAddColumn: function () {
	    jTable.h('testColHeader').addColumn(false);
	    jTable.h('testColHeader').addColumn(true);
	    assert.areEqual(jTable.h('testColHeader').parentNode.cells.length, 7, "jTable.h.addColumn didn't increment the header count");
	},
	testRemoveColumn: function() {
	    jTable.h(jTable.h('testColHeader').nextSibling).deleteColumn();
	    jTable.h(jTable.h('testColHeader').previousSibling).deleteColumn();
	    assert.areEqual(jTable.h('testColHeader').parentNode.cells.length, 5, "jTable.h.addColumn didn't decrement the header count");
	}
});
var tc_jt_addremovecolumn = new YAHOO.tool.TestCase({
	name: "jt.addRemoveColumn",
	testTableAddRemove: function () {
	    jt('testTable').addColumn(false, 1);
	    jt('testTable').addColumn(true, 2);
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 7, "jt.addColumn didn't increment the header count");
	    jt('testTable').deleteColumn(1);
	    jt('testTable').deleteColumn(2);
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 5, "jt.addColumn didn't decrement the header count");
	},
	testHeaderAddRemove: function () {
	    jt('testColHeader').addColumn(false);
	    jt('testColHeader').addColumn(true);
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 7, "jt.addColumn didn't increment the header count");
	    jt(jt('testColHeader').nextSibling).deleteColumn();
	    jt(jt('testColHeader').previousSibling).deleteColumn();
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 5, "jt.addColumn didn't decrement the header count");
	},
	testCellAddRemove: function () {
	    jt('testCell1').addColumn(false);
	    jt('testCell1').addColumn(true);
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 7, "jt.addColumn didn't increment the header count");
	    jt(jt('testCell1').previousSibling).deleteColumn();
	    jt(jt('testCell1').nextSibling).deleteColumn();
	    assert.areEqual(jt('testColHeader').parentNode.cells.length, 5, "jt.addColumn didn't decrement the header count");
	}
});
YAHOO.tool.TestRunner.add(tc_jt_cell);
YAHOO.tool.TestRunner.add(tc_jt_data);
YAHOO.tool.TestRunner.add(tc_jt_headercell);
YAHOO.tool.TestRunner.add(tc_jt_headerdata);
YAHOO.tool.TestRunner.add(tc_jt_table);
YAHOO.tool.TestRunner.add(tc_jt_datatype);
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
YAHOO.tool.TestRunner.add(tc_jt_editmode);
//YAHOO.tool.TestRunner.add(tc_jTable_h_addremovecolumn);
YAHOO.tool.TestRunner.add(tc_jt_addremovecolumn);
var oLogger = new YAHOO.tool.TestLogger(); 
YAHOO.tool.TestRunner.run();