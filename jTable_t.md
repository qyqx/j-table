jTable.t returns a DOM table object for <table> elements that's extended with useful members for sorting, filtering and hiding the columns.<br>
<br>
<h2>Initialisation</h2>
You create a new object by passing it a single parameter, <i>cell</i>. <i>cell</i> can be a string containing the id of the tabls or of any element inside it. Or, you could also set <i>cell</i> to the table DOM object. If no such id or object is found, then the object is set to <code>undefined</code>.<br>
<br>
For example, using our standard <a href='Introduction.md'>example table</a>:<br>
<br>
<pre><code>var a = jTable.t('tbl');<br>
var b = jTable.t(document.getElementById('tbl'));<br>
var c = jTable.t('tbl_thead_th1');<br>
//a, b and c refer to the same object<br>
</code></pre>

<h2>Members</h2>
At root, jTable.t is a <a href='http://developer.mozilla.org/en/docs/DOM:table'>DOM table object</a>, so normal methods like <code>jTable.t('tbl_thead_th1').tHead</code> will work fine.<br>
<br>
<h3>hCells</h3>
hCells is an array containing all the table headers (i.e. <th> elements inside the <thead>), extended using <a href='jTable_h.md'>jTable.h</a>. It's a utility function for accessing the headers and connecting between jTable.t and jTable.h.<br>
<br>
Example: <code>jTable.t('tbl').hCells[0].getSort() // uses the getSort() member of jTable.h</code>

<h3>getSort()</h3>
getSort() is a member function that accepts no parameters and returns an array representing the sort state of each table header. Headers not sorted are left out of the array, which consists of objects like {cellIndex: x, dir: y}. Here, x represents the header cellIndex, and y can be 'up' or 'down' depending on the sort direction.<br>
<br>
Example: <code>jTable.t('tbl').getSort(); // this might return [{cellIndex: 0, dir: 'up'}] if only the first column is sorted, and it is sorted up</code>

<h3>setSort(aSort)</h3>
setSort(aSort) is a member function that sorts the table according to the parameter passed. aSort is an array of objects like {cellIndex: x, dir: y}. Here, x represents the header cellIndex, and y can be 'up' or 'down' depending on the sort direction. You can sort on multiple headers by passing more than one value in the array.<br>
<br>
Example 1: <code>jTable.t('tbl').setSort([{cellIndex: 0, dir: 'up'}]); // this sorts the table by the first column in ascending order</code>

Example 2: <code>jTable.t('tbl').setSort([{cellIndex: 0, dir: 'up'}, {cellIndex: 1, dir: 'down'}]); // this sorts the table by the first column in ascending order, and then by the second column in descending order</code>

setSort returns the revised jTable.t object.<br>
<br>
<h3>dataType()</h3>
dataType() is a member function that accepts no parameters and returns an array of data types, one for each header in the table. Possible data types are "string" and "number". The value is calculated by matching cells in the column against regular expressions.<br>
<br>
Example: <code>jTable.t('tbl').dataType(); //returns ['string', 'number', 'number', 'number', 'number']</code>

<h3>getHide()</h3>
getHide() is a member function that accepts no parameters and returns an array of each of the cellIndexes that are currently hidden.<br>
<br>
Example: <code>jTable.t('tbl').getHide(); //returns [1,2] if the second and third columns are currently hidden</code>

<h3>setHide(hide)</h3>
setHide(hide) is a member function that accepts an array of cellIndexes that should be hidden. All cellIndexes not in the array are unhidden.<br>
<br>
Example: <code>jTable.t('tbl').setHide([1,2]); //this hides the second and third columns, and shows all the others</code>

setHide returns the revised jTable.t object.<br>
<br>
<h3>getFilter()</h3>
getFilter() is a member function that accepts no parameters and returns an array representing all the filters currently active on the table. Each object in the array is of the form {cellIndex: x, filter: y} where x is the cellIndex filtered and y is a regular expression. If no filter is currently in place, getFilter returns <code>[]</code>.<br>
<br>
Example: <code>jTable.t('tbl').getFilter(); // this might return [{cellIndex: 0, filter: /^USA$/}] if the first column is the only filter, and the filter is for the string "USA"</code>

<h3>setFilter(filters)</h3>
setFilter(filters) is a member function that sets a filter on each column indicated in the <code>filters</code> array. You pass it an array of objects of the form {cellIndex: x, filter: y} where x is the cellIndex filtered and y is a regular expression.<br>
<br>
Example 1: <code>jTable.t('tbl').setFilter([{cellIndex: 1, filter: /^100$/}]); //filters just the second column for the exact string "100"</code>

Example 2: <code>jTable.t('tbl').setFilter([{cellIndex: 1, filter: /^100$/}, {cellIndex: 2, filter: /^80$/}]); //filters the second column for the exact string "100" and the third column for the exact string "80"</code>

setFilter returns the revised jTable.h object.<br>
<br>
<h2>Notes</h2>
Every "setter" member function returns the header object, so you can chain them.<br>
<br>
Example: <code>jTable.t('tbl').setSort([{cellIndex: 0, dir: 'up'}]).setFilter([{cellIndex: 1, filter: /^100$/}]).setHide([3])</code>