import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-filter-search',
  styleUrls: ['./ngx-filter-search.component.scss'],
  templateUrl: './ngx-filter-search.component.html',
})

export class NgxFilterSearchComponent implements OnInit {
  @Input() data: any;
  @Input() config: any;
  @Output() filteredData: EventEmitter<any> = new EventEmitter();
  public tempFilter: any = {};
  public searchText: any;
  public filterData: any;
  public allSelectedFilters: any = [];
  public filter = 'all';
  public sort = 'lot_number_low';
  public isSorted: boolean = false;
  public defaultFilter = 'all';
  public defaultSort = 'lot_number_low';
  public defaultSearch = '';
  public selectedLotStatusFilter: any;

  public value: number = 30;
  public tooltip: Object = { placement: 'Before', isVisible: true, showOn: 'Always' };
  public ticks: Object = { placement: 'After', largeStep: 20, smallStep: 10, showSmallTicks: true };
  public step: number = 50;
  constructor() { }

  ngOnInit(): void {
    if(this.data && this.config) {
      this.setFilterConfig(this.data);
      this.filterData = this.data;
    } else {
      console.log('please Add the data and config')
    }
  }

  setFilterConfig(data: any) {
    for (let i = data.length - 1; i >= 0; i--) {
      let statusName;
      data[i]['statusName'] = statusName;
      // Create the key for the custom fields.... Add the custom_ before each custom filed name...
      if (data[i].customFields && !_.isEmpty(data[i].customFields)) {
        const customFields = data[i].customFields;
          for (const item in customFields) {
            if (customFields[item].showFilter) {
              // Create the unique key for the custom fields.
             let key = 'custom_'+item;
             // Change the config for the the display name want to show different.
              const c = _.get(this.config.fieldsConfigCustomChanges, key)
              if(c) {
                // Code for adding the empty data as the not dated lots....
                const value = customFields[item].value == c.value ? c.replaceValue : customFields[item].value;
                const name =  customFields[item].value == c.value ? c.displayName : customFields[item].value;
                data[i]['custom_'+customFields[item].name] = value;
                data[i]['custom_display_'+customFields[item].name] = name;
              } else {
                data[i]['custom_'+customFields[item].name] = customFields[item].value
              }
            }
          }
      }
      this.setCheckBoxFilter(data[i]);
    }
    this.sortCheckBoxesFilter();
  }
  setCheckBoxFilter(data: any) {
    // Checked the filter parameter
    if(this.config.filter && this.config.filter.filterParameter ) {
      for(let j = this.config.filter.filterParameter.length -1; j >= 0; j--) {
        var configIndex = this.config.filter.filterParameter[j];
        if (configIndex.isShowFilter) {
          var key = configIndex.filterBy;
          var isRangeFilterWithDiffValue = false;
          if (data.hasOwnProperty(configIndex.lowValueFieldValue) &&  data.hasOwnProperty(configIndex.highValueFieldValue)) {
                isRangeFilterWithDiffValue = true;
                } else {
                  isRangeFilterWithDiffValue = false;
                }
          if (data.hasOwnProperty(key) || isRangeFilterWithDiffValue) {
             if (this.tempFilter.hasOwnProperty(key)) {
               if ((data[configIndex.fieldName] && data[configIndex.fieldValue]) || (isRangeFilterWithDiffValue)) {
                let obj: any = {};
                if (configIndex.filterType == 'checkBoxes') {
                  obj['filterBy'] = key;
                  obj['fieldName'] = data[configIndex.fieldName];
                  obj['fieldValue'] =  configIndex.dataType == Number ?  Number(data[configIndex.fieldValue]): data[configIndex.fieldValue];
                  obj['isChecked'] = false;
                  //console.log( obj['fieldValue'], 'OBJ FIELDS VALUE')
                  var self = this;
                  var isPresent = this.tempFilter[key].some(function(el: any){ return el['fieldValue'] == data[self.config.filter.filterParameter[j].fieldValue]});
                  if (!isPresent) {
                    self.tempFilter[self.config.filter.filterParameter[j].filterBy].push(obj);
                  }
                } else if(configIndex.filterType == 'range_slider') {
                    let previousMin = this.tempFilter[key].minValue;
                    let previousMax = this.tempFilter[key].maxValue;
                    let currentMinValue =  Number(data[configIndex.lowValueFieldValue]);
                    let currentMaxValue =  Number(data[configIndex.highValueFieldValue]);
                    let min = previousMin < currentMinValue ? previousMin : currentMinValue;
                    let max = previousMax > currentMaxValue ? previousMax : currentMaxValue;
                    this.tempFilter[key]['minValue'] = min;
                    this.tempFilter[key]['maxValue'] = max;
                    this.tempFilter[key]['rangeValue'] = [];
                    this.tempFilter[key]['defaultRangeValue'] = [];
                    this.tempFilter[key]['dropDownRangeValues'] = [];
                    this.tempFilter[key]['rangeValue'].push(min);
                    this.tempFilter[key]['rangeValue'].push(max);
                    let smallStep = configIndex.step ? (configIndex.step * 2) : 100
                    let largeStep = configIndex.step || 50;
                    let diff = max - min;
                    this.tempFilter[key]['smallStep'] = diff / smallStep ;
                    this.tempFilter[key]['largeStep'] = diff / largeStep ;
                    this.tempFilter[key]['ticks'] = { placement: 'After', largeStep: diff / largeStep  , smallStep: diff / smallStep, showSmallTicks: true, showLargeTicks: false };
                    this.tempFilter[key]['defaultRangeValue'].push(min);
                    this.tempFilter[key]['defaultRangeValue'].push(max);
                    this.tempFilter[key]['dropDownRangeValues'].push(min);
                    this.tempFilter[key]['dropDownRangeValues'].push(max);
                    this.tempFilter[key]['rangeStep'] = smallStep //diff / smallStep;
                  //   filterArrayRangeFilter
                  // showOn: 'Always'
                  this.tempFilter[key]['dropdown'] = [];
                  let dropdownValue = min;
                   for (let k = 0; k <= smallStep; k ++) {
                    this.tempFilter[key]['dropdown'].push(dropdownValue);
                     dropdownValue = (diff / smallStep) + dropdownValue;
                   }
                   this.tempFilter[key]['dropdown'] = _. uniq(this.tempFilter[key]['dropdown'])
                  }
               }
             } else {
                let obj: any = {};
                if (configIndex.isShowFilter) {
                  if ((data[configIndex.fieldName] && data[configIndex.fieldValue]) || (isRangeFilterWithDiffValue)) {
                    this.tempFilter[key] = [];
                    this.tempFilter[key]['filterTitle'] = configIndex.filterTitle;
                    this.tempFilter[key]['isShowFilter'] = configIndex.isShowFilter;
                    this.tempFilter[key]['filterBy'] = key;
                    this.tempFilter[key]['filterValuesSorting'] = configIndex.filterValuesSorting;
                    this.tempFilter[key]['filterSortDirection'] = configIndex.filterSortDirection;
                    this.tempFilter[key]['isShowMore'] = false;
                    this.tempFilter[key]['filterCheckBoxLimit'] = configIndex.filterCheckBoxLimit;
                    this.tempFilter[key]['filterType'] = configIndex.filterType;
                    if (configIndex.filterType == 'checkBoxes') {
                      obj['filterBy'] = key;
                      obj['fieldName'] = data[configIndex.fieldName];
                      obj['fieldValue'] =  configIndex.dataType == Number ?  Number(data[configIndex.fieldValue]): data[configIndex.fieldValue];
                      obj['isChecked'] = false;
                      this.tempFilter[key].push(obj);
                    } else if(configIndex.filterType == 'range_slider') {
                      this.tempFilter[key]['filterByLowValue'] = configIndex.filterByLowValue;
                      this.tempFilter[key]['filterByHighValue'] = configIndex.filterByHighValue;
                      this.tempFilter[key]['rangeValue'] = [];
                      this.tempFilter[key]['defaultRangeValue'] = [];
                      this.tempFilter[key]['dropDownRangeValues'] = [];
                      let min = Number(data[configIndex.lowValueFieldValue]);
                      let max = Number(data[configIndex.highValueFieldValue]);
                      this.tempFilter[key]['minValue'] = min;
                      this.tempFilter[key]['maxValue'] = max
                      this.tempFilter[key]['rangeValue'].push(min);
                      this.tempFilter[key]['rangeValue'].push(max);
                      this.tempFilter[key]['defaultRangeValue'].push(min);
                      this.tempFilter[key]['defaultRangeValue'].push(max);
                      this.tempFilter[key]['dropDownRangeValues'].push(min);
                      this.tempFilter[key]['dropDownRangeValues'].push(max);
                      let step = configIndex.step || 100;
                      this.tempFilter[key]['dropdown'] = [];
                      this.tempFilter[key]['rangeStep'] =  configIndex.step * 2;//(min + max) / step;
                    }
                  }
                }
             }
          }
        }
      }
    }
  }

  sortCheckBoxesFilter() {
    for(let j = this.config.filter.filterParameter.length -1; j >= 0; j--) {
      if (this.config.filter.filterParameter[j].isShowFilter) {
           if (this.tempFilter.hasOwnProperty(this.config.filter.filterParameter[j].filterBy)) {
             if (this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterValuesSorting
              && this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterSortDirection
              && this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterType == 'checkBoxes'
              ) {
                 let sortDirection = _.lowerCase(this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterSortDirection);
                 sortDirection = sortDirection == 'asc'  ? sortDirection : 'desc';
                 let direction: any = [];
                 direction.push(sortDirection);
                 let pickArray = _.pick(this.tempFilter[this.config.filter.filterParameter[j].filterBy], ['filterTitle', 'isShowFilter', 'filterBy', 'filterValuesSorting',
                 'filterSortDirection', 'isShowMore', 'filterCheckBoxLimit', 'filterType']);
                 const sorted = _.orderBy(this.tempFilter[this.config.filter.filterParameter[j].filterBy] , ['fieldValue'], direction);
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy] = sorted;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterTitle'] = pickArray.filterTitle;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['isShowFilter'] = pickArray.isShowFilter;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterBy'] =pickArray.filterBy;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterValuesSorting'] = pickArray.filterValuesSorting;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterSortDirection'] = pickArray.filterSortDirection;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['isShowMore'] = false;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterCheckBoxLimit'] = pickArray.filterCheckBoxLimit;
                 this.tempFilter[this.config.filter.filterParameter[j].filterBy]['filterType'] = pickArray.filterType;
              }
          }
        }
      }
  }


  applyFilter() {
    // Assign the original array without any filter to the newLots
    var newLots = this.data;
      // Check the searchText is not undefined and then search the by provided fields.
      if (this.searchText !== undefined) {
        this.searchText = this.searchText.toLocaleLowerCase();
        var mainSearchArray = [];
          // Search In the all fields given in the config of the search.
          for (let j = this.config.search.searchParameter.length -1; j >= 0; j--) {
            let searchArray = []
            searchArray =  this.data.filter((it: any) => {
              if (it[this.config.search.searchParameter[j].searchBy] != null && it[this.config.search.searchParameter[j].searchBy] != undefined) {
                return it[this.config.search.searchParameter[j].searchBy].toLocaleLowerCase().includes(this.searchText);
              }
          });

          // Push the each search result...
          if (searchArray.length > 0) {
            mainSearchArray.push(...searchArray);
          }
          // Assign the searched Array to the lots Array.
          newLots = mainSearchArray;
        }
      }

      var allSelectedCheckBoxesArray = [];
      var allSelectedRangeFilterArray = [];
      // Check the config for the filter....
      for(let j = this.config.filter.filterParameter.length -1; j >= 0; j--) {
        // Check the status of the filter
        if (this.config.filter.filterParameter[j].isShowFilter) {
          if (this.tempFilter.hasOwnProperty(this.config.filter.filterParameter[j].filterBy) && this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterType == 'checkBoxes') {
            // Filter the checked Values
            this.selectedLotStatusFilter =  this.tempFilter[this.config.filter.filterParameter[j].filterBy].filter((value: any, index: any) => {
                return value.isChecked
              });
            // Push the all checked values in same array
            allSelectedCheckBoxesArray.push(this.selectedLotStatusFilter);
          } else if(this.tempFilter.hasOwnProperty(this.config.filter.filterParameter[j].filterBy) && this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterType == 'range_slider') {
            // If filter type is the Range filter then push the data in the range filter.
            allSelectedRangeFilterArray.push(this.tempFilter[this.config.filter.filterParameter[j].filterBy]);
          }
        }
      }

      let singleTypeFilterArray = [];
      this.allSelectedFilters = allSelectedCheckBoxesArray;
      //Filter the data based on checkboxes
      if (allSelectedCheckBoxesArray.length > 0) {
      // Filter the each array at a time, In config multiple filters.
       singleTypeFilterArray = this.filterSingle(newLots ,allSelectedCheckBoxesArray);
       newLots = singleTypeFilterArray;
      } else {
        newLots = newLots;
      }

      let singleRangeSliderFilter = [];
      // Filter the data based on the range filter.
      if (allSelectedRangeFilterArray.length > 0) {
      // Filter the each array at a time, In config multiple filters.
       singleRangeSliderFilter = this.filterSingleRangeFilter(newLots , allSelectedRangeFilterArray);
        newLots = singleRangeSliderFilter;
      } else {
        newLots = newLots;
      }

      this.filterData = [];
      this.filterData = newLots;

      // Check the Sorting is applied if Yes then sort the array after filter.
      if (this.isSorted) {
        //this.sortLots();
      } else {
        this.filteredData.emit(this.filterData);
      }
  }

  filterSingle(data: any, selectedCheckBoxesArrays: any ) {
    for (let k = selectedCheckBoxesArrays.length -1; k >= 0; k--) {
      var newData = [];
      if (selectedCheckBoxesArrays[k].length > 0) {
        data = this.filterArrayBasedOnCheckBoxes(data, selectedCheckBoxesArrays[k])
         if (data.length > 0) {
          newData.push(...data);
          data = newData;
       } else {
         data = [];
       }
      }
    }
    return this.uniqueValuesInArray(data);
  }


  filterSingleRangeFilter(data: any, selectedRangeFilterArrays: any ) {
    for (let k = selectedRangeFilterArrays.length -1; k >= 0; k--){
      var newData = [];
      if (_.isObject(selectedRangeFilterArrays[k])) {
        data = this.filterArrayRangeFilter(data, selectedRangeFilterArrays[k]);
         if (data.length > 0) {
          newData.push(...data);
          data = newData;
          } else {
            data = [];
          }
       }
    }
    return this.uniqueValuesInArray(data);
  }

  filterArrayBasedOnCheckBoxes (lotsArray: any, selectedCheckBoxesArrays: any) {
    var filtered: any = [];
    for (var lots in lotsArray) {
      if (selectedCheckBoxesArrays.length > 0) {
          selectedCheckBoxesArrays.forEach((element: any) => {
            if (lotsArray[lots][element.filterBy] == element.fieldValue ){
              if (filtered.length > 0) {
                  filtered.push(lotsArray[lots]);
              } else {
                filtered.push(lotsArray[lots]);
              }
            }
        });
      }
    }
    return this.uniqueValuesInArray(filtered);
  }

  uniqueValuesInArray(data: any ) {
    const uniqueValues = data.filter((element: any, index: number) =>
    data.findIndex( (obj: any) => obj[this.config.filter.uniqueColumn] == element[this.config.filter.uniqueColumn]) == index);
    return uniqueValues;
  }



  filterArrayRangeFilter (lotsArray: any, rangeFilterArrays: any) {
    var filtered = [];
    for (var lots in lotsArray) {
      let min = rangeFilterArrays.rangeValue[0];
      let max = rangeFilterArrays.rangeValue[1];
      let minValueIndex = Number(lotsArray[lots][rangeFilterArrays.filterByLowValue]);
      let maxValueIndex = Number(lotsArray[lots][rangeFilterArrays.filterByHighValue]);
      if ((minValueIndex >= min && minValueIndex <= max && maxValueIndex >= min && maxValueIndex <= max)){
          filtered.push(lotsArray[lots]);
      }
    }
    return this.uniqueValuesInArray(filtered);
  }

  clearSingleFilters(filterBy: string , filterType?: any) {
    if (filterBy && filterType == 'checkBoxes') {
      this.unCheckedCheckBoxes(this.tempFilter[filterBy])
    } else if (filterBy && filterType == 'range_slider') {
      this.clearRangeSliderFilter(this.tempFilter[filterBy]);
    }
    this.applyFilter();
  }

  clearAllFilters() {
    this.filterData = [];
    this.sort = this.defaultSort;
    this.searchText = this.defaultSearch;
    for(let j = this.config.filter.filterParameter.length -1; j >= 0; j--) {
      if (this.config.filter.filterParameter[j].isShowFilter) {
           if ((this.tempFilter.hasOwnProperty(this.config.filter.filterParameter[j].filterBy) &&
           (this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterType === 'checkBoxes'))) {
            this.unCheckedCheckBoxes(this.tempFilter[this.config.filter.filterParameter[j].filterBy]);
          } else if ((this.tempFilter.hasOwnProperty(this.config.filter.filterParameter[j].filterBy) &&
           (this.tempFilter[this.config.filter.filterParameter[j].filterBy].filterType === 'range_slider'))) {
            this.clearRangeSliderFilter(this.tempFilter[this.config.filter.filterParameter[j].filterBy])
           }
        }
      }
    this.filterData = this.data;
    this.filteredData.emit(this.filterData);
  }

  unCheckedCheckBoxes(data: any) {
    data.forEach((element: any) => {
      element.isChecked = false;
    })
  }

  clearRangeSliderFilter(data: any) {
    data.rangeValue = data.defaultRangeValue;
    data.dropDownRangeValues = [];
    data.dropDownRangeValues = data.defaultRangeValue;
  }

  showMoreItems(filterBy: string,showStatus: boolean) {
    if(showStatus) {
      this.tempFilter[filterBy]['filterCheckBoxLimit'] = this.tempFilter[filterBy].length;
      this.tempFilter[filterBy]['isShowMore'] = true;
    } else if(!showStatus) {
      this.tempFilter[filterBy]['isShowMore'] = false;
    }
  }


  rangeDropDownOnChange(data: any) {
    data.rangeValue = data.dropDownRangeValues;
    this.applyFilter();
  }

  sliderChange(data: any | undefined) {
    data.dropDownRangeValues = data.rangeValue
  }
}
