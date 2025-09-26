import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { HomeFiltersService } from '../services/home-filters.service';

interface ReportsRow {
  name: string;
  totalBidVolume: number;
  totalBidVolumePr: number;
  totalBidVolumePp: number;
  weightedAvgPr: number;
  weightedAvgPp: number;
  month: string;
  year: number;
  historyFiles: string[];
  reportFile: string;
  status: 'Active' | 'Pending' | 'Complete';
  locked: boolean;
  exception: boolean;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnDestroy {
  readonly reportsData: ReportsRow[] = [
    {
      name: 'RoK LPG Tender Awards Analysis January 2020',
      totalBidVolume: 10360,
      totalBidVolumePr: 5203,
      totalBidVolumePp: 18.17,
      weightedAvgPr: 0.94,
      weightedAvgPp: 17.35,
      month: 'January',
      year: 2020,
      historyFiles: ['history_001.pdf', 'log_001.txt'],
      reportFile: 'report_001.pdf',
      status: 'Pending',
      locked: false,
      exception: true
    },
    {
      name: 'RoK LPG Tender Awards Analysis March 2020',
      totalBidVolume: 12080,
      totalBidVolumePr: 6640,
      totalBidVolumePp: 19.64,
      weightedAvgPr: 1.06,
      weightedAvgPp: 18.42,
      month: 'March',
      year: 2020,
      historyFiles: ['history_002.pdf', 'notes_003.docx'],
      reportFile: 'report_002.pdf',
      status: 'Complete',
      locked: true,
      exception: false
    },
    {
      name: 'RoK LPG Tender Awards Analysis October 2022',
      totalBidVolume: 9870,
      totalBidVolumePr: 5480,
      totalBidVolumePp: 17.08,
      weightedAvgPr: 0.89,
      weightedAvgPp: 16.74,
      month: 'October',
      year: 2022,
      historyFiles: ['history_003.pdf', 'log_004.txt'],
      reportFile: 'report_003.pdf',
      status: 'Active',
      locked: false,
      exception: true
    },
    {
      name: 'RoK LPG Tender Awards Analysis November 2022',
      totalBidVolume: 9745,
      totalBidVolumePr: 5342,
      totalBidVolumePp: 16.88,
      weightedAvgPr: 0.92,
      weightedAvgPp: 16.09,
      month: 'November',
      year: 2022,
      historyFiles: ['history_004.pdf', 'log_005.txt'],
      reportFile: 'report_004.pdf',
      status: 'Pending',
      locked: true,
      exception: false
    },
    {
      name: 'RoK LPG Tender Awards Analysis December 2022',
      totalBidVolume: 11030,
      totalBidVolumePr: 6021,
      totalBidVolumePp: 18.92,
      weightedAvgPr: 1.04,
      weightedAvgPp: 17.86,
      month: 'December',
      year: 2022,
      historyFiles: ['history_005.pdf', 'notes_006.docx'],
      reportFile: 'report_005.pdf',
      status: 'Complete',
      locked: false,
      exception: true
    },
    {
      name: 'RoK LPG Tender Awards Analysis January 2023',
      totalBidVolume: 12560,
      totalBidVolumePr: 7125,
      totalBidVolumePp: 19.74,
      weightedAvgPr: 1.12,
      weightedAvgPp: 18.65,
      month: 'January',
      year: 2023,
      historyFiles: ['history_006.pdf', 'log_007.txt'],
      reportFile: 'report_006.pdf',
      status: 'Complete',
      locked: true,
      exception: false
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
      case 'Pending':
        return 'status status--pending';
      case 'Complete':
        return 'status status--complete';
      default:
        return 'status';
    }
  }

  exceptionClass(hasException: ReportsRow['exception']): string {
    return hasException ? 'exception-chip exception-chip--active' : 'exception-chip';
  }
}
