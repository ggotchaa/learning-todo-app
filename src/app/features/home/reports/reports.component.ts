import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ApiEndpointService } from '../../../core/services/api.service';
import { HomeFiltersService } from '../services/home-filters.service';
import { BiddingReport } from './bidding-report.interface';

interface ReportsRow {
  id: number;
  name: string;
  totalBidVolume: number;
  totalBidVolumePr: number;
  totalBidVolumePp: number;
  weightedAvgPr: number | null;
  weightedAvgPp: number | null;
  month: string;
  year: number;
  historyFiles: string[];
  reportFile: string;
  reportLink: string;
  status: string;
  locked: boolean;
  exception: boolean;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit, OnDestroy {
  private static readonly MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ] as const;

  selectedMonth = '';
  selectedYear!: number;

  reports$!: Observable<ReportsRow[]>;

  private readonly subscription = new Subscription();

  constructor(
    private readonly apiEndpoints: ApiEndpointService,
    private readonly filters: HomeFiltersService
  ) {
    this.selectedMonth = this.filters.selectedMonth;
    this.selectedYear = this.filters.selectedYear;

    this.subscription.add(
      this.filters.selectedMonth$.subscribe((month) => (this.selectedMonth = month))
    );
    this.subscription.add(
      this.filters.selectedYear$.subscribe((year) => (this.selectedYear = year))
    );
  }

  ngOnInit(): void {
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  statusClass(status: string | null | undefined): string {
    const normalized = String(status ?? '').toLowerCase();
    switch (normalized) {
      case 'active':
        return 'status status--active';
      case 'pending':
        return 'status status--pending';
      case 'complete':
      case 'completed':
      case 'closed':
        return 'status status--complete';
      default:
        return 'status';
    }
  }

  exceptionClass(hasException: boolean): string {
    return hasException ? 'exception-chip exception-chip--active' : 'exception-chip';
  }

  trackByReportId(_: number, row: ReportsRow): number {
    return row.id;
  }

  // data
  private loadReports(): void {
    this.reports$ = this.apiEndpoints
      .getBiddingReports()
      .pipe(
        map((reports) => reports.map((report) => this.mapReport(report))),
        shareReplay({ bufferSize: 1, refCount: true })
      );
  }

  private mapReport(report: BiddingReport): ReportsRow {
    return {
      id: report.id,
      name: report.reportName,
      totalBidVolume: report.totalVolume,
      totalBidVolumePr: report.totalPropaneVolume,
      totalBidVolumePp: report.totalButaneVolume,
      weightedAvgPr: report.weightedAvgPropanePrice,
      weightedAvgPp: report.weightedAvgButanePrice,
      month: this.toMonthName(report.reportMonth),
      year: report.reportYear,
      historyFiles: report.previousReportLink ? [report.previousReportLink] : [],
      reportFile: report.fileName,
      reportLink: report.filePath,
      status: report.status,
      locked: this.isLocked(report.status),
      exception: report.reportName.toLowerCase().includes('exception')
    };
  }

  private toMonthName(monthIndex: string): string {
    const monthNumber = Number(monthIndex);
    if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return monthIndex;
    }
    return ReportsComponent.MONTH_NAMES[monthNumber - 1] ?? monthIndex;
  }

  private isLocked(status: string | null | undefined): boolean {
    const normalized = String(status ?? '').toLowerCase();
    return normalized === 'active' || normalized === 'pending';
  }
}
