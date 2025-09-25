import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { HomeFiltersService } from '../services/home-filters.service';

interface ReportsRow {
  name: string;
  vl: number;
  vl2: number;
  vibt: number;
  avg: number;
  avgB: number;
  month: string;
  year: number;
  historyFiles: string[];
  status: 'Active' | 'Draft' | 'Complete';
  locked: boolean;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnDestroy {
  readonly displayedColumns: string[] = [
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

  readonly reportsData: ReportsRow[] = [
    {
      name: 'Monthly Awards Overview',
      vl: 1250,
      vl2: 980,
      vibt: 74,
      avg: 1.24,
      avgB: 1.12,
      month: 'January',
      year: 2024,
      historyFiles: ['Overview.pdf', 'Monthly-Notes.docx'],
      status: 'Active',
      locked: false
    },
    {
      name: 'Bidder Trend Summary',
      vl: 980,
      vl2: 860,
      vibt: 67,
      avg: 1.17,
      avgB: 1.03,
      month: 'February',
      year: 2024,
      historyFiles: ['Summary.xlsx'],
      status: 'Draft',
      locked: true
    },
    {
      name: 'Regional Breakdown',
      vl: 1430,
      vl2: 1205,
      vibt: 81,
      avg: 1.31,
      avgB: 1.2,
      month: 'March',
      year: 2023,
      historyFiles: ['Exports.csv', 'Archive.pdf'],
      status: 'Complete',
      locked: false
    }
  ];

  selectedMonth = '';
  selectedYear!: number;

  private readonly subscription = new Subscription();

  constructor(private readonly filters: HomeFiltersService) {
    this.selectedMonth = this.filters.selectedMonth;
    this.selectedYear = this.filters.selectedYear;

    this.subscription.add(
      this.filters.selectedMonth$.subscribe((month) => (this.selectedMonth = month))
    );

    this.subscription.add(
      this.filters.selectedYear$.subscribe((year) => (this.selectedYear = year))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  statusClass(status: ReportsRow['status']): string {
    switch (status) {
      case 'Active':
        return 'status status--active';
      case 'Draft':
        return 'status status--draft';
      case 'Complete':
        return 'status status--complete';
      default:
        return 'status';
    }
  }
}
