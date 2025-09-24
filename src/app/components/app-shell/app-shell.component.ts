import { Component } from '@angular/core';

import { SecretTableData } from '../../shared/interfaces';
import { mockSecretTableData } from '../../shared/mock-data';

type ShellTabId = 'reports' | 'tender-awards' | 'customers';

@Component({
  selector: 'app-shell',
  standalone: false,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent {
  readonly tabs: { id: ShellTabId; label: string }[] = [
    { id: 'reports', label: 'Bidding Reports' },
    { id: 'tender-awards', label: 'Tender Awards' },
    { id: 'customers', label: 'Customer List' }
  ];

  readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'None'
  ];

  readonly years = ['2025', '2024', '2023', '2022', '2021'];

  activeTab: ShellTabId = 'reports';
  selectedMonth = 'September';
  selectedYear = '2024';
  showSecretPopup = false;

  secretTableData: SecretTableData[] = mockSecretTableData;

  selectTab(tabId: ShellTabId): void {
    this.activeTab = tabId;
    if (tabId !== 'customers') {
      this.showSecretPopup = false;
    }
  }

  openSecretPopup(): void {
    this.showSecretPopup = true;
  }

  closeSecretPopup(): void {
    this.showSecretPopup = false;
  }
}
