import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { ReportData } from '../../shared/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnChanges {
  @Input() selectedMonth = 'September';
  @Input() selectedYear = '2024';
  activeSubButton = 'Initiate';

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

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

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-700 border-green-300/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-300/30';
      case 'Complete':
        return 'bg-blue-500/20 text-blue-700 border-blue-300/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300/30';
    }
  }

  setActiveSubButton(button: string): void {
    this.activeSubButton = button;
  }

  setSelectedMonth(month: string): void {
    this.selectedMonth = month;
    this.loadData();
  }

  setSelectedYear(year: string): void {
    this.selectedYear = year;
    this.loadData();
  }
}