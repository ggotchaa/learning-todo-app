import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { CalAngularService, ConfigService } from '@cvx/cal-angular';
import type { AuthenticationResult } from '@azure/msal-browser';
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { firstValueFrom, from, isObservable, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
const DEFAULT_API_BASE_URL = environment.apiBaseUrl;

type RequestConfig = AxiosRequestConfig;
type AadTokenResult = string | AuthenticationResult | null | undefined;
type AadTokenResultSource =
  | Promise<AadTokenResult>
  | Observable<AadTokenResult>
  | AadTokenResult;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly client: AxiosInstance;

  constructor(
    @Optional() @Inject(API_BASE_URL) baseUrl: string | undefined,
    private readonly calAngularService: CalAngularService,
    private readonly configService: ConfigService
  ) {
    this.client = axios.create({
      baseURL: baseUrl ?? DEFAULT_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.acquireAccessToken();

        if (token) {
          this.attachAuthorizationHeader(config as InternalAxiosRequestConfig, token);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.normalizeError(error))
    );
  }

  get<T>(url: string, config?: RequestConfig): Observable<T> {
    return this.send<T>({ ...(config ?? {}), method: 'get', url });
  }

  post<T>(url: string, data?: unknown, config?: RequestConfig): Observable<T> {
    return this.send<T>({ ...(config ?? {}), method: 'post', url, data });
  }

  put<T>(url: string, data?: unknown, config?: RequestConfig): Observable<T> {
    return this.send<T>({ ...(config ?? {}), method: 'put', url, data });
  }

  patch<T>(url: string, data?: unknown, config?: RequestConfig): Observable<T> {
    return this.send<T>({ ...(config ?? {}), method: 'patch', url, data });
  }

  delete<T>(url: string, config?: RequestConfig): Observable<T> {
    return this.send<T>({ ...(config ?? {}), method: 'delete', url });
  }

  private send<T>(config: RequestConfig): Observable<T> {
    return from(
      this.client
        .request<T>(config as InternalAxiosRequestConfig)
        .then((response: AxiosResponse<T>) => response.data)
    );
  }

  private attachAuthorizationHeader(config: InternalAxiosRequestConfig, token: string): void {
    const headerValue = `Bearer ${token}`;

    let headers: AxiosHeaders;

    if (config.headers instanceof AxiosHeaders) {
      headers = config.headers;
    } else {
      headers = AxiosHeaders.from(config.headers ?? {});
    }

    headers.set('Authorization', headerValue);
    config.headers = headers;
  }
  private async acquireAccessToken(): Promise<string | undefined> {
    const scopes = this.resolveScopes();

    const token = await this.acquireTokenViaGetAADToken(scopes);

    if (token) {
      return token;
    }

    return this.acquireTokenViaLegacyStrategies(scopes);
  }

  private async acquireTokenViaGetAADToken(scopes: string[]): Promise<string | undefined> {
    const service = this.calAngularService as unknown as {
      getAADToken?: (scopes?: string[]) => AadTokenResultSource;
    };

    const getAADToken = service.getAADToken;

    if (typeof getAADToken !== 'function') {
      return undefined;
    }

    try {
      const result = getAADToken.call(
        service,
        scopes.length > 0 ? scopes : undefined
      );

      const resolved = await this.resolveTokenResult(result);

      return this.normalizeAccessToken(resolved);
    } catch (error) {
      console.error('CAL token acquisition using "getAADToken" failed.', error);
      return undefined;
    }
  }

  private async resolveTokenResult(result: AadTokenResultSource): Promise<AadTokenResult> {
    if (isObservable(result)) {
      return firstValueFrom(result);
    }

    if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
      return result as Promise<AadTokenResult>;
    }

    return result as AadTokenResult;
  }

  private normalizeAccessToken(token: AadTokenResult): string | undefined {
    if (typeof token === 'string' && token.trim().length > 0) {
      return token;
    }

    if (token && typeof token === 'object' && 'accessToken' in token) {
      const accessToken = (token as AuthenticationResult).accessToken;

      if (typeof accessToken === 'string' && accessToken.trim().length > 0) {
        return accessToken;
      }
    }

    return undefined;
  }

  private async acquireTokenViaLegacyStrategies(scopes: string[]): Promise<string | undefined> {
    const service = this.calAngularService as unknown as {
      acquireToken?: (scopes?: string[]) => Promise<string | undefined>;
      getAccessToken?: (scopes?: string[]) => Promise<string | undefined>;
      getToken?: (scopes?: string[]) => Promise<string | undefined>;
    };

    const acquisitionStrategies: Array<keyof typeof service> = ['acquireToken', 'getAccessToken', 'getToken'];

    for (const strategy of acquisitionStrategies) {
      const fn = service[strategy];

      if (typeof fn !== 'function') {
        continue;
      }

      try {
        const token = await fn.call(service, scopes.length > 0 ? scopes : undefined);

        if (token) {
          return token;
        }
      } catch (error) {
        console.error(`CAL token acquisition using "${strategy}" failed.`, error);
      }
    }

    return undefined;
  }

  private resolveScopes(): string[] {
    const aggregatedScopes: string[] = [];
    const scopeCandidates = [
      this.configService.getSettings<string[]>('graphScopes'),
      this.configService.getSettings<string[]>('oidcScopes')
    ];

    for (const candidate of scopeCandidates) {
      if (Array.isArray(candidate)) {
        aggregatedScopes.push(
          ...candidate.filter((scope): scope is string => typeof scope === 'string' && scope.length > 0)
        );
      }
    }

    return Array.from(new Set(aggregatedScopes));
  }

  private normalizeError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
      return new Error(message);
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('An unexpected error occurred.');
  }
}

