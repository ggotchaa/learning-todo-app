import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { Subscription } from 'rxjs';

import { DateSelectionService } from '../../services/date-selection.service';
import { DataService } from '../../services/data.service';
import { ListFilters, TableData } from '../../shared/interfaces';

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
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    NgIconsModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  selectedMonth = 'September';
  selectedYear = '2024';

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

  private selectionSubscription?: Subscription;

  constructor(private dataService: DataService, private dateSelection: DateSelectionService) {}

  ngOnInit(): void {
    this.selectionSubscription = this.dateSelection.selection$.subscribe(({ month, year }) => {
      this.selectedMonth = month;
      this.selectedYear = year;
      this.updateFiltersFromSelection();
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.selectionSubscription?.unsubscribe();
  }

  updateFiltersFromSelection(): void {
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