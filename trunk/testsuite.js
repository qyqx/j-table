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
test("column.table", function() {
    equals($('#testTable').column(1).attr("id"), 'testColHeader', "headerCell(col) should return the correct header cell");
    ok($('#testTable').column(100) === undefined, "headerCell(col) should return undefined if col is out of bounds");
});
test("column.header", function() {
    equals($('#testColHeader').column().attr("id"), 'testColHeader', "headerCell should return itself for headers");
});
test("column.cell", function() {
    equals($('#testCell1').column().attr("id"), 'testColHeader', "headerCell() should return the header cell of a cell");
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

module("Table Manipulation");
test("datatype", function() {
    equals($('#testTable').tableDataType(0), 'string', "incorrect table data types");
    equals($('#testColHeader').tableDataType(), 'number', 'incorrect column data types');
    equals($('#testCell1').tableDataType(), 'number', 'incorrect column data type');
});
test("hide.cell", function () {
    ok($('#testCell1').columnHide()[0] === false, "getHide() didn't work");
    $('#testCell1').columnHide(true);
    ok($('#testCell1').columnHide()[0], "setHide() didn't work");
    $('#testCell1').columnHide(false);
});
test("hide.header", function () {
    ok($('#testColHeader').columnHide()[0] === false, "getHide() didn't work");
    $('#testColHeader').columnHide(true);
    ok($('#testColHeader').columnHide()[0], "setHide() didn't work");
    $('#testColHeader').columnHide(false);
});
test("hide.table", function () {
    ok($('#testTable').columnHide(1)[0] === false, "getHide() didn't work");
    $('#testTable').columnHide(1, true);
    ok($('#testTable').columnHide(1)[0], "setHide() didn't work");
    $('#testTable').columnHide(1, false);
});
test("filter.cell", function () {
    ok($('#testCell1').columnFilter()[0] === false, "getFilter() didn't return an empty object");
    var header = $('#testCell1').columnFilter(/^50|60$/).column();
    var i = 0;
    var cell;
    while (true) {
        cell = header.cell(i++);
        if (!cell) {
            break;
        }
        equals(cell.parent().hasClass("filtered"), cell.text() === "100", "setFilter didn't filter properly");
    }
    $('#testCell1').columnFilter(false);
});
test("filter.header", function () {
    ok($('#testColHeader').columnFilter()[0] === false, "getFilter() didn't return an empty object");
    var header = $('#testColHeader').columnFilter(/^50|60$/);
    var i = 0;
    var cell;
    while (true) {
        cell = header.cell(i++);
        if (!cell) {
            break;
        }
        equals(cell.parent().hasClass("filtered"), cell.text() === "100", "setFilter didn't filter properly");
    }
    header.columnFilter(false);
});
test("filter.table", function () {
    ok($('#testTable').columnFilter(1)[0] === false, "getFilter() didn't return an empty object");
    var header = $('#testTable').columnFilter(1, /^50|60$/).column(1);
    var i = 0;
    var cell;
    while (true) {
        cell = header.cell(i++);
        if (!cell) {
            break;
        }
        equals(cell.parent().hasClass("filtered"), cell.text() === "100", "setFilter didn't filter properly");
    }
    $('#testTable').columnFilter(1, false);
});
test("sort.table", function() {
    var table = $('#testTable');
    var myError = "";
    try {
        myError = false;
        table.tableSort("hello");
    } catch (e) {
        myError = true;
    }
    ok(myError, "tableSort(table) should throw error if not passed Array")
    try {
        myError = false;
        table.tableSort([{dir: 'up'}]);
    } catch (e) {
        myError = true;
    }
    ok(myError, "tableSort(table) should throw error if not passed cellIndex")
    try {
        myError = false;
        table.tableSort([{cellIndex: 2, typo: 'up'}]);
    } catch (e) {
        myError = true;
    }
    ok(myError, "tableSort() should throw error if passed incorrect dir")
    //test Single Sort
    table.tableSort([{cellIndex: 1, dir: 'up'}]);
    equals(table.tableSort()[0][0].cellIndex, 1, "setSort did not respect cellIndex");
    equals(table.tableSort()[0][0].dir, 'up', "setSort did not respect dir");
    equals(table.cell(0, 0).text(), 'UK', 'setSort did not sort correctly');
    equals(table.cell(1, 0).text(), 'France', 'setSort did not sort correctly');
    //test Multiple Sort
    table.tableSort([{cellIndex: 2, dir: 'down'}, {cellIndex: 3, dir: 'up'}]);
    equals(table.tableSort()[0][1].cellIndex, 3, "setSort did not respect the second cellIndex");
    equals(table.tableSort()[0][1].dir, 'up', "setSort did not respect the second dir");
    equals(table.cell(0, 0).text(), 'France', 'setSort did not multi-sort correctly');
    equals(table.cell(1, 0).text(), 'USA', 'setSort did not multi-sort correctly');
    //set back to nothing
    table.tableSort([]);
});
test("sort.header", function() {
    var header = $('#testColHeader');
    var myError = "";
    try {
        myError = false;
        header.tableSort("hello");
    } catch (e) {
        myError = true;
    }
    ok(myError, "tableSort() should throw error if passed incorrect dir")
    //test Single Sort
    header.tableSort('up');
    equals(header.tableSort()[0], "up", "setSort didn't sort");
    equals(header.cell(0).text(), '50', 'setSort did not sort correctly');
    equals(header.cell(1).text(), '60', 'setSort did not sort correctly');
    //set back to nothing
    header.tableSort('');
});
test("sort.cell", function() {
    var cell = $('#testCell1');
    var header = cell.column();
    var myError = "";
    try {
        myError = false;
        cell.tableSort("hello");
    } catch (e) {
        myError = true;
    }
    ok(myError, "tableSort() should throw error if passed incorrect dir")
    //test Single Sort
    cell.tableSort('up');
    equals(cell.tableSort()[0], "up", "setSort didn't sort");
    equals(header.cell(0).text(), '50', 'setSort did not sort correctly');
    equals(header.cell(1).text(), '60', 'setSort did not sort correctly');
    //set back to nothing
    cell.tableSort('');
});
test("editMode.table", function () {
    var table = $('#testTable');
    ok(table.cellEditMode() === undefined, "table.cellEditMode() should return undefined");
});
test("editMode.header", function () {
    var cell = $('#testColHeader');
    var myError = "";
    try {
        myError = false;
        cell.cellEditMode("hello");
    } catch (e) {
        myError = true;
    }
    ok(myError, "table.editMode(x) should throw error");
    ok(cell.cellEditMode()[0] === false, "editMode() should return false");
    cell.cellEditMode(true);
    ok(cell.cellEditMode()[0], "editMode() should return true");
    equals(cell.get()[0].getElementsByTagName("div").length, 1, "editMode() did not make a cell editable");
    cell.cellEditMode(false);
    equals(cell.cellEditMode()[0], false, "editMode() should return back to false");
});
test("editMode.cell", function () {
    var cell = $('#testCell1');
    try {
        myError = false;
        cell.cellEditMode("hello");
    } catch (e) {
        myError = true;
    }
    ok(myError, "table.editMode(x) should throw error");    
    ok(cell.cellEditMode()[0] === false, "editMode() should return false");
    cell.cellEditMode(true);
    ok(cell.cellEditMode()[0], "editMode() should return true");
    equals(cell.get()[0].getElementsByTagName("div").length, 1, "editMode() did not make a cell editable");
    cell.cellEditMode(false);
    equals(cell.cellEditMode()[0], false, "editMode() should return back to false");
});
test("addRemoveColumn.table", function() {
    var table = $('#testTable');
    table.columnAdd(1, false);
    table.columnAdd(2, true)
    equals($('#testColHeader').get()[0].parentNode.cells.length, 7, "jt.columnAdd didn't increment the header count");
    table.columnRemove(1);
    table.columnRemove(2);
    equals($('#testColHeader').get()[0].parentNode.cells.length, 5, "jt.columnRemove didn't decrement the header count");
});
test("addRemoveColumn.header", function() {
    var header = $('#testColHeader');
    header.columnAdd(false);
    header.columnAdd(true)
    equals(header.get()[0].parentNode.cells.length, 7, "jt.columnAdd didn't increment the header count");
    header.next().columnRemove();
    header.prev().columnRemove();
    equals(header.get()[0].parentNode.cells.length, 5, "jt.columnRemove didn't decrement the header count");
});
test("addRemoveColumn.cell", function() {
    var cell = $('#testCell1');
    cell.columnAdd(false);
    cell.columnAdd(true)
    equals(cell.get()[0].parentNode.cells.length, 7, "jt.columnAdd didn't increment the header count");
    cell.next().columnRemove();
    cell.prev().columnRemove();
    equals(cell.get()[0].parentNode.cells.length, 5, "jt.columnRemove didn't decrement the header count");
});
