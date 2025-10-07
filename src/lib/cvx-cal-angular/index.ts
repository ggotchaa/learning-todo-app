import { APP_INITIALIZER, Injectable, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export type CalAngularSettings = Record<string, unknown>;

export const CAL_CONFIGURATION_PATH = new InjectionToken<string>('CAL_CONFIGURATION_PATH');

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private settings: CalAngularSettings = {};

  constructor(private readonly http: HttpClient) {}

  async load(configPath: string | null | undefined): Promise<void> {
    if (!configPath) {
      this.settings = {};
      return;
    }

    try {
      const settings = await firstValueFrom(
        this.http.get<CalAngularSettings>(configPath)
      );

      if (settings && typeof settings === 'object') {
        this.settings = settings;
      } else {
        this.settings = {};
      }
    } catch (error) {
      console.error(`Failed to load CAL configuration from "${configPath}".`, error);
      this.settings = {};
    }
  }

  getSettings<T = unknown>(key: string): T {
    return (this.settings[key] as T) ?? (undefined as T);
  }
}

@Injectable({ providedIn: 'root' })
export class CalAngularService {
  private readonly signedIn$ = new BehaviorSubject<boolean>(true);
  private account: { username?: string } | null = null;

  isUserSignedIn(): Observable<boolean> {
    return this.signedIn$.asObservable();
  }

  getAccount<TAccount = { username?: string } | null>(): TAccount | null {
    return (this.account as TAccount | null) ?? null;
  }

  setAuthenticationState(isSignedIn: boolean, account: { username?: string } | null = null): void {
    this.account = account;
    this.signedIn$.next(isSignedIn);
  }
}

export function initializeCalConfiguration(
  configService: ConfigService,
  configPath: string
): () => Promise<void> {
  return () => configService.load(configPath);
}

@NgModule()
export class CalAngularModule {
  static forRoot(configPath: string): ModuleWithProviders<CalAngularModule> {
    return {
      ngModule: CalAngularModule,
      providers: [
        { provide: CAL_CONFIGURATION_PATH, useValue: configPath },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeCalConfiguration,
          deps: [ConfigService, CAL_CONFIGURATION_PATH],
          multi: true
        }
      ]
    };
  }
}
