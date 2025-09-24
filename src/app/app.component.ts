import { Component, OnDestroy } from '@angular/core';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SecretTableData } from './shared/interfaces';
import { mockSecretTableData } from './shared/mock-data';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  selectedMonth = 'September';
  selectedYear = '2024';
  showSecretPopup = false;
  isDarkTheme = false;
  isCustomersRoute = false;

  private activeRouteComponent: Record<string, unknown> | null = null;
  private navigationSubscription: Subscription;
  private readonly exactMatchOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'None'
  ];

  years = ['2025', '2024', '2023', '2022', '2021'];

  secretTableData: SecretTableData[] = mockSecretTableData;

  constructor(private router: Router) {
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateRouteState(event.urlAfterRedirects);
        this.updateActiveComponentInputs();
      });

    this.updateRouteState(this.router.url);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  onRouteActivate(component: Record<string, unknown>): void {
    this.activeRouteComponent = component;
    this.updateActiveComponentInputs();
  }

  onRouteDeactivate(): void {
    this.activeRouteComponent = null;
  }

  onFilterChange(): void {
    this.updateActiveComponentInputs();
  }

  isRouteActive(path: string): boolean {
    return this.router.isActive(path, this.exactMatchOptions);
  }

  private updateRouteState(url: string): void {
    this.isCustomersRoute = url.startsWith('/customers');
    if (!this.isCustomersRoute) {
      this.showSecretPopup = false;
    }
  }

  private updateActiveComponentInputs(): void {
    if (!this.activeRouteComponent) {
      return;
    }

    this.assignIfPresent('selectedMonth', this.selectedMonth);
    this.assignIfPresent('selectedYear', this.selectedYear);

    this.callIfFunction('updateFiltersFromInput');
    this.callIfFunction('loadData');
  }

  private assignIfPresent(key: 'selectedMonth' | 'selectedYear', value: string): void {
    if (this.activeRouteComponent && key in this.activeRouteComponent) {
      (this.activeRouteComponent as Record<string, string>)[key] = value;
    }
  }

  private callIfFunction(methodName: 'updateFiltersFromInput' | 'loadData'): void {
    const component = this.activeRouteComponent;
    const method = component?.[methodName];
    if (typeof method === 'function') {
      method.call(component);
    }
  }
}
