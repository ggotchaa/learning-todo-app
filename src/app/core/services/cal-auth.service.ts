import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { CalAngularService, ICvxClaimsPrincipal } from '@cvx/cal-angular';
import { Observable, Subscription, catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalAuthService implements OnDestroy {
  private authStateSubscription?: Subscription;

  private readonly _isSignedIn = signal<boolean>(false);
  private readonly _userName = signal<string>('');
  private readonly _claims = signal<ICvxClaimsPrincipal | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly isSignedIn = this._isSignedIn.asReadonly();
  readonly userName = this._userName.asReadonly();
  readonly claims = this._claims.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly welcomeMessage = computed(() => {
    if (this._isLoading()) {
      return 'Loading...';
    }

    const userName = this._userName();
    return userName ? `Welcome ${userName}!` : 'Please Sign In.';
  });

  readonly authStatus = computed(() => {
    if (this._error()) {
      return '❌ Error';
    }

    if (this._isLoading()) {
      return '🔄 Loading';
    }

    return this._isSignedIn() ? '✅ Authenticated' : '🔒 Not Authenticated';
  });

  constructor(private readonly calAngularService: CalAngularService) {
    this.watchAuthState();
  }

  ngOnDestroy(): void {
    this.authStateSubscription?.unsubscribe();
  }

  signIn(): Observable<unknown> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.calAngularService.userInitiatedSignIn().pipe(
      tap({
        next: (claimsPrincipal) => {
          const claims = (claimsPrincipal ?? null) as ICvxClaimsPrincipal | null;
          this._isSignedIn.set(true);
          this._userName.set(claims?.name ?? '');
          this._claims.set(claims);
          this._isLoading.set(false);
          this._error.set(null);
        }
      }),
      catchError((error) => {
        this._error.set('Sign in failed');
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  signOut(): Observable<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.calAngularService.userInitiatedSignOut().pipe(
      tap({
        next: (success: boolean) => {
          if (success) {
            this._isSignedIn.set(false);
            this._userName.set('');
            this._claims.set(null);
          }

          this._isLoading.set(false);
        }
      }),
      catchError((error) => {
        this._error.set('Sign out failed');
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  private watchAuthState(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.authStateSubscription = this.calAngularService.isUserSignedIn().subscribe({
      next: (isSignedIn: boolean) => {
        this._isSignedIn.set(isSignedIn);

        if (isSignedIn) {
          void this.loadClaims();
        } else {
          this.handleSignedOutState();
        }
      },
      error: (error) => {
        console.error('Failed to check CAL authentication status.', error);
        this._error.set('Failed to check authentication status');
        this._isLoading.set(false);
      }
    });
  }

  private async loadClaims(): Promise<void> {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const claims = await this.calAngularService.getClaims();
      this._userName.set(claims?.name ?? '');
      this._claims.set((claims ?? null) as ICvxClaimsPrincipal | null);
      this._isLoading.set(false);
      this._error.set(null);
    } catch (error) {
      console.error('Failed to load CAL claims.', error);
      this._error.set('Failed to load user claims');
      this._claims.set(null);
      this._userName.set('');
      this._isLoading.set(false);
    }
  }

  private handleSignedOutState(): void {
    this._userName.set('');
    this._claims.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
