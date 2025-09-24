import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SecretTableData } from '../../shared/interfaces';
import { mockSecretTableData } from '../../shared/mock-data';

type ShellTabId = 'reports' | 'tender-awards' | 'customers';

type TabConfig = { id: ShellTabId; label: string; route: string };

@Component({
  selector: 'app-shell',
  standalone: false,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit, OnDestroy {
  readonly tabs: TabConfig[] = [
    { id: 'reports', label: 'Bidding Reports', route: 'reports' },
    { id: 'tender-awards', label: 'Tender Awards', route: 'tender-awards' },
    { id: 'customers', label: 'Customer List', route: 'customers' }
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

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        this.updateActiveTab(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSecretPopup(): void {
    if (this.activeTab === 'customers') {
      this.showSecretPopup = true;
    }
  }

  closeSecretPopup(): void {
    this.showSecretPopup = false;
  }

  private updateActiveTab(url: string): void {
    const tabFromUrl = this.resolveTabFromUrl(url);
    this.activeTab = tabFromUrl;

    if (tabFromUrl !== 'customers') {
      this.showSecretPopup = false;
    }

    if (url === '/' || url === '') {
      this.router.navigate(['/reports']);
    }
  }

  private resolveTabFromUrl(url: string): ShellTabId {
    const cleanPath = url.replace(/^\//, '').split('?')[0].split('#')[0];

    if (cleanPath.startsWith('tender-awards')) {
      return 'tender-awards';
    }

    if (cleanPath.startsWith('customers')) {
      return 'customers';
    }

    return 'reports';
  }
}
