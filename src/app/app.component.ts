import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideTrash2,
  lucideLock,
  lucideFileText,
  lucideDownload,
  lucideUpload,
  lucidePlus,
  lucideCircleCheck,
  lucideCircle,
  lucideArrowRight,
  lucideArrowUpDown,
  lucideRefreshCw,
  lucideRotateCcw,
  lucideFileSpreadsheet,
  lucideX,
  lucideSun,
  lucideMoon
} from '@ng-icons/lucide';

import { ReportsComponent } from './components/reports/reports.component';
import { TenderAwardsComponent } from './components/tender-awards/tender-awards.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { SecretTableData } from './shared/interfaces';
import { mockSecretTableData } from './shared/mock-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, ReportsComponent, TenderAwardsComponent, CustomerListComponent],
  providers: [
    provideIcons({
      lucideTrash2,
      lucideLock,
      lucideFileText,
      lucideDownload,
      lucideUpload,
      lucidePlus,
      lucideCircleCheck,
      lucideCircle,
      lucideArrowRight,
      lucideArrowUpDown,
      lucideRefreshCw,
      lucideRotateCcw,
      lucideFileSpreadsheet,
      lucideX,
      lucideSun,
      lucideMoon
    })
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bidding-tool-angular';

  selectedMonth = 'September';
  selectedYear = '2024';
  activeButton: 'BiddingReports' | 'TenderAwards' | 'CustomerList' = 'BiddingReports';
  showSecretPopup = false;
  isDarkTheme = false;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

  secretTableData: SecretTableData[] = mockSecretTableData;

  setActiveButton(button: 'BiddingReports' | 'TenderAwards' | 'CustomerList'): void {
    this.activeButton = button;
  }

  getButtonValue(button: string): 'BiddingReports' | 'TenderAwards' | 'CustomerList' {
    return button.split(' ').join('') as 'BiddingReports' | 'TenderAwards' | 'CustomerList';
  }

  setShowSecretPopup(show: boolean): void {
    this.showSecretPopup = show;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}