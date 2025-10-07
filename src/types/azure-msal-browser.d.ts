declare module '@azure/msal-browser' {
  export interface AuthenticationResult {
    accessToken: string;
    idToken?: string;
    account?: unknown;
    expiresOn?: Date | string | number | null;
    [key: string]: unknown;
  }
}
