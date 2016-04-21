jTable.h returns a DOM table cell object for <th> elements that's extended with useful members for sorting, filtering and hiding the column.<br>
<br>
<h2>Initialisation</h2>
You create a new object by passing it a single parameter, <i>cell</i>. <i>cell</i> can be a string containing the id of the th cell or of any element inside the cell. Or, you could also set <i>cell</i> to the table cell DOM object. If no such id or object is found, then the object is set to <code>undefined</code>.<br>
<br>
jTable.h represents <th> elements inside the <thead> section of a table - in other words, the column headings.<br>
<br>
For example, using our standard <a href='Introduction.md'>example table</a>:<br>
<br>
<pre><code>var a = jTable.h('tbl_thead_th1');<br>
var b = jTable.h(document.getElementById('tbl_thead_th1'));<br>
var c = jTable.h('tbl');<br>
//a and b refer to the same object; c is undefined<br>
</code></pre>

<h2>Members</h2>
At root, jTable.h is a DOM table cell object, so <a href='http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-64060425'>normal methods</a> like <code>jTable.h('tbl_thead_th1').cellIndex</code> will work fine.<br>
<br>
<h3>getSort()</h3>
getSort() is a member function that accepts no parameters and returns one of three values: 'up', if the column is sorted up; 'down' if the column is sorted down; and <code>undefined</code> if there is no sort.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').getSort();</code>

<h3>setSort(dir)</h3>
setSort(dir) is a member function that sorts the table by this header cell, using the direction passed as a paramter. You can pass 'up' to sort the column up, 'down' to sort the column down, or <code>undefined</code> to remove any sort. We use a comb sort, O(n log n).<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').setSort('up');</code>

setSort returns the revised jTable.h object.<br>
<br>
<h3>dataType()</h3>
dataType() is a member function that accepts no parameters and returns a calculated value that indicates the data type for this column in the table. Current data types are "string" and "number". The value is calculated by matching cells in the column against regular expressions.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').dataType(); //returns 'number'</code>

<h3>getHide()</h3>
getHide() is a member function that accepts no parameters and returns a boolean value indicating whether the column represented by this header cell is hidden or not.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').getHide(); //returns true or false</code>

<h3>setHide(hide)</h3>
setHide(hide) is a member function that accepts a boolean parameter, <i>hide</i>, indicating whether the column represented by the table header should be hidden or not.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').setHide(true); //this hides the second column</code>

setHide returns the revised jTable.h object.<br>
<br>
<h3>getFilter()</h3>
getFilter() is a member function that accepts no parameters and returns a regular expression object indicating the filter on the column represented by the table header. If no filter is currently in place, getFilter returns <code>undefined</code>.<br>
<br>
Example: {{{jTable.h('tbl_thead_th1').getFilter();}}<br>
<br>
<h3>setFilter(filterRegExp)</h3>
setFilter(filterRegExp) is a member function that sets a filter on the column indicated by the table header. You pass it a single parameter, a regular expression. Every row in the table that does not meet this regular expression is hidden.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').setFilter(/^100$/); //filters all rows that don't contain the exact string "100" in this column</code>

setFilter returns the revised jTable.h object.<br>
<br>
<h3>getUniqueValues</h3>
getUniqueValues is a utility function that returns a list, sorted in ascending order with no duplicates, of every value in the column represented by the table header.<br>
<br>
Example: <code>jTable.h('tbl_thead_th1').getUniqueValues(); // returns [100]</code>


<h2>Notes</h2>
Every "setter" member function returns the header object, so you can chain them.<br>
<br>
Example: <code>jTable.h('tbl_thead.th1').setSort('up').setFilter(/^100$/).setHide(false)</code>