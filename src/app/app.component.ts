import { Component } from '@angular/core';
import { SecretTableData } from './shared/interfaces';
import { mockSecretTableData } from './shared/mock-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
