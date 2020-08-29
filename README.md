# [Excel table](https://kristianlentino99.github.io/excel_table/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]

Excel table is a little plugin which allows to have access to a table that resemble Excel's. 

due to several lack of functionality i've taken the original code (it was under MIT Licence) by Chester Charles to improve it. <br>
I'm currently working to improve the plugin to add new features. <br/>
original repository : https://github.com/chestercharles/excel-bootstrap-table-filter

DEMO URL : https://kristianlentino99.github.io/excel_table/


* **Sort rows by column value:** You can sort by clicking on the header or on the dedicated buttons in the filter menu ( A to Z or Z to A). You can sort also date by passing a specific data value on the cell.

* **Search specific values:** You can search for every column a single or multiple values, it allows you to combine  different types of filters

* **Multiple instances:** You can create multiple instances of excel table. all the instances are completely indipendent from each other.


```js
    $('#table1').excelTableFilter();
    $('#table2').excelTableFilter();
```
## Options

Below a little table containing all the parameters that you can currently pass;


option      | default  | description
----------- | -------- | -----------
column_selector |    ''      | if this property is set it will search only for columns with the setted selector
sort   | `true`   | Wether sort or not the columns
search    | `false`  | Wether sort or not the columns
sortOnHeaderClick  | `false`  | if true it will sort the columns on the header click
captions      | a_to_z: 'A to Z', z_to_a:'Z to A', search:'Search',select_all:'Select all' | you can modify the captions 
spinner | { show:true,icon:'fa fa-spinner fa-spin'} | an object containing the settings for the spinner below the textbox that appear when search with the text field. Keep in mind that when you have few rows the search is too fast to render the spinner.
floatOptions | {decimalSeparator: ',',thousandSeparator:false} | an object containing the settings for the float options, in order to sort the plugin need to know which float are you going to pass.