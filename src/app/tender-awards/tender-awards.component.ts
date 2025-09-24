import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { AwardData, TableData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tender-awards',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './tender-awards.component.html',
  styleUrl: './tender-awards.component.css'
})
export class TenderAwardsComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';
  activeSubButton = 'Initiate';

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

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

  setActiveSubButton(button: string): void {
    this.activeSubButton = button;
  }

  setSelectedMonth(month: string): void {
    this.selectedMonth = month;
  }

  setSelectedYear(year: string): void {
    this.selectedYear = year;
  }

  createRange(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }

  getTableProperty(row: any, colIndex: number): any {
    return row[`col${colIndex}`];
  }
}