import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIcon } from '@ng-icons/core';
import { AwardData, TableData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

interface ColumnConfig {
  key: string;
  label: string;
}

@Component({
  selector: 'app-tender-awards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressBarModule, NgIcon],
  templateUrl: './tender-awards.component.html',
  styleUrls: ['./tender-awards.component.css']
})
export class TenderAwardsComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';
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

  awardsData: AwardData[] = [];
  secondTableData: TableData[] = [];
  historyTableData: TableData[] = [];

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
