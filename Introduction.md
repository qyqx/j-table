Welcome to jTable, the jQuery plugin for manipulating HTML tables, including hiding, sorting, filtering, editing, adding and removing rows and columns.


## Source files ##
There is only one file containing the library - jquery.jtable.js. All the other files are part of the testsuite, and can be run from testsuite.htm using the directory structure given.

The testsuite uses the standard jUnit module. It also provides a simple demo table with a user interface for sorting, filtering, hiding columns, and editing the table.

The rest of this document explains the API for jTable. To include it in your website, copy the file and include it in your 

&lt;head&gt;

 section, e.g.
` <script src="jquery.jtable.js" type="text/javascript"></script>`

## Example table ##
Throughout this document, I will use the following example table:
```
<table id="tbl" viewas="table">
  <thead id="tbl_thead">
  <tr id="tbl_thead_tr">
    <th id="tbl_thead_th0">Country</th>
    <th id="tbl_thead_th1">Q1</th> 
    <th id="tbl_thead_th2">Q2</th>
    <th id="tbl_thead_th3">Q3</th>
    <th id="tbl_thead_th4">Q4</th>
  </tr>
  </thead>
  <tbody>
  <tr id="tbl_tbody_tr0">
    <th id="tbl_tbody_tr0_0">USA</th>
    <td id="tbl_tbody_tr0_1">100</td>
    <td id="tbl_tbody_tr0_2">80</td>
    <td id="tbl_tbody_tr0_3">110</td>
    <td id="tbl_tbody_tr0_4">150</td>
  </tr>
  <tr id="tbl_tbody_tr1">
    <th id="tbl_tbody_tr1_0">UK</th>
    <td id="tbl_tbody_tr1_1">50</td>
    <td id="tbl_tbody_tr1_2">70</td>
    <td id="tbl_tbody_tr1_3">120</td>
    <td id="tbl_tbody_tr1_4">130</td>
  </tr>
  </tbody>
</table>
```
which displays like this:
| **Country** | **Q1** | **Q2** | **Q3** | **Q4** |
|:------------|:-------|:-------|:-------|:-------|
| USA         | 100    | 80     | 110    | 150    |
| UK          | 50     | 70     | 120    | 130    |

## General Observations ##
All jTable functions are called from the normal jQuery object and obey normal jQuery syntax. For example, jTable functions return arrays that can be chained and filtered, like any other jQuery function.

All jTable function names start with "table", "column" or "cell" - for example, `tableSort()`. That's so you can identify them quickly as part of this jQuery plugin.

jTable is targeted at three DOM elements in particuar: <table>, <th> and <td>. If you call jTable from any other DOM element - for example <code>$('img').tableSort()</code> - then jTable adopts the following rule:<br>
If the <img> is part of a <table>, <th> or <td> element, then it uses that element instead. If not, then the function returns <code>undefined</code>.<br>
<br>
<h2>Table Traversal</h2>
jTable includes some utility functions for traversing the table.<br>
<br>
<h3>table()</h3>
table() returns a jQuery object representing the parent HTML table element.<br>
<br>
Using the example above, <code>$('tbl_tbody_tr0_0').table()</code> returns an array containing the parent HTML <table> element, i.e. <code>[$('#tbl')]</code>.<br>
<br>
Similarly, <code>$('#tbl').table() returns [$('#tbl')]</code>.<br>
<br>
<h3>cell()</h3>
cell() is intended to help you navigate to the correct cell in the table. It returns the jQuery DOM table cell element (<td> or <th>) at the given location. It takes up to two parameters.<br>
<br>
For tables, cell() takes two parameters representing the row and column of the cell. For columns, cell() takes one parameter representing the row. For cells, cell() returns itself.<br>
<br>
For example:<br>
<br>
<code>$('#tbl').cell(0, 1)</code> returns the cell at the first row of the table body, in the second column, which is <code>$('#tbl_tbody_tr0_1')</code>.<br>
<br>
<code>$('#tbl_thead_th1').cell(0)</code> returns the first cell in the relevant column (since tbl_thead_th1 is a header cell), which is <code>$('#tbl_tbody_tr0_1')</code>.<br>
<br>
<code>$('tbl_tbody_tr0_0').cell()</code> returns itself (<code>$('tbl_tbody_tr0_0')</code>), since tbl_tbody_tr0_0 is already a table cell.<br>
<br>
<h3>column()</h3>
column() returns the header cell (<th> element) at the top of the column in question. It takes up to one parameter.<br>
<br>
For tables, column() takes a single parameter, representing the cellIndex of the relevant header cell.<br>
<br>
For table header cells, column() takes no parameters, and returns itself.<br>
<br>
For cell data elements, column() takes no parameters, and returns the table header cell at the top of its column.<br>
<br>
For example:<br>
<br>
<code>$('#tbl').column(1)</code> returns the cell header at the second column, which is <code>$('#tbl_thead_th1')</code>.<br>
<br>
<code>$('#tbl_thead_th1').column()</code> returns itself, since tbl_thead_th1 is already a header cell. which is <code>$('#tbl_thead_th1')</code>.<br>
<br>
<code>$('tbl_tbody_tr0_0').column()</code> returns the cell header at the top of its columnm which is <code>$('#tbl_thead_th1')</code>.<br>
<br>
<h2>Table Manipulation</h2>

<h3>tableHide()</h3>
The tableHide() function can be used to hide a column, or to return its hidden state. It takes up to two parameters. The last parameter can be <code>true</code> or <code>false</code>, in which case the relevant column is hidden or unhidden. If the last parameter is left blank or set to <code>undefined</code>, then the function returns the hidden state.<br>
<br>
For tables, tableHide()'s first parameter represents the cellIndex of the column to hide. For cell headers and table cells, tableHide() does not take a first parameter.<br>
<br>
For example,<br>
<br>
<code>$('#tbl').tableHide(1)</code> returns an array of one boolean value, depending on whether the second column is hidden. In our case, it returns <code>[false]</code>.<br>
<br>
<code>$('#tbl').tableHide(1, true)</code> hides the second column in the table. It returns the table jQuery element.<br>
<br>
<code>$('#tbl_thead_th1').tableHide()</code> returns an array of one boolean value, depending on whether the relevant column is hidden. In our case, it returns <code>[false]</code>.<br>
<br>
<code>$('#tbl_thead_th1').tableHide(true)</code> hides the relevant column. It returns the relevant table header jQuery object.<br>
<br>
<code>$('tbl_tbody_tr0_0').tableHide()</code> returns an array of one boolean value, depending on whether the relevant column is hidden. In our case, it returns <code>[false]</code>.<br>
<br>
<code>$('tbl_tbody_tr0_0').tableHide(true)</code> hides the relevant column. It returns the relevant table cell jQuery object.<br>
<br>
<h3>tableFilter()</h3>
The tableFilter() function gets and sets the relevant filter on the column. Filters are regular expressions that can be used to hide particular rows of the table.