import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DateSelectionService } from './services/date-selection.service';
import { SecretTableData } from './shared/interfaces';
import { mockSecretTableData } from './shared/mock-data';

type AppView = 'reports' | 'tender-awards' | 'customers';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  selectedMonth = this.dateSelection.month;
  selectedYear = this.dateSelection.year;
  showSecretPopup = false;
  isDarkTheme = false;
  currentView: AppView = this.resolveRoute(this.router.url);

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

  secretTableData: SecretTableData[] = mockSecretTableData;

  private readonly routeSubscription: Subscription;

  constructor(private dateSelection: DateSelectionService, private router: Router) {
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentView = this.resolveRoute(event.urlAfterRedirects);
        if (this.currentView !== 'customers') {
          this.showSecretPopup = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  navigate(view: AppView): void {
    if (!this.isActive(view)) {
      void this.router.navigate([view]);
    }
  }

  isActive(view: AppView): boolean {
    return this.currentView === view;
  }

  onMonthChange(month: string): void {
    this.selectedMonth = month;
    this.dateSelection.setMonth(month);
  }

  onYearChange(year: string): void {
    this.selectedYear = year;
    this.dateSelection.setYear(year);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  private resolveRoute(url: string): AppView {
    const [path] = url.split('?');
    const firstSegment = path.replace(/^\//, '').split('/')[0];

    switch (firstSegment) {
      case 'customers':
        return 'customers';
      case 'tender-awards':
        return 'tender-awards';
      case 'reports':
      default:
        return 'reports';
    }
  }
}