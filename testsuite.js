module("Table Traversal");
test("cell.table", function() {
    ok($('#testTable').cell(10,10) === undefined, "cell(row, col) should pass undefined for cells out of bounds");
    equals($('#testTable').cell(0,1).attr("id"), 'testCell1', "cell(0,1) should return the correct cell");
    equals($('#testTable').cell(1,3).attr("id"), 'testCell2', "cell(1,3) should return the relevant cell");
});
test("cell.header", function() {
    ok($('#testColHeader').cell(10) === undefined, "cell(row) should pass undefined for cells out of bounds");
    equals($('#testColHeader').cell(0).attr("id"), 'testCell1', "cell(0) should return the first cell");
    equals($('#testColHeader').cell(1).attr("id"), 'testCell3', "cell(1) should return the relevant cell");
});
test("cell.cell", function() {
    equals($('#testCell1').cell().attr("id"), 'testCell1', "cell() should return itself for cells");  
});
test("data.table", function() {
    ok($('#testTable').data(10,10) === undefined, "data(row, col) should pass undefined for cells out of bounds");
    equals($('#testTable').data(0,0), 'USA', "data(0,0) should return the first cell contents");
    equals($('#testTable').data(1,3), 120, "data(1,3) should return the relevant cell contents");
});
test("data.header", function() {
    ok($('#testColHeader').data(10) === undefined, "data(row) should pass undefined for cells out of bounds");
    equals($('#testColHeader').data(0), 100, "data(0) should return the first cell data");
    equals($('#testColHeader').data(1), 50, "data(1) should return the relevant cell data");
});
test("data.cell", function() {
    equals($('#testCell1').data(), 100, "data() should return its contents for cells");
});
test("headercell.table", function() {
    equals($('#testTable').headerCell(1).attr("id"), 'testColHeader', "headerCell(col) should return the correct header cell");
    ok($('#testTable').headerCell(100) === undefined, "headerCell(col) should return undefined if col is out of bounds");
});
test("headercell.header", function() {
    equals($('#testColHeader').headerCell().attr("id"), 'testColHeader', "headerCell should return itself for headers");
});
test("headercell.cell", function() {
    equals($('#testCell1').headerCell().attr("id"), 'testColHeader', "headerCell() should return the header cell of a cell");
});
test("headerdata.table", function() {
    equals($('#testTable').headerData(1), 'Q1', "headerData(col) didn't return the correct header contents");
    ok($('#testTable').headerData(100) === undefined, ".headerData(col) should return undefined if col is out of bounds");
});
test("headerdata.header", function() {
    equals($('#testColHeader').headerData(), 'Q1', "headerData should return its contents for a header");
});
test("headerdata.cell", function() {
    equals($('#testCell1').headerData(), 'Q1', "headerData() should return the contents of the relevant header cell");
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
    equals($('#testTable').dataType(0), 'string', "incorrect table data types");
    equals($('#testColHeader').dataType(), 'number', 'incorrect column data types');
    equals($('#testCell1').dataType(), 'number', 'incorrect column data type');
});
test("hide.header", function () {
    equals($('#testColHeader').getHide(), false, "getHide() didn't work");
    $('#testColHeader').setHide(true);
    equals($('#testColHeader').getHide(), true, "setHide() didn't work");
    $('#testColHeader').setHide(false);
});
test("hide.table", function () {
    equals($('#testTable').getHide(1), false, "getHide() didn't work");
    $('#testTable').setHide(true, 1);
    equals($('#testTable').getHide(1), true, "setHide() didn't work");
    $('#testTable').setHide(false, 1);
});
test("filter.header", function () {
    equals($('#testColHeader').getFilter(), undefined, "getFilter() didn't return an empty object");
    var header = $('#testColHeader').setFilter(/^50|60$/);
    var rows = $('#testTable').tBodies[0].rows;
    for (var i = 0; i < rows.length; i++) {
       equals(rows[i].className.search("filtered") >= 0, header.data(i) === "100", "setFilter didn't filter properly");
    }
    $('#testColHeader').setFilter();
});
test("filter.table", function () {
    equals($('#testTable').getFilter(1), undefined, "getFilter() didn't return an empty object");
    var header = $('#testTable').setFilter(/^50|60$/, 1).headerCell(1);
    var rows = $('#testTable').tBodies[0].rows;
    for (var i = 0; i < rows.length; i++) {
        equals(header.cell(i).parentNode.className.search("filtered") >= 0, header.data(i) === "100", "setFilter didn't filter properly");
    }
    $('#testTable').setFilter(undefined, 1);
});