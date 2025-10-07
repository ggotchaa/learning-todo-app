declare module '@cvx/cal-angular' {
  import { ModuleWithProviders } from '@angular/core';
  import { Observable } from 'rxjs';

  export class CalAngularModule {
    static forRoot(configPath: string): ModuleWithProviders<CalAngularModule>;
  }

  export class CalAngularService {
    isUserSignedIn(): Observable<boolean>;
    getAccount<TAccount = { username?: string } | null>(): TAccount | null;
  }

  export class ConfigService {
    getSettings<T = unknown>(key: string): T;
  }
}
