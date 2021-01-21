import { AuthConfig } from 'angular-oauth2-oidc-codeflow-pkce';

export class CNRTAuthConfig {
	constructor(public id: string, public name: string, public config: AuthConfig) {}
}
