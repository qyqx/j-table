module("Table Traversal");
test("cell.table", function() {
    ok($('#testTable').tableCell(10,10) === undefined, "cell(row, col) should pass undefined for cells out of bounds");
    equals($('#testTable').tableCell(0,1).attr("id"), 'testCell1', "cell(0,1) should return the correct cell");
    equals($('#testTable').tableCell(1,3).attr("id"), 'testCell2', "cell(1,3) should return the relevant cell");
});
test("cell.header", function() {
    ok($('#testColHeader').tableCell(10) === undefined, "cell(row) should pass undefined for cells out of bounds");
    equals($('#testColHeader').tableCell(0).attr("id"), 'testCell1', "cell(0) should return the first cell");
    equals($('#testColHeader').tableCell(1).attr("id"), 'testCell3', "cell(1) should return the relevant cell");
});
test("cell.cell", function() {
    equals($('#testCell1').tableCell().attr("id"), 'testCell1', "cell() should return itself for cells");  
});
test("data.table", function() {
    ok($('#testTable').tableData(10,10) === undefined, "data(row, col) should pass undefined for cells out of bounds");
    equals($('#testTable').tableData(0,0), 'USA', "data(0,0) should return the first cell contents");
    equals($('#testTable').tableData(1,3), 120, "data(1,3) should return the relevant cell contents");
});
test("data.header", function() {
    ok($('#testColHeader').tableData(10) === undefined, "data(row) should pass undefined for cells out of bounds");
    equals($('#testColHeader').tableData(0), 100, "data(0) should return the first cell data");
    equals($('#testColHeader').tableData(1), 50, "data(1) should return the relevant cell data");
});
test("data.cell", function() {
    equals($('#testCell1').tableData(), 100, "data() should return its contents for cells");
});
test("headercell.table", function() {
    equals($('#testTable').tableHeaderCell(1).attr("id"), 'testColHeader', "headerCell(col) should return the correct header cell");
    ok($('#testTable').tableHeaderCell(100) === undefined, "headerCell(col) should return undefined if col is out of bounds");
});
test("headercell.header", function() {
    equals($('#testColHeader').tableHeaderCell().attr("id"), 'testColHeader', "headerCell should return itself for headers");
});
test("headercell.cell", function() {
    equals($('#testCell1').tableHeaderCell().attr("id"), 'testColHeader', "headerCell() should return the header cell of a cell");
});
test("headerdata.table", function() {
    equals($('#testTable').tableHeaderData(1), 'Q1', "headerData(col) didn't return the correct header contents");
    ok($('#testTable').tableHeaderData(100) === undefined, "headerData(col) should return undefined if col is out of bounds");
});
test("headerdata.header", function() {
    equals($('#testColHeader').tableHeaderData(), 'Q1', "headerData should return its contents for a header");
});
test("headerdata.cell", function() {
    equals($('#testCell1').tableHeaderData(), 'Q1', "headerData() should return the contents of the relevant header cell");
});
test("table.table", function() {
    equals($('#testTable').table().attr("id"), 'testTable', "table() should return itself for tables");
});
test("table.header", function() {
    equals($('#testColHeader').table().attr("id"), 'testTable', "table() should return the parent table for headers");
});
test("table.cell", function() {
    equals($('#testCell1').table().attr("id"), 'testTable', "table() should return the parent table for cells");
});

module("DataType, Hide, Filter");
test("datatype", function() {
    equals($('#testTable').tableDataType(0), 'string', "incorrect table data types");
    equals($('#testColHeader').tableDataType(), 'number', 'incorrect column data types');
    equals($('#testCell1').tableDataType(), 'number', 'incorrect column data type');
});
test("hide.cell", function () {
    ok($('#testCell1').tableHide()[0] === false, "getHide() didn't work");
    $('#testCell1').tableHide(true);
    ok($('#testCell1').tableHide()[0], "setHide() didn't work");
    $('#testCell1').tableHide(false);
});
test("hide.header", function () {
    ok($('#testColHeader').tableHide()[0] === false, "getHide() didn't work");
    $('#testColHeader').tableHide(true);
    ok($('#testColHeader').tableHide()[0], "setHide() didn't work");
    $('#testColHeader').tableHide(false);
});
test("hide.table", function () {
    ok($('#testTable').tableHide(1)[0] === false, "getHide() didn't work");
    $('#testTable').tableHide(1, true);
    ok($('#testTable').tableHide(1)[0], "setHide() didn't work");
    $('#testTable').tableHide(1, false);
});
test("filter.cell", function () {
    equals($('#testCell1').tableFilter()[0], false, "getFilter() didn't return an empty object");
    var header = $('#testCell1').tableFilter(/^50|60$/).tableHeaderCell();
    var i = 0;
    var cell;
    while (true) {
        cell = header.tableCell(i++);
        if (!cell) {
            break;
        }
        equals(cell.hasClass("filtered"), cell.tableData() === "100", "setFilter didn't filter properly");
    }
    $('#testCell1').tableFilter(false);
});
test("filter.header", function () {
    equals($('#testColHeader').tableFilter()[0], false, "getFilter() didn't return an empty object");
    var header = $('#testColHeader').tableFilter(/^50|60$/);
    var i = 0;
    var cell;
    while (true) {
        cell = header.tableCell(i++);
        if (!cell) {
            break;
        }
        equals(cell.hasClass("filtered"), cell.tableData() === "100", "setFilter didn't filter properly");
    }
    header.tableFilter(false);
});
test("filter.table", function () {
    equals($('#testTable').tableFilter(1)[0], false, "getFilter() didn't return an empty object");
    var header = $('#testTable').tableFilter(1, /^50|60$/).tableHeaderCell(1);
    var i = 0;
    var cell;
    while (true) {
        cell = header.tableCell(i++);
        if (!cell) {
            break;
        }
        equals(cell.hasClass("filtered"), cell.tableData() === "100", "setFilter didn't filter properly");
    }
    $('#testTable').tableFilter(1, false);
});
test("sort.table)", function() {
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