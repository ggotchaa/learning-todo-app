import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SecretTableData } from '../../shared/interfaces';
import { mockSecretTableData } from '../../shared/mock-data';

type ShellTabId = 'reports' | 'tender-awards' | 'customers';

type TabConfig = { id: ShellTabId; label: string };

@Component({
  selector: 'app-shell',
  standalone: false,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit, OnDestroy {
  readonly tabs: TabConfig[] = [
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

  private readonly destroy$ = new Subject<void>();
  private readonly defaultTab: ShellTabId = 'reports';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const tabParam = params.get('tab');
        const resolvedTab = this.resolveTabFromQuery(tabParam);

        if (tabParam !== resolvedTab) {
          this.navigateToTab(resolvedTab, true);
          return;
        }

        this.setActiveTab(resolvedTab);
      });

    if (!this.route.snapshot.queryParamMap.has('tab')) {
      this.navigateToTab(this.defaultTab, true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(tabId: ShellTabId): void {
    if (this.activeTab === tabId) {
      return;
    }

    this.navigateToTab(tabId);
  }

  openSecretPopup(): void {
    if (this.activeTab === 'customers') {
      this.showSecretPopup = true;
    }
  }

  closeSecretPopup(): void {
    this.showSecretPopup = false;
  }

  private setActiveTab(tab: ShellTabId): void {
    this.activeTab = tab;

    if (tab !== 'customers') {
      this.showSecretPopup = false;
    }
  }

  private navigateToTab(tab: ShellTabId, replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      replaceUrl
    });
  }

  private resolveTabFromQuery(value: string | null): ShellTabId {
    const validTab = this.tabs.find(tab => tab.id === value)?.id;
    return validTab ?? this.defaultTab;
  }
}
