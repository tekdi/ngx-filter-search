
# Angular Filter Search

## Demo

![Alt Text](https://raw.githubusercontent.com/Nilesh5995/ngx-filter-search/main/demo/npm-filter-search-demo.gif)

## Dependencies
* Bootstrap CSS 3 or 4

## Install

* Install with [npm](https://www.npmjs.com): `npm install ngx-filter-search`.

## Usage

Import `NgxFilterSearchModule` into your @NgModule.

```js
import { NgxFilterSearchModule } from 'ngx-filter-search';
@NgModule({
  // ...
  imports: [
    NgxFilterSearchModule,
  ]
  // ...
})

```

##  Create the configuration for the filter and search



```javascript
export filterConfig = {
  "search": {
              "isSearchShow": true,
              "searchParameter": [
                 {
                     "searchBy": "Brand",
                 },
                 {
                     "searchBy": "Country",
                 },
              ]
          },
  "filter": {
      "isShowFilter": true,
      // This Id is required, and used for finding the unique arrays.
      // Unique column (Ex . Auto increment Id)
      "uniqueColumn": "id",
      "filterParameter":  [
          {   // FilterBy - It should be unique in the JSON and  node should contain in the data provided
              //(For checkboxes filter node should filterBy in data)
              "filterBy": "Brand",
              // isShowFilter - true for showing the filter.
              "isShowFilter": true,
              // filterTitle - it is Name for the filter
              "filterTitle": "Brand",
              // fieldName - Name of the field we are showing after the checkbox.
              "fieldName": "Brand",
              //fieldValue - Field value is used for actual filtering the data
              "fieldValue": "Brand",
              // filterValuesSorting - Sorting the filter (All checkboxes is sorting)
              "filterValuesSorting": true,
              //filterSortDirection - Direction of the sorting (ASC or DESC)
              "filterSortDirection": "asc",
              // filterType - Type of the filter (checkboxes or range_filter)
              "filterType": "checkBoxes",
              //filterCheckBoxLimit- Shows the minimum checkboxes at once....
              "filterCheckBoxLimit": 10,
              //default the comparison is done with respect to the string datatype for, if needed we can pass the datatype as a Number
              //dataType: Number

          },
          {
              "filterBy": "Country",
              "isShowFilter": true,
              "filterTitle": "Country",
              "fieldName": "Country",
              "fieldValue": "Country",
              "filterValuesSorting": true,
              "filterSortDirection": "asc",
              "filterType": "checkBoxes",
              // dataType: Number,
              // Shows the minimum checkboxes at once....
              "filterCheckBoxLimit": 10,
          },
      ]
  },
}

```


## Configuration Values

|  Item             | Description                                |  Value     |
| --------------------- | ------------------------------------------ | ----------------  |
| search   | Add the all search related configuration             | Object (Json object contains the all search related config|
| isSearchShow              | For Hide or Shows the search        | boolean (true or false)       |
| searchBy (in searchParameter) |  Add the all nodes which you want tp apply search     | string ex - searchBy: 'Brand' |
| filter               | Text for "checked" with single item selected (used in dynamic title)    | Object |
| isShowFilter         |  Hide or shows the all filters  | Boolean (True or False) |
| uniqueColumn     | Unique columns for the search and filter   | String Ex -  uniqueColumn: 'id' (required)      |
| filterParameter          | Array of the all filters | Array         |
| FilterBy           | It should be unique in the data and  node should contain in the data provided | String Ex. filterBy: 'Brand' |
| isShowFilter     | Hide or shows the particular filter  | true or false |
| filterTitle    | Title of the filter | String |
| fieldName | Name of the field we are showing after the checkbox. | String |
| filterValuesSorting | Sorting the filters (Checkbox) | Boolean  |
| filterType | Type of the filter (checkboxes or range_filter)| String |
|filterCheckBoxLimit | Shows the minimum checkboxes at once.... | Number |
|dataType | default the comparison is done with respect to the string datatype for, if needed we can pass the datatype as a Number | String or Number |


## Define options in your consuming component:
- ### in component file (.ts)

```js
export class MyClass implements OnInit {
    // Original data (Which is fetch from the API)
    public data;
    // Data after the filtered (which you need to shows in the template)
    public filteredData;
    ngOnInit() {
    }

    filterOutput($event) {
    if ($event) {
        this.filteredData= $event;
        }
    }
}
```

- ### Template (HTML)
```html
<ngx-filter-search [config]="config" [data]="data" (filteredData)="filterOutput($event)"><ngx-filter-search>
```
* Here Config is a filter and search configuration Ex. Defined like above
* Here data is  object containing the arrays.
* filterOutput is function (output event of the filter) sent the filtered data.