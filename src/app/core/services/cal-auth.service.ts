import { Injectable } from '@angular/core';
import { CalAngularService, ConfigService } from '@cvx/cal-angular';
import { EMPTY, Observable, catchError, filter, switchMap, take, tap } from 'rxjs';

import { ApiService } from './api.base';

@Injectable({ providedIn: 'root' })
export class CalAuthService {
  private initialized = false;

  constructor(
    private readonly calAngularService: CalAngularService,
    private readonly configService: ConfigService,
    private readonly apiService: ApiService
  ) {}

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.calAngularService
      .isUserSignedIn()
      .pipe(
        tap((isSignedIn) => {
          if (!isSignedIn) {
            this.triggerInteractiveSignIn();
          }
        }),
        filter(Boolean),
        take(1),
        switchMap(() => this.authenticateWithBackend()),
        catchError((error) => {
          console.error('Failed to establish CAL authentication session.', error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private triggerInteractiveSignIn(): void {
    const autoSignIn = this.configService.getSettings<boolean>('autoSignIn');

    if (autoSignIn) {
      // auto sign-in is handled by CAL configuration
      return;
    }

    const interactiveService = this.calAngularService as unknown as {
      signIn?: () => Promise<unknown>;
      login?: () => Promise<unknown>;
      loginPopup?: () => Promise<unknown>;
    };

    void (interactiveService.signIn?.() ?? interactiveService.login?.() ?? interactiveService.loginPopup?.());
  }

  private authenticateWithBackend(): Observable<void> {
    return this.apiService.post<void>('/auth');
  }
}
