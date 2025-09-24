import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideDownload,
  lucideFileSpreadsheet,
  lucideFileText,
  lucideLock,
  lucideMoon,
  lucideRefreshCw,
  lucideRotateCcw,
  lucideSun,
  lucideTrash2,
  lucideUpload,
  lucideX
} from '@ng-icons/lucide';

import { ReportsComponent } from './reports/reports.component';
import { TenderAwardsComponent } from './tender-awards/tender-awards.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { SecretTableData } from './shared/interfaces';
import { mockSecretTableData } from './shared/mock-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    NgIconComponent,
    ReportsComponent,
    TenderAwardsComponent,
    CustomerListComponent
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideDownload,
      lucideFileSpreadsheet,
      lucideFileText,
      lucideLock,
      lucideMoon,
      lucideRefreshCw,
      lucideRotateCcw,
      lucideSun,
      lucideTrash2,
      lucideUpload,
      lucideX
    })
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedMonth = 'September';
  selectedYear = '2024';
  activeView: 'reports' | 'awards' | 'customers' = 'reports';
  showSecretPopup = false;
  isDarkTheme = false;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

  secretTableData: SecretTableData[] = mockSecretTableData;

  selectView(view: 'reports' | 'awards' | 'customers'): void {
    this.activeView = view;
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
