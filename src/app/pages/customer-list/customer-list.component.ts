import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgIcon } from '@ng-icons/core';
import { ListFilters, TableData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

interface ColumnConfig {
  key: string;
  label: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    NgIcon
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';

  listFilters: ListFilters = {
    multipleCustomers: '',
    customer: '',
    status: '',
    month: '',
    year: '',
    rangeFrom: '',
    rangeTo: ''
  };

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

  columns: ColumnConfig[] = [
    { key: 'col1', label: 'Product' },
    { key: 'col2', label: 'Bidder' },
    { key: 'col3', label: 'Status' },
    { key: 'col4', label: 'Month' },
    { key: 'col5', label: 'Year' },
    { key: 'col6', label: 'Bid Volume' },
    { key: 'col7', label: 'Bid Price' },
    { key: 'col8', label: 'Final Awarded Volume' },
    { key: 'col9', label: 'Volume Takes' },
    { key: 'col10', label: 'Additional Volumes' },
    { key: 'col11', label: '12 Month RLF' },
    { key: 'col12', label: 'Comments' }
  ];

  displayedColumns = this.columns.map(column => column.key);
  listTableData: TableData[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.updateFiltersFromInput();
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] || changes['selectedYear']) {
      this.updateFiltersFromInput();
      this.loadData();
    }
  }

  updateFiltersFromInput(): void {
    this.listFilters.month = this.selectedMonth !== 'None' ? this.selectedMonth.toLowerCase() : '';
    this.listFilters.year = this.selectedYear;
  }

  loadData(): void {
    this.listTableData = this.dataService.getListTableData(this.listFilters);
  }

  updateListFilter(key: keyof ListFilters, value: string): void {
    this.listFilters[key] = value;
    this.loadData();
  }

  resetListFilter(key: keyof ListFilters): void {
    this.listFilters[key] = '';
    this.loadData();
  }

  valueFor(row: TableData, key: string): unknown {
    return row[key];
  }
}
