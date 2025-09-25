import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { HomeFiltersService } from '../services/home-filters.service';

type TenderTab = 'Initiate' | 'History' | 'Active';

interface DataColumn {
  key: string;
  label: string;
}

interface DataRow {
  [key: string]: string | number;
}

@Component({
  selector: 'app-tender-awards',
  templateUrl: './tender-awards.component.html',
  styleUrls: ['./tender-awards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenderAwardsComponent implements OnDestroy {
  activeTab: TenderTab = 'Initiate';

  readonly historyColumns: DataColumn[] = [
    { key: 'period', label: 'Period' },
    { key: 'awards', label: 'Awards' },
    { key: 'volume', label: 'Volume' },
    { key: 'status', label: 'Status' }
  ];

  readonly historyTableData: DataRow[] = [
    { period: 'Oct 2023', awards: 12, volume: '1,240', status: 'Complete' },
    { period: 'Nov 2023', awards: 9, volume: '980', status: 'Active' },
    { period: 'Dec 2023', awards: 11, volume: '1,105', status: 'Draft' }
  ];

  readonly awardsColumns: DataColumn[] = [
    { key: 'reference', label: 'Reference' },
    { key: 'bidder', label: 'Bidder' },
    { key: 'score', label: 'Score' },
    { key: 'status', label: 'Status' }
  ];

  readonly awardsData: DataRow[] = [
    { reference: 'TA-1045', bidder: 'Atlas Energy', score: '86%', status: 'Active' },
    { reference: 'TA-1046', bidder: 'Orion Logistics', score: '78%', status: 'Review' }
  ];

  readonly secondTableData: DataRow[] = [
    { reference: 'TA-0934', bidder: 'Northwind Corp', score: '92%', status: 'Complete' },
    { reference: 'TA-0931', bidder: 'Summit Holdings', score: '88%', status: 'Archive' }
  ];

  readonly secondaryColumns: DataColumn[] = this.awardsColumns;

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

  get historyColumnKeys(): string[] {
    return this.historyColumns.map((column) => column.key);
  }

  get awardsColumnKeys(): string[] {
    return this.awardsColumns.map((column) => column.key);
  }

  get secondaryColumnKeys(): string[] {
    return this.secondaryColumns.map((column) => column.key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setTab(tab: TenderTab): void {
    this.activeTab = tab;
  }

  valueFor(row: DataRow, key: string): string | number {
    return row[key];
  }
}
