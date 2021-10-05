
##  How to use the ngx-filter-search package
- #### Install the package
` npm install ngx-filter-search`
-  #### Use package in your project
-  ##### After installing the library you need to import the library in your project.

 1. Import Package in the module file

`  import { NgxFilterSearchModule } from 'ngx-filter-search'; `

 2.  add the package in the import section.

 `imports: [ NgxFilterSearchModule ] `

- #####  Create the configuration for the filter and search

  Create the configuration file or configuration variable , in configuration file create the json object.
  The example configuration file shown below, you can add filter you want by adding the values in the config.


```
export const filterConfig = {
    search: {
                isSearchShow: true,
                searchParameter: [
                   {
                       searchBy: 'Brand',
                   },
                   .
				   .
				   .
                ]
            },
    filter: {
        isShowFilter: true,
        // This Id is required, and used for finding the unique arrays.
        // Unique column (Ex . Auto increment Id)
        uniqueColumn: 'id',
        filterParameter:  [
            {   // FilterBy - It should be unique in the JSON and  node should contain in the data provided
                //(For checkboxes filter node should filterBy in data)
                filterBy: 'Brand',
                // isShowFilter - true for showing the filter.
                isShowFilter: true,
                // filterTitle - it is Name for the filter
                filterTitle: 'Brand',
                // fieldName - Name of the field we are showing after the checkbox.
                fieldName: 'Brand',
                //fieldValue - Field value is used for actual filtering the data
                fieldValue: 'Brand',
                // filterValuesSorting - Sorting the filter (All checkboxes is sorting)
                filterValuesSorting: true,
                //filterSortDirection - Direction of the sorting (ASC or DESC)
                filterSortDirection: 'asc',
                // filterType - Type of the filter (checkboxes or range_filter)
                filterType: 'checkBoxes',
                //filterCheckBoxLimit- Shows the minimum checkboxes at once....
                filterCheckBoxLimit: 10,
                //default the comparison is done with respect to the string datatype for, if needed we can pass the datatype as a Number
                //dataType: Number

            },
            {
                filterBy: 'Country',
                isShowFilter: true,
                filterTitle: 'Country',
                fieldName: 'Country',
                fieldValue: 'Country',
                filterValuesSorting: true,
                filterSortDirection: 'asc',
                filterType: 'checkBoxes',
                // dataType: Number,
                // Shows the minimum checkboxes at once....
                filterCheckBoxLimit: 10,
            },
           .
		   .
		   .
		   .
        ]
    },
```




- #### Add the code in the template file , to render the filter

`<ngx-filter-search [config]="config" [data]="newRestaurants" (filteredData)="filterOutput($event)"><ngx-filter-search> `

- ##### Add the function in the .ts file to get the filter data

`filterOutput($event) {
    if ($event) {
        this.filteredData= $event;
        }
    }
  `

Assign the $event to the any variable you want to shows in the template.