import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnInit {

  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;

   ELEMENT_DATA: any = [
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 },
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 },
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 },
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 },
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 },
    { name: 'Sachin Tendulkar', age: 42, },
    { name: 'Virat Kohli', age: 30 }
  ];
  displayedColumns: string[] = ['name', 'age'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  age = new FormControl();
  name = new FormControl();
  private filterValues = { name: '', age: '' }

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor() { 
    this.dataSource.filterPredicate = this.tableFilter();
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit() {
    this.totalSize = this.ELEMENT_DATA.length;
    this.name.valueChanges
      .subscribe(
        name => {
          this.filterValues.name = name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.age.valueChanges
      .subscribe(
        id => {
          this.filterValues.age = id;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
        && data.age.toString().toLowerCase().indexOf(searchTerms.age) !== -1
        // && data.colour.toLowerCase().indexOf(searchTerms.colour) !== -1
        // && data.pet.toLowerCase().indexOf(searchTerms.pet) !== -1;
    }
    return filterFunction;
  } 

}
