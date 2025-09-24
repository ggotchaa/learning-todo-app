import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { ListFilters, TableData, SecretTableData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';
  showSecretPopup = false;

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

  listTableData: TableData[] = [];
  secretTableData: SecretTableData[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
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
    this.secretTableData = this.dataService.getSecretTableData();
  }

  updateListFilter(key: keyof ListFilters, value: string): void {
    this.listFilters[key] = value;
    this.loadData();
  }

  resetListFilter(key: keyof ListFilters): void {
    this.listFilters[key] = '';
    this.loadData();
  }

  createRange(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }

  getTableProperty(row: any, colIndex: number): any {
    return row[`col${colIndex}`];
  }

  setShowSecretPopup(show: boolean): void {
    this.showSecretPopup = show;
  }
}