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
var tc_jt_hide = new YAHOO.tool.TestCase({
    name: "jt.hide",
    testHeaderHide: function () {
        assert.areEqual(jt('testColHeader').getHide(), false, "jt().getHide() didn't work");
        jt('testColHeader').setHide(true);
        assert.areEqual(jt('testColHeader').getHide(), true, "jt().setHide() didn't work");
        jt('testColHeader').setHide(false);
    },
    testTableHide: function () {
        assert.areEqual(jt('testTable').getHide(1), false, "jt().getHide() didn't work");
        jt('testTable').setHide(true, 1);
        assert.areEqual(jt('testTable').getHide(1), true, "jt().setHide() didn't work");
        jt('testTable').setHide(false, 1);
    }
});
var tc_jt_filter = new YAHOO.tool.TestCase({
    name: "jt.filter",
    testHeaderFilter: function () {
        assert.areEqual(jt('testColHeader').getFilter(), undefined, "jt().getFilter() didn't return an empty object");
        var header = jt('testColHeader').setFilter(/^50|60$/);
        var rows = jt('testTable').tBodies[0].rows;
        for (var i = 0; i < rows.length; i++) {
            assert.areEqual(rows[i].className.search("filtered") >= 0, header.data(i) === "100", "setFilter didn't filter properly");
        }
        jt('testColHeader').setFilter();
    },
    testTableFilter: function () {
        assert.areEqual(jt('testTable').getFilter(1), undefined, "jt().getFilter() didn't return an empty object");
        var header = jt('testTable').setFilter(/^50|60$/, 1).headerCell(1);
        var rows = jt('testTable').tBodies[0].rows;
        for (var i = 0; i < rows.length; i++) {
            assert.areEqual(header.cell(i).parentNode.className.search("filtered") >= 0, header.data(i) === "100", "setFilter didn't filter properly");
        }
        jt('testTable').setFilter(undefined, 1);
    }
});
var tc_jt_tablesort = new YAHOO.tool.TestCase({
	name: "jt.tablesort",
	setUp : function () {
	    this.data = jt('testTable').getSort();
	},
	tearDown : function () {
	    delete this.data;
	    jt('testTable').setSort([]);
	},
	_should: {
	    error: {
	        testSetSortNoArray: TypeError,
	        testSetSortNoCellIndex: TypeError,
	        testSetSortNoDir: TypeError
	    }	
	},
	testGetSort: function () {
	    assert.isArray(this.data, "table.getSort() should return an array");
	    for (var i=0; i<this.data.length; i++) {
	        assert.isNumber(this.data[i].cellIndex, "cellIndex should be a number");
	        assert.isString(this.data[i].dir, "dir should be a string");
	    }
	},
	testSetSortNoArray: function() {
	    jt('testTable').setSort('hello');	
	},
	testSetSortNoCellIndex: function() {
	    jt('testTable').setSort([{dir: 'up'}]);
	},
	testSetSortNoDir: function() {
	    jt('testTable').setSort([{cellIndex: 2, typo: 'up'}]);
	},
	testSetSingleSort: function() {
	    var tbl = jt('testTable').setSort([{cellIndex: 1, dir: 'up'}]);
	    assert.areEqual(tbl.getSort()[0].cellIndex, 1, "setSort did not respect cellIndex");
	    assert.areEqual(tbl.getSort()[0].dir, 'up', "setSort did not respect dir");
	    assert.areEqual(tbl.data(0, 0), 'UK', 'setSort did not sort correctly');
	    assert.areEqual(tbl.data(1, 0), 'France', 'setSort did not sort correctly');
	},
	testSetMultipleSort: function() {
	    var tbl = jt('testTable').setSort([{cellIndex: 2, dir: 'down'}, {cellIndex: 3, dir: 'up'}]);
	    assert.areEqual(tbl.getSort()[1].cellIndex, 3, "setSort did not respect the second cellIndex");
	    assert.areEqual(tbl.getSort()[1].dir, 'up', "setSort did not respect the second dir");
	    assert.areEqual(tbl.data(0, 0), 'France', 'setSort did not multi-sort correctly');
	    assert.areEqual(tbl.data(1, 0), 'USA', 'setSort did not multi-sort correctly');    
	}
});
var tc_jt_headersort = new YAHOO.tool.TestCase({
	name: "jt.headersort",
	setUp : function () {
	    this.data = jt('testColHeader');
	},
	tearDown : function () {
	    delete this.data;
	    delete this.sort;
	    jt('testColHeader').setSort();
	},
	testSort: function() {
	    jt('testColHeader').setSort('up');
	    assert.areEqual(this.data.getSort(), 'up', "getSort did not reflect setSort");
	    assert.areEqual(this.data.data(0), '50', 'setSort did not sort correctly');
	    assert.areEqual(this.data.data(1), '60', 'setSort did not sort correctly');
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
YAHOO.tool.TestRunner.add(tc_jt_hide);
YAHOO.tool.TestRunner.add(tc_jt_filter);
YAHOO.tool.TestRunner.add(tc_jt_tablesort);
YAHOO.tool.TestRunner.add(tc_jt_headersort);
YAHOO.tool.TestRunner.add(tc_jt_editmode);
YAHOO.tool.TestRunner.add(tc_jt_addremovecolumn);
var oLogger = new YAHOO.tool.TestLogger(); 
YAHOO.tool.TestRunner.run();