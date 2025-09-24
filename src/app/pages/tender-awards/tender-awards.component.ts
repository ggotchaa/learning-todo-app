import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgIconsModule } from '@ng-icons/core';
import { Subscription } from 'rxjs';

import { DateSelectionService } from '../../services/date-selection.service';
import { DataService } from '../../services/data.service';
import { AwardData, TableData } from '../../shared/interfaces';

interface ColumnConfig {
  key: string;
  label: string;
}

@Component({
  selector: 'app-tender-awards',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    NgIconsModule
  ],
  templateUrl: './tender-awards.component.html',
  styleUrls: ['./tender-awards.component.css']
})
export class TenderAwardsComponent implements OnInit, OnDestroy {
  selectedMonth = 'September';
  selectedYear = '2024';
  activeTab: 'Initiate' | 'History' | 'Active' = 'Initiate';

  awardsColumns: ColumnConfig[] = [
    { key: 'col1', label: 'Product' },
    { key: 'col2', label: 'Bidder' },
    { key: 'col3', label: 'Region' },
    { key: 'col4', label: 'Status' },
    { key: 'col5', label: 'Month' },
    { key: 'col6', label: 'Bid Volume' },
    { key: 'col7', label: 'Proposed Price' },
    { key: 'col8', label: 'Rank per Price' },
    { key: 'col9', label: '12 Month RLF' },
    { key: 'col10', label: 'Award Volume' },
    { key: 'col11', label: 'Final Award Volume' },
    { key: 'comments', label: 'Comments' }
  ];

  historyColumns: ColumnConfig[] = [
    { key: 'col1', label: 'Bidder' },
    { key: 'col2', label: 'Status' },
    { key: 'col3', label: 'Volume PR' },
    { key: 'col4', label: 'Volume BT' },
    { key: 'col5', label: 'Additional PR' },
    { key: 'col6', label: 'Additional BT' },
    { key: 'col7', label: 'Nominated PR' },
    { key: 'col8', label: 'Nominated BT' },
    { key: 'col9', label: 'Lifted PR' },
    { key: 'col10', label: 'Lifted BT' },
    { key: 'col11', label: 'Performance' },
    { key: 'col12', label: 'Comments' }
  ];

  secondaryColumns: ColumnConfig[] = [
    { key: 'col1', label: 'Product' },
    { key: 'col2', label: 'Bidder' },
    { key: 'col3', label: 'Region' },
    { key: 'col4', label: 'Status' },
    { key: 'col5', label: 'Month' },
    { key: 'col6', label: 'Bid Volume' },
    { key: 'col7', label: 'Proposed Price' },
    { key: 'col8', label: 'Rank per Price' },
    { key: 'col9', label: '12 Month RLF' },
    { key: 'col10', label: 'Award Volume' },
    { key: 'col11', label: 'Final Award Volume' },
    { key: 'col12', label: 'Comments' }
  ];

  readonly awardsColumnKeys = this.awardsColumns.map(column => column.key);
  readonly historyColumnKeys = this.historyColumns.map(column => column.key);
  readonly secondaryColumnKeys = this.secondaryColumns.map(column => column.key);

  awardsData: AwardData[] = [];
  secondTableData: TableData[] = [];
  historyTableData: TableData[] = [];

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
    this.awardsData = this.dataService.getAwardsData();
    this.secondTableData = this.dataService.getSecondTableData();
    this.historyTableData = this.dataService.getHistoryTableData();
  }

  setTab(tab: 'Initiate' | 'History' | 'Active'): void {
    this.activeTab = tab;
  }

  valueFor(row: AwardData | TableData, key: string): unknown {
    return row[key as keyof (AwardData | TableData)];
  }
}