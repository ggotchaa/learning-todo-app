import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgIcon } from '@ng-icons/core';
import { ReportData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, NgIcon],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';

  displayedColumns = [
    'name',
    'vl',
    'vl2',
    'vibt',
    'avg',
    'avgB',
    'month',
    'year',
    'history',
    'report',
    'status',
    'locked',
    'exception',
    'delete'
  ];

  reportsData: ReportData[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] || changes['selectedYear']) {
      this.loadData();
    }
  }

  loadData(): void {
    this.reportsData = this.dataService.getReportsData({
      month: this.selectedMonth !== 'None' ? this.selectedMonth : undefined,
      year: this.selectedYear
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-chip status-active';
      case 'Pending':
        return 'status-chip status-pending';
      case 'Complete':
        return 'status-chip status-complete';
      default:
        return 'status-chip status-default';
    }
  }
}
