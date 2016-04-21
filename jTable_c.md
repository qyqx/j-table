jTable.c returns a DOM table cell object that's extended with useful members.

## Initialisation ##
You create a new object by passing it a single parameter, _cell_. _cell_ can be a string containing the id of the cell or of any element inside the cell. Or, you could also set _cell_ to the standard table cell DOM object. If no such id or object is found, then the object is set to `undefined`.

For example, using our standard [example table](introduction.md):

```
var a = jTable.c('tbl_tbody_tr0_2');
var b = jTable.c(document.getElementById('tbl_tbody_tr0_2'));
var c = jTable.c('tbl');
//a and b refer to the same object; c is undefined
```

## Members ##
At root, jTable.c is a DOM table cell object, so [normal methods](http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-64060425) like `jTable.c('tbl_tbody_tr0_2').cellIndex` will work fine.

### getTextContent ###
getTextContent() is a member function that accepts no parameters and returns the text content of the cell. This is a utility function that returns textContent for browsers that follow the W3C standard, and innerText for Internet Explorer.

Example: `jTable.c('tbl_tbody_tr0_2').getTextContent() === '80'; //true`

### setEditMode(bool) ###
setEditMode(bool) is a utility function that sets the cell to editable or not, depending on the value of the boolean parameter. Any user can then type or edit the cell contents, using the browser user interface. This is achieved by toggling a `<div contentEditable="true">` inside the cell, enveloping the cell contents.

Example: `jTable.c('tbl_tbody_tr0_2').setEditMode(true); //set to editable`

### getEditMode() ###
getEditMode() is a member function that accepts no parameters and returns a boolean value that indicates whether the cell is currently editable or not. See setEditMode() above for details.

Example: `jTable.c('tbl_tbody_tr0_2').getEditMode(); `