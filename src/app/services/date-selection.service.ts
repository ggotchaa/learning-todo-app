import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DateSelection {
  month: string;
  year: string;
}

@Injectable({ providedIn: 'root' })
export class DateSelectionService {
  private readonly monthSubject = new BehaviorSubject<string>('September');
  private readonly yearSubject = new BehaviorSubject<string>('2024');

  readonly month$ = this.monthSubject.asObservable();
  readonly year$ = this.yearSubject.asObservable();

  readonly selection$ = combineLatest([this.month$, this.year$]).pipe(
    map(([month, year]) => ({ month, year }))
  );

  get month(): string {
    return this.monthSubject.value;
  }

  get year(): string {
    return this.yearSubject.value;
  }

  setMonth(month: string): void {
    this.monthSubject.next(month);
  }

  setYear(year: string): void {
    this.yearSubject.next(year);
  }
}