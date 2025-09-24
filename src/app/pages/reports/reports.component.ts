import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { Subscription } from 'rxjs';

import { DateSelectionService } from '../../services/date-selection.service';
import { DataService } from '../../services/data.service';
import { ReportData } from '../../shared/interfaces';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatTableModule, NgIconsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  selectedMonth = 'September';
  selectedYear = '2024';

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

  private selectionSubscription?: Subscription;

  constructor(private dataService: DataService, private dateSelection: DateSelectionService) {}

  ngOnInit(): void {
    this.selectionSubscription = this.dateSelection.selection$.subscribe(({ month, year }) => {
      this.selectedMonth = month;
      this.selectedYear = year;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.selectionSubscription?.unsubscribe();
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